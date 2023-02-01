use actix_web::web;
use argon2::Argon2;
use chrono::Local;
use password_hash::{PasswordHash, PasswordVerifier};
use rdkafka::producer::{BaseProducer, BaseRecord};
use sea_orm::{ActiveValue, DbConn, DbErr, TryIntoModel};
use uuid::Uuid;

use entity::user;
use model::login_credentials::LoginCredentials;
use model::mq_topic::MqTopic;
use repository::user_repository;
use utility::base64::encode;

use crate::token_service::generate_jwt_token;

pub async fn get_all(db: web::Data<DbConn>) -> Result<Vec<user::Model>, DbErr> {
    user_repository::find_all(db).await
}

pub async fn get_by_id(db: web::Data<DbConn>, id: Uuid) -> Result<Option<user::Model>, DbErr> {
    user_repository::find_by_id(db, id).await
}

pub async fn get_by_email(
    db: web::Data<DbConn>,
    email: String,
) -> Result<Option<user::Model>, DbErr> {
    user_repository::find_by_email(db, email).await
}

pub async fn register_user(
    db: web::Data<DbConn>,
    producer: web::Data<BaseProducer>,
    user: user::Model,
) -> Result<user::Model, String> {
    let is_user_registered_with_email =
        user_repository::find_by_email(db.to_owned(), user.email.to_owned()).await;
    match is_user_registered_with_email {
        Ok(user_option) => match user_option {
            Some(_) => return Err("A user is already registered with this email.".to_string()),
            None => (),
        },
        Err(_) => (),
    }
    let password_salt = Uuid::new_v4().to_string();
    let password_salt_encoded = encode(&password_salt);
    let password_hash_result =
        generate_password_hash(user.password.to_owned(), password_salt_encoded);
    match password_hash_result {
        Ok(password_hash) => {
            let mut user_to_persist = user::ActiveModel::from(user.to_owned());
            user_to_persist.password = ActiveValue::Set(password_hash);
            let persisted_user = user_repository::save(db.to_owned(), user_to_persist).await;
            match persisted_user {
                Ok(user) => {
                    let user_model_result = user.try_into_model();
                    match user_model_result {
                        Ok(user_model) => {
                            let user_model_serialization_result = user_model.to_json();
                            match user_model_serialization_result {
                                Ok(user_model_serialized) => {
                                    producer.send(
                                        BaseRecord::to(MqTopic::UserRegistration.name())
                                            .payload(user_model_serialized.as_bytes())
                                            .key(&Local::now().to_rfc3339()),
                                    ).expect(&format!("Could not notify listeners about user registration of user with email: {}.", user_model.email));
                                    Ok(user_model)
                                }
                                Err(_) => Err("Couldn't serialize user model.".to_string()),
                            }
                        }
                        Err(_) => Err("Couldn't convert user entity to user model.".to_string()),
                    }
                }
                Err(_) => Err("Couldn't register user.".to_string()),
            }
        }
        Err(_) => Err("Couldn't serialize user password.".to_string()),
    }
}

pub async fn login(
    db: web::Data<DbConn>,
    producer: web::Data<BaseProducer>,
    credentials: LoginCredentials,
) -> Result<String, String> {
    let user = user_repository::find_by_email(db, credentials.email).await;
    let generic_error_message = "The provided e-mail or password is invalid.".to_string();
    match user {
        Ok(user_option) => match user_option {
            Some(db_user) => {
                let password_encoded = encode(&credentials.password);
                let is_password_valid = is_password_valid(&password_encoded, &db_user.password);
                match is_password_valid {
                    true => {
                        let user_model_serialization_result = db_user.to_json();
                        match user_model_serialization_result {
                            Ok(user_model_serialized) => {
                                producer
                                    .send(
                                        BaseRecord::to(MqTopic::UserLogin.name())
                                            .payload(user_model_serialized.as_bytes())
                                            .key(&Local::now().to_rfc3339()),
                                    )
                                    .expect(&format!(
                                        "Could not notify listeners about user login of user with email: {}.",
                                        db_user.email,
                                    ));
                                Ok(generate_jwt_token(&db_user).unwrap())
                            }
                            Err(_) => Err("Couldn't serialize user model.".to_string()),
                        }
                    }
                    false => Err(generic_error_message),
                }
            }
            None => Err(generic_error_message),
        },
        Err(_) => Err("A server error has happened while logging you in.".to_string()),
    }
}

fn generate_password_hash(password: String, encoded_salt: String) -> Result<String, String> {
    let password_hash_result =
        PasswordHash::generate(Argon2::default(), encode(&password), &encoded_salt);
    match password_hash_result {
        Ok(password_hash) => Ok(password_hash.to_string()),
        Err(_) => Err("Failed to generate password hash.".to_string()),
    }
}

fn is_password_valid(user_password: &str, password_hash: &str) -> bool {
    let algorithms: &[&dyn PasswordVerifier] = &[&Argon2::default()];
    let password_hash_result = PasswordHash::new(password_hash);
    match password_hash_result {
        Ok(password_hash) => password_hash
            .verify_password(algorithms, user_password)
            .is_ok(),
        Err(_) => panic!("Couldn't parse user's password hash to PasswordHash."),
    }
}
