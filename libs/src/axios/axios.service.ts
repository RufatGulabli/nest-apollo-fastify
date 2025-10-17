import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AxiosOptions } from '@libs/axios/fixtures';

@Injectable()
export class AxiosService {
  private readonly _client: AxiosInstance;

  constructor(configs: AxiosOptions) {
    this._client = axios.create({
      baseURL: configs.baseUrl,
      headers: configs.headers,
    });
  }

  get client() {
    return this._client;
  }
}
