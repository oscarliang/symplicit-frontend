export interface ApiError {
  message: string;
  path: string;
  statusCode: number;
  timestamp: string;
}

export interface RestApiResponse<T> {
  data: {
    statusCode: number;
    message: string;
    data: T;
  };
}
