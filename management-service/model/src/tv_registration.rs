use sea_orm::Iden;

#[derive(Iden)]
pub enum TvRegistration {
    Id,
    DeviceId,
    RegistrationStatus,
    CreatedAt,
    UpdatedAt,
}
