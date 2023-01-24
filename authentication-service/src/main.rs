use actix_web::{web, App, HttpServer};

use authentication_service::controller::auth_controller;
use authentication_service::database::connection_manager::connect;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let connection = &mut connect();

    HttpServer::new(|| {
        App::new()
            .service(connection)
            .route("/api/v1/login", web::post().to(auth_controller::login))
    })
    .bind(("0.0.0.0", 8084))?
    .run()
    .await
}
