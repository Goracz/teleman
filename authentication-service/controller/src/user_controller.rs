use actix_web::{get, web, HttpResponse};
use sea_orm::DbConn;

use service::user_service;

#[get("/users")]
pub async fn get_users(db: web::Data<DbConn>) -> HttpResponse {
    let result = user_service::get_all(db).await;
    match result {
        Ok(users) => HttpResponse::Ok().json(users),
        Err(_) => HttpResponse::Unauthorized().finish(),
    }
}
