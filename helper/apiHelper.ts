import axios from 'axios';

export async function testGetRequest(url: string, headers: object = {}): Promise<any> {
    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        throw new Error(`GET request failed: ${error}`);
    }
}

export async function testPostRequest(url: string, data: object, headers: object = {}): Promise<any> {
    try {
        const response = await axios.post(url, data, { headers });
        return response.data;
    } catch (error) {
        throw new Error(`POST request failed: ${error}`);
    }
}
