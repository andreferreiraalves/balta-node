import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BackofficeModule } from './backoffice/backoffice.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://192.168.99.100:27017/petshop'),
    BackofficeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
