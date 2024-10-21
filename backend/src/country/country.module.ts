import { Module } from '@nestjs/common';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [CountryController],
  providers: [CountryService],
  imports: [HttpModule]
})
export class CountryModule {}
