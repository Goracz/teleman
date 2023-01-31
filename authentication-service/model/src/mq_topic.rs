pub enum MqTopic {
    UserLogin,
    UserRegistration,
}

impl MqTopic {
    pub fn name(self) -> &'static str {
        match self {
            Self::UserLogin => "user-login",
            Self::UserRegistration => "user-registration",
        }
    }
}
