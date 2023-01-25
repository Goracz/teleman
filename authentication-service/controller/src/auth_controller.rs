use actix_web::{error, middleware, post, web, App, Error, HttpRequest, HttpResponse, HttpServer};
use model::login_credentials::LoginCredentials;
use model::registration_credentials::RegistrationCredentials;

#[post("/login")]
pub async fn login(credentials: web::Json<LoginCredentials>) -> Result<HttpResponse, Error> {
    Ok(HttpResponse::Ok().body("To be implemented"))
}

#[post("/register")]
pub async fn register(
    credentials: web::Json<RegistrationCredentials>,
) -> Result<HttpResponse, Error> {
    Ok(HttpResponse::Ok().body("To be implemented"))
}
