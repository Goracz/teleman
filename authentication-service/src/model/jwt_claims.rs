#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    // JWT
    aud: string,
    exp: usize,
    iat: usize,
    iss: String,
    nbf: usize,
    sub: String,

    // Custom payload
    email: String,
    first_name: String,
    last_name: String,
    role: Role,
}
