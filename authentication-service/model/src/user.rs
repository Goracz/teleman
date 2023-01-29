use sea_orm::Iden;

pub enum User {
    Table,
    Id,
    Email,
    Password,
    FirstName,
    LastName,
    CreateDate,
    UpdateDate,
}

impl Iden for User {
    fn unquoted(&self, s: &mut dyn std::fmt::Write) {
        match self {
            Self::Table => write!(s, "user"),
            Self::Id => write!(s, "id"),
            Self::Email => write!(s, "email"),
            Self::Password => write!(s, "password"),
            Self::FirstName => write!(s, "first_name"),
            Self::LastName => write!(s, "last_name"),
            Self::CreateDate => write!(s, "create_date"),
            Self::UpdateDate => write!(s, "update_date"),
        }
        .unwrap();
    }
}
