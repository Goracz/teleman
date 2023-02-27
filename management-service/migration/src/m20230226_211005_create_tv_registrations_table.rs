use sea_orm_migration::prelude::*;
use model::tv_registration::TvRegistration;
use model::tv_registration::TvRegistration::RegistrationStatus;
use crate::sea_orm::prelude::Uuid;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(TvRegistration::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(TvRegistration::Id)
                            .uuid()
                            .not_null()
                            .default(Uuid::new_v4())
                            .primary_key(),
                    )
                    .col(ColumnDef::new(TvRegistration::DeviceId).string().not_null())
                    .col(ColumnDef::new(TvRegistration::RegistrationStatus).string().not_null().default(RegistrationStatus::Pending))
                    .col(ColumnDef::new(TvRegistration::CreatedAt).datetime().not_null().default_now())
                    .col(ColumnDef::new(TvRegistration::UpdatedAt).datetime().not_null().default_now())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(TvRegistration::Table).to_owned())
            .await
    }
}
