use chrono::{DateTime, Local};
use diesel::{Identifiable, Insertable, Queryable};

use crate::entity::system_role::SystemRole;
use crate::entity::television::Television;

#[derive(Debug, Identifiable, Queryable, Insertable)]
#[diesel(table_name = users)]
pub struct User {
    id: uuid,
    email: String,
    first_name: String,
    last_name: String,
    create_date: DateTime<Local>,
    update_date: DateTime<Local>,
}
