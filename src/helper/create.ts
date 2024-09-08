import {faker} from '@faker-js/faker';

interface PayLoad {
    name: string;
    address: string;
    pass: string;
}

const payLoad: PayLoad = {
    name: faker.person.firstName(),
    address: faker.location.streetAddress(),
    pass: 'password'
};

export default payLoad;
