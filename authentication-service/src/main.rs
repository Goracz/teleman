use std::env;

use actix_cors::Cors;
use actix_web::web::Data;
use actix_web::{web, App, HttpServer};
use rdkafka::config::ClientConfig;
use rdkafka::producer::BaseProducer;

use controller::{auth_controller, meta_controller, user_controller};
use database::connection_manager::get_connection;
use migration::{Migrator, MigratorTrait};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    utility::log::init();
    let _guard = sentry::init((
        "https://0178dcd44f64421aa77ac3644a5b4677:28956194d9e741df888adaaabf42f59f@o148875.ingest.sentry.io/4504554135617536",
        sentry::ClientOptions {
            release: sentry::release_name!(),
            traces_sample_rate: 1.0,
            enable_profiling: true,
            profiles_sample_rate: 1.0,
            ..Default::default()
        },
    ));
    env::set_var("RUST_BACKTRACE", "1");

    let db_connection = get_connection()
        .await
        .expect("Failed to connect to database.");
    Migrator::up(&db_connection, None)
        .await
        .expect("Failed to persist pending migrations.");

    let kafka_producer = ClientConfig::new()
        .set("bootstrap.servers", "localhost:9092")
        .create::<BaseProducer>()
        .unwrap();

    HttpServer::new(move || {
        let cors_configuration = Cors::default()
            .allow_any_origin()
            .allow_any_header()
            .allow_any_method();
        App::new()
            .wrap(sentry_actix::Sentry::new())
            .wrap(cors_configuration)
            .service(
                web::scope("/api/v1")
                    .service(meta_controller::get_meta_data_about_service)
                    .service(auth_controller::login)
                    .service(auth_controller::register)
                    .service(user_controller::get_users),
            )
            .app_data(Data::new(db_connection.to_owned()))
            .app_data(Data::new(kafka_producer.to_owned()))
    })
    .bind(("0.0.0.0", 8084))?
    .run()
    .await
}
