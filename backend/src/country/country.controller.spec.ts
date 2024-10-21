import { Test, TestingModule } from '@nestjs/testing';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';

describe('CountryController', () => {
  let controller: CountryController;
  let service: CountryService;

  const mockCountryService = {
    getAvailableCountries: jest.fn().mockResolvedValue([
      { countryCode: 'BR', name: 'Brazil' },
      { countryCode: 'CA', name: 'Canada' },
      { countryCode: 'US', name: 'United States' },
    ]),
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
});
