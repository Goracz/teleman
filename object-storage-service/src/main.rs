use actix_cors::Cors;
use actix_web::{App, HttpServer, web};
use actix_web::web::Data;

use controller::{bucket_controller, object_controller};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let s3_client = minio::client::build_client().await;
    HttpServer::new(move || {
        let cors_configuration = Cors::default()
            .allow_any_origin()
            .allow_any_header()
            .allow_any_method();
        App::new()
            .wrap(cors_configuration)
            .service(
                web::scope("/api/v1")
                    .service(bucket_controller::create)
                    .service(bucket_controller::delete)
                    .service(object_controller::save_byte_array)
                    .service(object_controller::get_byte_array)
            )
            .app_data(Data::new(s3_client.to_owned()))
    })
        .bind(("0.0.0.0", 8085))?
        .run()
        .await
}
