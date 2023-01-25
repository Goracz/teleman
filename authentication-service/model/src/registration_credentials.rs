use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct RegistrationCredentials {
    username: String,
    password: String,
    first_name: Option<String>,
    last_name: Option<String>,
}
