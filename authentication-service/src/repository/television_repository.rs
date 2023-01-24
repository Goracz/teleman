use diesel::PgConnection;

use crate::entity::television::Television;

mod television_repository {}

fn get_televisions(connection: &mut PgConnection) -> Vec<Television> {}
