use actix_web::web;
use sea_orm::{ColumnTrait, DbConn, DbErr, EntityTrait, QueryFilter};
use uuid::Uuid;

use entity::television;
use entity::television::Entity as Television;

async fn find_by_id(db: web::Data<DbConn>, id: Uuid) -> Result<Option<television::Model>, DbErr> {
    Television::find_by_id(id).one(db.get_ref()).await
}

async fn find_by_user_id(
    db: web::Data<DbConn>,
    user_id: Uuid,
) -> Result<Vec<television::Model>, DbErr> {
    Television::find()
        .filter(television::Column::UserId.eq(user_id))
        .all(db.get_ref())
        .await
}
