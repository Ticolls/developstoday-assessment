import { Test, TestingModule } from '@nestjs/testing';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import { HttpException } from '@nestjs/common';

describe('CountryController', () => {
  let controller: CountryController;
  let service: CountryService;

  const mockCountryService = {
    getAvailableCountries: jest.fn().mockResolvedValue([
      { countryCode: 'BR', name: 'Brazil' },
      { countryCode: 'CA', name: 'Canada' },
      { countryCode: 'US', name: 'United States' },
    ]),
    getCountryInfo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountryController],
      providers: [
        {
          provide: CountryService,
          useValue: mockCountryService,
        },
      ],
    }).compile();

    controller = module.get<CountryController>(CountryController);
    service = module.get<CountryService>(CountryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a list of available countries in the correct format', async () => {
    const result = await controller.getAvailableCountries();

    expect(service.getAvailableCountries).toHaveBeenCalled();

    expect(result).toEqual([
      { countryCode: 'BR', name: 'Brazil' },
      { countryCode: 'CA', name: 'Canada' },
      { countryCode: 'US', name: 'United States' },
    ]);

    result.forEach((country) => {
      expect(country).toHaveProperty('countryCode');
      expect(country).toHaveProperty('name');
    });
  });

  it('should call CountryService with the correct countryCode', async () => {
    const mockCountryInfo = {
      borders: ['Argentina', 'Paraguay'],
      populationHistory: [
        { year: 2000, value: 170000000 },
        { year: 2010, value: 190000000 },
      ],
      flagUrl: 'https://some-flag-url.com/br.png',
    };

    jest.spyOn(service, 'getCountryInfo').mockResolvedValue(mockCountryInfo);

    const result = await controller.getCountryInfo('BR');

    expect(service.getCountryInfo).toHaveBeenCalledWith('BR');

    expect(result).toEqual(mockCountryInfo);
  });

  it('should throw an HttpException if CountryService throws an error', async () => {
    jest
      .spyOn(service, 'getCountryInfo')
      .mockRejectedValue(new HttpException('Error fetching country data', 404));

    await expect(controller.getCountryInfo('BR')).rejects.toThrow(
      new HttpException('Error fetching country data', 404),
    );
  });
});
