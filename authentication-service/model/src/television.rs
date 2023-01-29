use sea_orm::Iden;

pub enum Television {
    Table,
    Id,
    UserId,
    CreateDate,
    UpdateDate,
}

impl Iden for Television {
    fn unquoted(&self, s: &mut dyn std::fmt::Write) {
        match self {
            Self::Table => write!(s, "television"),
            Self::Id => write!(s, "id"),
            Self::UserId => write!(s, "user_id"),
            Self::CreateDate => write!(s, "create_date"),
            Self::UpdateDate => write!(s, "update_date"),
        }
        .unwrap();
    }
}
