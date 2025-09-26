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
      // Log the error data for debugging
      console.log("Error response data:", error.response?.data);
      console.log("Error message:", error.response?.data?.message);
      
      // Throw the error so the component can catch it
      throw error;
    } else {
      console.error(" Unexpected Error:", error);
      throw error;
    }
  }
}

