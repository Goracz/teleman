use actix_web::{get, HttpResponse, Responder};

use model::service_description::ServiceDescription;

#[get("/meta")]
pub async fn get_meta_data_about_service() -> impl Responder {
    HttpResponse::Ok().json(ServiceDescription {
        name: "Teleman Authentication Service".to_string(),
        version: "0.1.0".to_string(),
        description: "A service that provides authentication for Teleman".to_string(),
        author: "Roland Gorácz".to_string(),
        license: "UNLICENSED".to_string(),
    })
}
