// Base API service
import axios, { AxiosRequestConfig, Method } from "axios";
import { BASE_URL } from "../../api/api-variable";

export interface ApiCallOptions<T = unknown> {
  endpoint: string;
  method?: Method;
  data?: T;
  headers?: Record<string, unknown>;
}

export async function apiRequest<TResponse = unknown, TPayload = unknown>(
  options: ApiCallOptions<TPayload>
): Promise<TResponse | null> {
  const { endpoint, method = "GET", data, headers } = options;

  const config: AxiosRequestConfig = {
    url: `${BASE_URL}${endpoint}`,
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    data,
  };

  try { 
    const response = await axios.request<TResponse>(config);
    console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(" API Error:", error.response?.data || error.message);
    } else {
      console.error(" Unexpected Error:", error);
    }
    return null;
  }
}

