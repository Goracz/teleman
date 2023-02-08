use actix_web::web;
use argon2::Argon2;
use chrono::Local;
use password_hash::{PasswordHash, PasswordVerifier};
use rdkafka::producer::{BaseProducer, BaseRecord};
use sea_orm::{ActiveModelTrait, ActiveValue, DbConn, DbErr, DeleteResult, IntoActiveModel, TryIntoModel};
use sea_orm::sea_query::tests_cfg::json;
use uuid::Uuid;

use entity::user;
use model::login_credentials::LoginCredentials;
use model::mq_topic::MqTopic;
use model::registration_credentials::RegistrationCredentials;
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

pub async fn update(db: web::Data<DbConn>, id: Uuid, new_user: user::Model) -> Result<user::Model, DbErr> {
    let db = db.get_ref();
    let user_option = user_repository::find_by_id(web::Data::new(db.to_owned()), id).await?;
    match user_option {
        Some(user) => {
            let mut user = user.into_active_model();
            user.first_name = ActiveValue::Set(new_user.first_name);
            user.last_name = ActiveValue::Set(new_user.last_name);
            let updated_user = user.save(db).await?;
            updated_user.try_into_model()
        }
        None => Err(DbErr::Custom("".to_owned())),
    }
}

pub async fn register_user(
    db: web::Data<DbConn>,
    producer: web::Data<BaseProducer>,
    user: RegistrationCredentials,
) -> Result<user::Model, DbErr> {
    let is_user_registered_with_email =
        user_repository::find_by_email(db.to_owned(), user.email.to_owned()).await?;
    if is_user_registered_with_email.is_some() {
        return Err(DbErr::Custom("A user is already registered with this email.".to_owned()));
    }
    let password_salt = Uuid::new_v4().to_string();
    let password_salt_encoded = encode(&password_salt);
    let password_hash = generate_password_hash(user.password, password_salt_encoded).unwrap();
    let user_to_persist = user::ActiveModel {
        id: ActiveValue::NotSet,
        email: ActiveValue::Set(user.email),
        password: ActiveValue::Set(password_hash),
        first_name: ActiveValue::Set(user.first_name),
        last_name: ActiveValue::Set(user.last_name),
        create_date: ActiveValue::NotSet,
        update_date: ActiveValue::NotSet,
    };
    let persisted_user = user_repository::save(db.to_owned(), user_to_persist).await?;
    let user_model = persisted_user.try_into_model()?;
    producer.send(
        BaseRecord::to(MqTopic::UserRegistration.name())
            .payload(
                &json!({
                    "id": user_model.id,
                    "email": user_model.email,
                    "firstName": user_model.first_name,
                    "lastName": user_model.last_name,
                }).to_string(),
            )
            .key(&Local::now().to_rfc3339()),
    ).expect(&format!("Could not notify listeners about user registration of user with email: {}.", user_model.email));
    Ok(user_model)
}

pub async fn login(
    db: web::Data<DbConn>,
    producer: web::Data<BaseProducer>,
    credentials: LoginCredentials,
) -> Result<String, String> {
    let user_option = user_repository::find_by_email(db, credentials.email).await.unwrap();
    let generic_error_message = "The provided e-mail or password is invalid.".to_string();
    match user_option {
        Some(db_user) => {
            let password_encoded = encode(&credentials.password);
            let is_password_valid = is_password_valid(&password_encoded, &db_user.password);
            if !is_password_valid {
                return Err(generic_error_message);
            }
            producer
                .send(
                    BaseRecord::to(MqTopic::UserLogin.name())
                        .payload(
                            &json!({
                                "id": db_user.id,
                                "email": db_user.email,
                                "firstName": db_user.first_name,
                                "lastName": db_user.last_name,
                            })
                                .to_string(),
                        )
                        .key(&Local::now().to_rfc3339()),
                )
                .expect(&format!(
                    "Could not notify listeners about user login of user with email: {}.",
                    db_user.email,
                ));
            Ok(generate_jwt_token(&db_user).unwrap())
        }
        None => Err(generic_error_message),
    }
}

pub async fn delete_by_id(db: web::Data<DbConn>, user_id: Uuid) -> Result<DeleteResult, DbErr> {
    user_repository::delete_by_id(db, user_id).await
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
