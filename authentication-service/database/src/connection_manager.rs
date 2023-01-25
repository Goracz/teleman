use sea_orm::{Database, DbConn};

pub async fn get_connection() -> Result<DbConn, sea_orm::DbErr> {
    Database::connect("postgresql://postgres:919Lk4JEdj6zpbLc86zJ@containers-us-west-128.railway.app:6765/railway").await
}
