use std::env;

use chrono::Local;
use jsonwebtoken::{encode, EncodingKey, Header};
use uuid::Uuid;

use entity::user;
use model::jwt_claims::Claims;

pub fn generate_jwt_token(user: &user::Model) -> Option<String> {
    let secret = EncodingKey::from_secret(
        env::var("JWT_SECRET")
            .unwrap_or(Uuid::new_v4().to_string())
            .as_ref(),
    );
    let claims = Claims {
        aud: "teleman".to_string(),
        iat: Local::now().timestamp() as usize,
        iss: "teleman-authentication-service".to_string(),
        exp: (Local::now().timestamp() + 3600) as usize,
        nbf: 0,
        sub: user.email.to_owned(),
        email: user.email.to_owned(),
        first_name: user.first_name.to_owned()?,
        last_name: user.last_name.to_owned()?,
    };
    encode(&Header::default(), &claims, &secret).map_or_else(|_| None, |token| Some(token))
}
