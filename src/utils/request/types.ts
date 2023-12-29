export interface ApiResponseData<T> {
  errorCode: number;
  body: T;
  errorMessage: string;
  responseTime: any;
  sign: string;
  tranStatus: string;
}
