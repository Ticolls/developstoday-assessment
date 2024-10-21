import { Module } from '@nestjs/common';
import { CountryModule } from './country/country.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CountryModule, ConfigModule.forRoot({isGlobal: true})],
})
export class AppModule {}
