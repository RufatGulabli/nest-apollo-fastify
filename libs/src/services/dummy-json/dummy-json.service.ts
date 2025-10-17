import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AxiosService } from '@libs/axios/axios.service';
import { EXTERNAL_SERVICES } from '@libs/common';
import { randomInt } from 'crypto';
import { DummyObject } from './dummy.object';

@Injectable()
export class DummyJsonService {
  private quotes: DummyObject[] = [];

  constructor(
    @Inject(EXTERNAL_SERVICES.DUMMY_JSON)
    private readonly axiosService: AxiosService,
  ) {
    this.axiosService.client.defaults.headers.common['Content-Type'] =
      'application/json';

    this.axiosService.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        const status = error.response?.status;
        switch (status) {
          case 400:
            throw new BadRequestException(
              error.response?.data?.detail ||
                error.response?.data?.validations[0]?.error,
            );
          case 404:
            throw new NotFoundException(error.response?.data?.detail);
          default:
            throw new InternalServerErrorException();
        }
      },
    );
  }

  public async getRandomDummyJson(): Promise<DummyObject> {
    const randomNumber = randomInt(1, 100);

    const quote = (await this.axiosService.client.get(
      `/quotes/${randomNumber}`,
    )) as DummyObject;

    quote.likes = 0;

    this.quotes.push(quote);
    return quote;
  }

  public async like(id: number) {
    const quote = this.quotes.find((quote) => quote.id === id);
    if (!quote) {
      throw new NotFoundException('Quote not found.');
    }

    ++quote.likes;
    return quote;
  }
}
