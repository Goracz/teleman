use base64::{engine::general_purpose, Engine as _};

pub fn encode(str: &str) -> String {
    general_purpose::STANDARD_NO_PAD.encode(str)
}

pub fn decode(str: &str) -> String {
    let bytes = general_purpose::STANDARD_NO_PAD.decode(str).unwrap();
    String::from_utf8_lossy(&bytes).to_string()
}
