use actix_web::{web, HttpServer, App};
use authentication_service::controller::auth_controller;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            // .service()
            .route("/api/v1/login", web::post().to(auth_controller::login))
    })
    .bind(("0.0.0.0", 8084))?
    .run()
    .await
}
