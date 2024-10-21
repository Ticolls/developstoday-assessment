import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CountryService {
  constructor(private readonly httpService: HttpService) {}

  async getAvailableCountries() {
    const { data } = await firstValueFrom(
      this.httpService.get('https://date.nager.at/api/v3/AvailableCountries'),
    );
    return data;
  }
}
