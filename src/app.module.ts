import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DocumentsModule } from './documents/documents.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { QaModule } from './qa/qa.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'password',
    database: 'rag_db',
    autoLoadEntities: true,
    synchronize: true, // use migrations in prod
  }),
    AuthModule, UsersModule, DocumentsModule, IngestionModule, QaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
