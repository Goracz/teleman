use actix_web::web;
use sea_orm::{ActiveModelTrait, ColumnTrait, DbConn, DbErr, EntityTrait, QueryFilter};
use uuid::Uuid;

use entity::user;
use entity::user::Entity as User;

pub async fn find_all(db: web::Data<DbConn>) -> Result<Vec<user::Model>, DbErr> {
    User::find().all(db.get_ref()).await
}

pub async fn find_by_id(db: web::Data<DbConn>, id: Uuid) -> Result<Option<user::Model>, DbErr> {
    User::find_by_id(id).one(db.get_ref()).await
}

pub async fn find_by_email(
    db: web::Data<DbConn>,
    email: String,
) -> Result<Option<user::Model>, DbErr> {
    User::find()
        .filter(user::Column::Email.to_owned().eq(email))
        .one(db.get_ref())
        .await
}

pub async fn save(
    db: web::Data<DbConn>,
    user_model: user::ActiveModel,
) -> Result<user::ActiveModel, DbErr> {
    user_model.save(db.get_ref()).await
}
