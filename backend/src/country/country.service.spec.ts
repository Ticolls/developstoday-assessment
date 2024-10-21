import { Test, TestingModule } from '@nestjs/testing';
import { CountryService } from './country.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosHeaders, AxiosResponse } from 'axios';

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
        headers: new AxiosHeaders()
      },
    };

    jest.spyOn(httpService, 'get').mockReturnValue(of(response));

    const result = await service.getAvailableCountries();

    expect(httpService.get).toHaveBeenCalledWith(
      'https://date.nager.at/api/v3/AvailableCountries',
    );

    expect(result).toEqual(mockCountries);
  });
});
