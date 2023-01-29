use crate::sea_orm::prelude::Uuid;
use chrono::Local;
use model::television::Television;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Television::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Television::Id)
                            .uuid()
                            .not_null()
                            .default(Uuid::new_v4())
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Television::UserId).uuid().not_null())
                    .col(
                        ColumnDef::new(Television::CreateDate)
                            .date_time()
                            .not_null()
                            .default(Local::now()),
                    )
                    .col(
                        ColumnDef::new(Television::UpdateDate)
                            .date_time()
                            .not_null()
                            .default(Local::now()),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Television::Table).to_owned())
            .await
    }
}
