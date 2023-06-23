use rusoto_core::{Region};
use rusoto_s3::S3Client;

pub async fn build_client() -> S3Client {
    let region = Region::Custom {
        name: "local".to_owned(),
        endpoint: "http://localhost:9000".to_owned(),
    };

    return S3Client::new(region);
}
