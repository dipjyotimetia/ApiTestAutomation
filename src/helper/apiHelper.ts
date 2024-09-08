import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Helper function to make a GET request.
 * @param url The endpoint URL.
 * @param params Optional query parameters.
 * @returns The AxiosResponse object.
 */
export async function HttpGet(url: string, params?: any): Promise<AxiosResponse> {
  try {
    const response = await axios.get(url, { params });
    return response;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

/**
 * Helper function to make a POST request.
 * @param url The endpoint URL.
 * @param data The request body.
 * @returns The AxiosResponse object.
 */
export async function HttpPost(url: string, data: any): Promise<AxiosResponse> {
  try {
    const response = await axios.post(url, data);
    return response;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

/**
 * Helper function to make a PATCH request.
 * @param url The endpoint URL.
 * @param data The request body.
 * @returns The AxiosResponse object.
 */
export async function HttpPatch(url: string, data: any): Promise<AxiosResponse> {
  try {
    const response = await axios.patch(url, data);
    return response;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

/**
 * Helper function to make a DELETE request.
 * @param url The endpoint URL.
 * @returns The AxiosResponse object.
 */
export async function HttpDelete(url: string): Promise<AxiosResponse> {
  try {
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

/**
 * Error handling function.
 * @param error The error object.
 */
function handleError(error: any): void {
  if (axios.isAxiosError(error)) {
    console.error(`HTTP Error: ${error.response?.status} - ${error.response?.statusText}`);
  } else {
    console.error(`Unexpected Error: ${error}`);
  }
}