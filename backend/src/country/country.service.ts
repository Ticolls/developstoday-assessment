import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CountryService {
  private nagerUrl: string 
  private countriesnowUrl: string

  constructor(private readonly httpService: HttpService) {
    this.nagerUrl = process.env.NAGER_URL;
    this.countriesnowUrl = process.env.COUNTRIESNOW_URL;
  }

  async getAvailableCountries() {
    const { data } = await firstValueFrom(
      this.httpService.get(`${this.nagerUrl}/AvailableCountries`),
    );
    return data;
  }

  async getCountryInfo(countryCode: string) {
    try {
      const { data: countryInfo } = await firstValueFrom(
        this.httpService.get(
          `${this.nagerUrl}/CountryInfo/${countryCode}`,
        ),
      );

      const { data: isoData } = await firstValueFrom(
        this.httpService.post(
          `${this.countriesnowUrl}/countries/iso`,
          { country: countryInfo.commonName },
        ),
      );

      const iso3 = isoData.data.Iso3;
      const iso2 = isoData.data.Iso2;

      const [populationResponse, flagResponse] = await Promise.all([
        firstValueFrom(
          this.httpService.post(
            `${this.countriesnowUrl}/countries/population`,
            { iso3 },
          ),
        ),
        firstValueFrom(
          this.httpService.post(
            `${this.countriesnowUrl}/countries/flag/images`,
            { iso2 },
          ),
        ),
      ]);

      const populationHistory = populationResponse.data.data.populationCounts;
      const flagUrl = flagResponse.data.data.flag;

      return {
        name: countryInfo.commonName,
        borders: countryInfo.borders,
        populationHistory,
        flagUrl,
      };
    } catch (e) {
      if (e instanceof AxiosError) {
        throw new HttpException(
          `Error fetching country data: ${e.response.statusText}`,
          e.response.status,
        );
      } else {
        throw new HttpException(
          'An error occurred while fetching country data',
          500,
        );
      }
    }
  }
}
