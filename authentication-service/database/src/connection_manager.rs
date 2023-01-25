use std::env;

use sea_orm::{Database, DbConn};

pub async fn get_connection() -> Result<DbConn, sea_orm::DbErr> {
    Database::connect(env::var("POSTGRES_CONNECTION_STRING").unwrap()).await
}
