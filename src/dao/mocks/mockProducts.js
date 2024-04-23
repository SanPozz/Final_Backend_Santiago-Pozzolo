import { faker } from "@faker-js/faker";

export const generateProductMocks= () => {
    const productMock = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.image.dataUri({width:300, height:350}),
        code: faker.string.sample(6),
        stock: faker.number.int({ min: 10, max: 100 }),
        category: faker.commerce.department(),
        status: true
    }

    return productMock
}