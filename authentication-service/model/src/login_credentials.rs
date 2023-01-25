use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct LoginCredentials {
    email: String,
    password: String,
}
