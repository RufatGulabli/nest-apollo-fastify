export interface AxiosInstanceConfig {
  ENV_NAME: string;
  value?: string;
  isHeader?: boolean;
}

export interface AxiosOptions {
  baseUrl: string;
  headers: { [key: string]: string };
}
