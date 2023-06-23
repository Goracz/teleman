use actix_web::{web, HttpResponse, post, delete};
use actix_web::http::StatusCode;
use rusoto_s3::{S3Client, CreateBucketRequest, S3, DeleteBucketRequest};
use serde::Serialize;

#[derive(Serialize)]
struct CustomCreateBucketOutput {
    location: Option<String>,
}

#[post("/{bucket_name}")]
pub async fn create(
    s3_client: web::Data<S3Client>,
    bucket_name: web::Path<String>,
) -> HttpResponse {
    let create_bucket_request = CreateBucketRequest {
        bucket: bucket_name.to_string(),
        acl: None,
        create_bucket_configuration: None,
        grant_full_control: None,
        grant_read: None,
        grant_read_acp: None,
        grant_write: None,
        grant_write_acp: None,
        object_lock_enabled_for_bucket: None,
    };
    let create_bucket_result = s3_client.create_bucket(create_bucket_request).await;
    match create_bucket_result {
        Ok(created_bucket_output) => {
            let created_bucket = CustomCreateBucketOutput {
                location: created_bucket_output.location,
            };
            let created_bucket_json = serde_json::to_string(&created_bucket).unwrap();
            HttpResponse::Ok().body(created_bucket_json)
        }
        Err(_) => HttpResponse::new(StatusCode::BAD_REQUEST),
    }
}

#[delete("/{bucket_name}")]
pub async fn delete(
    s3_client: web::Data<S3Client>,
    bucket_name: web::Path<String>,
) -> HttpResponse {
    let delete_bucket_request = DeleteBucketRequest {
        bucket: bucket_name.to_string(),
        expected_bucket_owner: None,
    };
    let delete_bucket_result = s3_client.delete_bucket(delete_bucket_request).await;
    match delete_bucket_result {
        Ok(_) => HttpResponse::new(StatusCode::NO_CONTENT),
        Err(_) => HttpResponse::new(StatusCode::BAD_REQUEST),
    }
}
