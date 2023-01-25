use std::env;

use actix_web::{web, App, HttpServer};

use controller::{auth_controller, meta_controller};
use database::connection_manager::get_connection;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let _guard = sentry::init((
        env::var("SENTRY_DSN").unwrap_or(
            "https://0178dcd44f64421aa77ac3644a5b4677@o148875.ingest.sentry.io/4504554135617536"
                .to_owned(),
        ),
        sentry::ClientOptions {
            release: sentry::release_name!(),
            ..Default::default()
        },
    ));

    let db_connection = get_connection().await.unwrap();

    HttpServer::new(move || {
        App::new()
            .service(
                web::scope("/api/v1")
                    .service(meta_controller::get_meta_data_about_service)
                    .service(auth_controller::login)
                    .service(auth_controller::register),
            )
            .app_data(db_connection.to_owned())
    })
    .bind(("0.0.0.0", 8084))?
    .run()
    .await
}
