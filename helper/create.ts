import faker from 'faker';

interface PayLoad {
    name: string;
    address: string;
    pass: string;
}

const payLoad: PayLoad = {
    name: faker.name.firstName(),
    address: faker.address.streetAddress(),
    pass: 'password'
};

export default payLoad;
