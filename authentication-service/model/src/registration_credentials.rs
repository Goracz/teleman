use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct RegistrationCredentials {
    pub email: String,
    pub password: String,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
}
