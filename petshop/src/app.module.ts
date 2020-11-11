import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BackofficeModule } from './modules/backoffice/backoffice.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/petshop'),
    BackofficeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
