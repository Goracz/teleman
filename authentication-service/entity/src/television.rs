use chrono::{DateTime, Local};
use uuid::Uuid;

#[derive(Debug)]
pub struct Television {
    id: Uuid,
    user_id: Uuid,
    create_date: DateTime<Local>,
    update_date: DateTime<Local>,
}
