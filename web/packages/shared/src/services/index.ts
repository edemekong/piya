export type ApiClientOptions = {
  baseUrl: string;
  fetcher?: typeof fetch;
};

export function createApiClient({ baseUrl, fetcher = fetch }: ApiClientOptions) {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");

  return {
    async get<T>(path: string, init?: RequestInit): Promise<T> {
      const response = await fetcher(`${normalizedBaseUrl}${path}`, {
        ...init,
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      return response.json() as Promise<T>;
    },
  };
}
