import { Test, TestingModule } from '@nestjs/testing';
import { CountryService } from './country.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosHeaders, AxiosResponse } from 'axios';

const nagerUrl = process.env.NAGER_URL
const countriesnowUrl = process.env.COUNTRIESNOW_URL

describe('CountryService', () => {
  let service: CountryService;
  let httpService: HttpService;

  const mockCountries = [
    { countryCode: 'BR', name: 'Brazil' },
    { countryCode: 'CA', name: 'Canada' },
    { countryCode: 'US', name: 'United States' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountryService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CountryService>(CountryService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch available countries from the external API', async () => {
    const response: AxiosResponse = {
      data: mockCountries,
      status: 200,
      statusText: 'OK',
      headers: new AxiosHeaders(),
      config: {
        headers: new AxiosHeaders(),
      },
    };

    jest.spyOn(httpService, 'get').mockReturnValue(of(response));

    const result = await service.getAvailableCountries();

    expect(httpService.get).toHaveBeenCalledWith(
      `${nagerUrl}/AvailableCountries`,
    );

    expect(result).toEqual(mockCountries);
  });

  it('should fetch country info successfully', async () => {
    const mockCountryInfoResponse: AxiosResponse = {
      data: {
        commonName: 'Brazil',
        borders: ['Argentina', 'Paraguay'],
      },
      status: 200,
      statusText: 'OK',
      headers: new AxiosHeaders(),
      config: {
        headers: new AxiosHeaders(),
      },
    };

    const mockIsoDataResponse: AxiosResponse = {
      data: {
        data: {
          Iso3: 'BRA',
          Iso2: 'BR',
        },
      },
      status: 200,
      statusText: 'OK',
      headers: new AxiosHeaders(),
      config: {
        headers: new AxiosHeaders(),
      },
    };

    const mockPopulationResponse: AxiosResponse = {
      data: {
        data: {
          populationCounts: [
            { year: 2000, value: 170000000 },
            { year: 2010, value: 190000000 },
          ],
        },
      },
      status: 200,
      statusText: 'OK',
      headers: new AxiosHeaders(),
      config: {
        headers: new AxiosHeaders(),
      },
    };

    const mockFlagResponse: AxiosResponse = {
      data: {
        data: {
          flag: 'https://some-flag-url.com/br.png',
        },
      },
      status: 200,
      statusText: 'OK',
      headers: new AxiosHeaders(),
      config: {
        headers: new AxiosHeaders(),
      },
    };
    jest.spyOn(httpService, 'get').mockReturnValue(of(mockCountryInfoResponse));
    jest
      .spyOn(httpService, 'post')
      .mockReturnValueOnce(of(mockIsoDataResponse))
      .mockReturnValueOnce(of(mockPopulationResponse))
      .mockReturnValueOnce(of(mockFlagResponse));

    const result = await service.getCountryInfo('BR');

    expect(result).toEqual({
      borders: mockCountryInfoResponse.data.borders,
      populationHistory: mockPopulationResponse.data.data.populationCounts,
      flagUrl: mockFlagResponse.data.data.flag,
    });

    expect(httpService.get).toHaveBeenCalledWith(
      `${nagerUrl}/CountryInfo/BR`,
    );
    expect(httpService.post).toHaveBeenCalledWith(
      `${countriesnowUrl}/countries/iso`,
      { country: 'Brazil' },
    );
    expect(httpService.post).toHaveBeenCalledWith(
      `${countriesnowUrl}/countries/population`,
      { iso3: 'BRA' },
    );
    expect(httpService.post).toHaveBeenCalledWith(
      `${countriesnowUrl}/countries/flag/images`,
      { iso2: 'BR' },
    );
  });
});
