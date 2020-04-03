import axios from "axios";


class common {

    async getRequest( endpoint ){
        const response = await axios.get(`${ endpoint }`);

    }

    async postRequest( endPoint){
        const response = await axios.post(`${ endPoint }`,)
    }
}

export default common;