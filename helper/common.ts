import axios from "axios";

class common {
    async getRequest(endpoint: string): Promise<void> {
        const response = await axios.get(`${endpoint}`);
    }

    async postRequest(endPoint: string): Promise<void> {
        const response = await axios.post(`${endPoint}`);
    }
}

export default common;
