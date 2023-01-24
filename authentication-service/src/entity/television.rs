use chrono::{DateTime, Local};
use diesel::{Identifiable, Insertable, Queryable};

use crate::entity::user::User;

#[derive(Debug, Identifiable, Queryable, Insertable)]
#[belongs_to(User)]
#[diesel(table_name = televisions)]
pub struct Television {
    id: uuid,
    user_id: uuid,
    create_date: DateTime<Local>,
    update_date: DateTime<Local>,
}
