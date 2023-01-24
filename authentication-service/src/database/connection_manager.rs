use std::env;

use diesel::{Connection, PgConnection};
use dotenvy::dotenv;

pub fn connect() -> PgConnection {
    dotenv().ok();

    let connection_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set!");

    PgConnection::establish(&connection_url)
        .unwrap_or_else(|_| panic!("Couldn't connect to the database!"))
}
