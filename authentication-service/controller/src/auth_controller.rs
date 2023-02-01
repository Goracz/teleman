use actix_web::{post, web, HttpResponse};
use rdkafka::producer::BaseProducer;
use sea_orm::sea_query::tests_cfg::json;
use sea_orm::DbConn;

use entity::user;
use model::auth_response::AuthResponse;
use model::login_credentials::LoginCredentials;
use model::registration_credentials::RegistrationCredentials;
use service::user_service;

#[post("/login")]
pub async fn login(
    db: web::Data<DbConn>,
    producer: web::Data<BaseProducer>,
    credentials: web::Json<LoginCredentials>,
) -> HttpResponse {
    let result = user_service::login(db, producer, credentials.0).await;
    match result {
        Ok(token) => HttpResponse::Ok().json(AuthResponse { token }),
        Err(error) => HttpResponse::BadRequest().json(json!({ "message": error })),
    }
}

#[post("/register")]
pub async fn register(
    db: web::Data<DbConn>,
    producer: web::Data<BaseProducer>,
    credentials: web::Json<user::Model>,
) -> HttpResponse {
    let user_to_register = credentials.0;
    let registered_user = user_service::register_user(db, producer, user_to_register).await;
    match registered_user {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(db_error) => {
            println!("{:?}", db_error);
            HttpResponse::BadRequest().finish()
        }
    }
}
