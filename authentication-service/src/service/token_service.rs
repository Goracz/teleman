use jsonwebtoken::{encode, EncodingKey, Header};

use super::super::model::jwt_claims as Claims;

pub fn generate_jwt_token(claims: &Claims) -> Option<String> {
    let token = encode(
        &Header::default(),
        claims,
        &EncodingKey::from_secret("secret".as_ref()),
    );
    match token {
        Ok(token) => Some(token),
        Err(_) => None,
    }
}
