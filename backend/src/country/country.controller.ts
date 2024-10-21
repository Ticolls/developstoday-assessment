import { Controller, Get } from '@nestjs/common';
import { CountryService } from './country.service';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get('available')
  async getAvailableCountries() {
    return this.countryService.getAvailableCountries();
  }
}
