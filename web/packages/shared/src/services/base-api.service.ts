import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type Method,
} from "axios";
import { appConfig, URLController } from "../config";
import type {
  ApiRequestOptions,
  ApiResponseBody,
  BaseAPIServiceOptions,
  TokenProvider,
} from "../types";

export class ApiServiceError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
  response?: ApiResponseBody;

  constructor(
    message: string,
    options: {
      statusCode?: number;
      code?: string;
      details?: unknown;
      response?: ApiResponseBody;
    } = {},
  ) {
    super(message);
    this.name = "ApiServiceError";
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.details = options.details;
    this.response = options.response;
  }
}

export abstract class BaseAPIService {
  static readonly defaultTimeoutMs = 30_000;
  static readonly defaultMaxRetries = 2;

  protected readonly axios: AxiosInstance;
  protected readonly urlController: URLController;
  private readonly maxRetries: number;
  private readonly tokenProvider?: TokenProvider;

  protected constructor(options: BaseAPIServiceOptions = {}) {
    const baseUrl = options.baseUrl ?? appConfig.apiBaseUrl;

    this.urlController = new URLController(baseUrl);
    this.maxRetries = options.maxRetries ?? BaseAPIService.defaultMaxRetries;
    this.tokenProvider = options.tokenProvider;
    this.axios =
      options.axiosInstance ??
      axios.create({
        baseURL: baseUrl || undefined,
        timeout: options.timeoutMs ?? BaseAPIService.defaultTimeoutMs,
      });
  }

  protected get<TResponse>(
    url: string,
    options?: ApiRequestOptions,
  ): Promise<TResponse> {
    return this.request<TResponse>("GET", url, options);
  }

  protected post<TResponse, TBody = unknown>(
    url: string,
    options?: ApiRequestOptions<TBody>,
  ): Promise<TResponse> {
    return this.request<TResponse>("POST", url, options);
  }

  protected put<TResponse, TBody = unknown>(
    url: string,
    options?: ApiRequestOptions<TBody>,
  ): Promise<TResponse> {
    return this.request<TResponse>("PUT", url, options);
  }

  protected patch<TResponse, TBody = unknown>(
    url: string,
    options?: ApiRequestOptions<TBody>,
  ): Promise<TResponse> {
    return this.request<TResponse>("PATCH", url, options);
  }

  protected delete<TResponse, TBody = unknown>(
    url: string,
    options?: ApiRequestOptions<TBody>,
  ): Promise<TResponse> {
    return this.request<TResponse>("DELETE", url, options);
  }

  protected async request<TResponse, TBody = unknown>(
    method: Method,
    url: string,
    options: ApiRequestOptions<TBody> = {},
  ): Promise<TResponse> {
    const headers = await this.requestHeaders(options);
    const config: AxiosRequestConfig<TBody> = {
      data: options.body,
      headers,
      method,
      params: options.queryParameters,
      signal: options.signal,
      url,
    };

    return this.retry(async () => {
      try {
        const response = await this.axios.request<ApiResponseBody<TResponse>>(
          config,
        );
        return this.decodeResponse(response.data);
      } catch (error) {
        throw this.onError(error);
      }
    });
  }

  protected async requestHeaders<TBody>(
    options: ApiRequestOptions<TBody>,
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    };

    if (options.withToken) {
      const token = await this.tokenProvider?.();

      if (token) {
        headers.Authorization = `Bearer ${token}`;
        headers["x-access-token"] = token;
      }
    }

    return headers;
  }

  protected decodeResponse<TResponse>(
    response: ApiResponseBody<TResponse>,
  ): TResponse {
    if (response.status !== 0) {
      throw new ApiServiceError(response.message, {
        code: response.code,
        details: response.details,
        response,
      });
    }

    return response.data as TResponse;
  }

  protected onError(error: unknown): ApiServiceError {
    if (error instanceof ApiServiceError) return error;

    if (axios.isAxiosError(error)) {
      return this.onAxiosError(error);
    }

    return new ApiServiceError(
      error instanceof Error ? error.message : "Request failed",
    );
  }

  private onAxiosError(error: AxiosError<ApiResponseBody>) {
    const response = error.response?.data;

    if (response?.message) {
      return new ApiServiceError(response.message, {
        code: response.code,
        details: response.details,
        response,
        statusCode: error.response?.status,
      });
    }

    return new ApiServiceError(error.message || "Request failed", {
      statusCode: error.response?.status,
    });
  }

  private async retry<T>(request: () => Promise<T>): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= this.maxRetries; attempt += 1) {
      try {
        return await request();
      } catch (error) {
        lastError = error;
        if (attempt >= this.maxRetries || !this.shouldRetry(error)) break;
      }
    }

    throw lastError;
  }

  private shouldRetry(error: unknown) {
    if (!(error instanceof ApiServiceError)) return false;

    if (!error.statusCode) return true;
    return error.statusCode >= 500 || error.statusCode === 429;
  }
}
