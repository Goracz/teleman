use std::env;

use actix_web::Either;
use chrono::Local;
use jsonwebtoken::{encode, EncodingKey, Header};

use crate::entity::user::User;
use crate::model::jwt_claims::Claims;

pub fn generate_jwt_token(claims: Either<Claims, &User>) -> Option<String> {
    let secret = EncodingKey::from_secret(env::var("JWT_SECRET").unwrap().as_ref());
    let actual_claims = match claims {
        Either::Left(inner_claims) => inner_claims,
        Either::Right(user) => Claims {
            aud: "teleman".to_string(),
            iat: Local::now().timestamp() as usize,
            iss: "teleman-authentication-service".to_string(),
            exp: (Local::now().timestamp() + 3600) as usize,
            nbf: 0,
            sub: user.email.to_owned(),
            email: user.email.to_owned(),
            first_name: user.first_name.to_owned(),
            last_name: user.last_name.to_owned(),
        },
    };
    encode(&Header::default(), &actual_claims, &secret).map_or_else(|_| None, |token| Some(token))
}
