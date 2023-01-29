use actix_web::web;
use argon2::Argon2;
use password_hash::{PasswordHash, PasswordVerifier};
use sea_orm::{ActiveValue, DbConn, DbErr, IntoActiveModel, TryIntoModel};
use uuid::Uuid;

use entity::user;
use model::login_credentials::LoginCredentials;
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

pub async fn register_user(
    db: web::Data<DbConn>,
    user: RegistrationCredentials,
) -> Result<user::Model, DbErr> {
    let password_salt = Uuid::new_v4().to_string();
    let password_salt_encoded = encode(&password_salt);
    let password_hash = generate_password_hash(user.password, password_salt_encoded);
    let user_to_persist = user::ActiveModel {
        id: ActiveValue::NotSet,
        email: ActiveValue::Set(user.email),
        password: ActiveValue::Set(password_hash),
        first_name: ActiveValue::Set(user.first_name),
        last_name: ActiveValue::Set(user.last_name),
        create_date: ActiveValue::NotSet,
        update_date: ActiveValue::NotSet,
    };
    let persisted_user = user_repository::save(db, user_to_persist).await;
    persisted_user
        .expect("Couldn't register user.")
        .try_into_model()
}

pub async fn login(db: web::Data<DbConn>, credentials: LoginCredentials) -> Result<String, String> {
    let user = user_repository::find_by_email(db, credentials.email).await;
    let db_user = user.unwrap().unwrap();
    let password_encoded = encode(&credentials.password);
    let is_password_valid = is_password_valid(&password_encoded, &db_user.password);
    if is_password_valid {
        return Ok(generate_jwt_token(&db_user).unwrap());
    }
    Err("The provided e-mail or password is invalid.".to_string())
}

fn generate_password_hash(password: String, encoded_salt: String) -> String {
    PasswordHash::generate(Argon2::default(), encode(&password), &encoded_salt)
        .expect("Failed to generate password hash.")
        .to_string()
}

fn is_password_valid(user_password: &str, password_hash: &str) -> bool {
    let algorithms: &[&dyn PasswordVerifier] = &[&Argon2::default()];
    PasswordHash::new(password_hash)
        .expect("Could not parse password hash string to type.")
        .verify_password(algorithms, user_password)
        .is_ok()
}
