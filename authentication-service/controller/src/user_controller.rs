use actix_web::{delete, get, HttpResponse, patch, web};
use sea_orm::DbConn;

use entity::user;
use service::user_service;

#[get("/users")]
pub async fn get_users(db: web::Data<DbConn>) -> HttpResponse {
    let result = user_service::get_all(db).await;
    match result {
        Ok(users) => HttpResponse::Ok().json(users),
        Err(_) => HttpResponse::Unauthorized().finish(),
    }
}

#[get("/users/{user_id}")]
pub async fn get_user_by_id(db: web::Data<DbConn>, path: web::Path<uuid::Uuid>) -> HttpResponse {
    let user_id = path.into_inner();
    let result = user_service::get_by_id(db, user_id).await;
    match result {
        Ok(user_option) => {
            match user_option {
                Some(user) => HttpResponse::Ok().body(serde_json::to_string(&user).unwrap()),
                None => HttpResponse::NotFound().finish(),
            }
        }
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

#[patch("/users/{user_id}")]
pub async fn update_user(db: web::Data<DbConn>, path: web::Path<uuid::Uuid>, new_user: web::Json<user::Model>) -> HttpResponse {
    let user_id = path.into_inner();
    let updated_user_result = user_service::update(db, user_id, new_user.into_inner()).await;
    match updated_user_result {
        Ok(updated_user) => HttpResponse::Ok().body(serde_json::to_string(&updated_user).unwrap()),
        Err(_) => HttpResponse::BadRequest().finish(),
    }
}

#[delete("/users/{user_id}")]
pub async fn delete_user(db: web::Data<DbConn>, path: web::Path<uuid::Uuid>) -> HttpResponse {
    let user_id = path.into_inner();
    let result = user_service::delete_by_id(db, user_id).await;
    match result {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::BadRequest().finish(),
    }
}
