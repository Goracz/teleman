use actix_web::{get, HttpResponse, put, web};
use actix_web::http::StatusCode;
use rusoto_s3::{GetObjectRequest, PutObjectRequest, S3, S3Client};
use serde_json::json;
use tokio::io::AsyncReadExt;

#[get("/{bucket}/{key}")]
pub async fn get_byte_array(
    s3_client: web::Data<S3Client>,
    bucket: web::Path<String>,
    key: web::Path<String>,
) -> HttpResponse {
    let req = GetObjectRequest {
        bucket: bucket.to_string(),
        key: key.to_string(),
        ..Default::default()
    };

    let result = s3_client.get_object(req).await;
    match result {
        Ok(output) => {
            let body = output.body.unwrap();
            let mut body_bytes: Vec<u8> = Vec::new();
            body.into_async_read().read_to_end(&mut body_bytes).await.unwrap();
            HttpResponse::Ok().json(json!({"data": body_bytes}))
        }
        Err(_) => HttpResponse::new(StatusCode::BAD_REQUEST),
    }
}

#[put("/{bucket}/{key}")]
pub async fn save_byte_array(
    s3_client: web::Data<S3Client>,
    bucket: web::Path<String>,
    key: web::Path<String>,
    data: web::Json<Vec<u8>>,
) -> HttpResponse {
    let req = PutObjectRequest {
        bucket: bucket.to_string(),
        key: key.to_string(),
        body: Some(data.to_owned().into()),
        ..Default::default()
    };

    let result = s3_client.put_object(req).await;
    match result {
        Ok(_) => HttpResponse::new(StatusCode::CREATED),
        Err(_) => HttpResponse::new(StatusCode::BAD_REQUEST),
    }
}
