use chrono::{DateTime, Local};
use uuid::Uuid;

#[derive(Debug)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    pub password: String,
    pub iv: String,
    pub first_name: String,
    pub last_name: String,
    pub create_date: DateTime<Local>,
    pub update_date: DateTime<Local>,
}
