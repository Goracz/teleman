use serde::Serialize;

#[derive(Serialize)]
pub struct ServiceDescription {
    pub name: String,
    pub version: String,
    pub description: String,
    pub author: String,
    pub license: String,
}
