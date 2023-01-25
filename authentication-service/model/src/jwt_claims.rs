use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    // JWT
    pub aud: String,
    pub exp: usize,
    pub iat: usize,
    pub iss: String,
    pub nbf: usize,
    pub sub: String,

    // Custom payload
    pub email: String,
    pub first_name: String,
    pub last_name: String,
}
