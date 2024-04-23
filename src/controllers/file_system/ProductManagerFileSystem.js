import { promises as fs } from 'fs'

class ProductManager {

    static productId = 0;
    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct(product) {
        try {
            
            this.products = JSON.parse( await fs.readFile(this.path, 'utf-8') );
            ProductManager.productId = this.products.length + 1;
            console.log(this.products);

            const { title, description, price, thumbnail, code, stock, category } = product;

            if (!title || !description || !price || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios!");
                
                throw new Error("Todos los campos son obligatorios!");
            }

            if (this.products.find( prod => prod.code === code)) {
                console.log("Ya existe un producto con ese codigo");
                throw new Error("Ya existe un producto con ese codigo");
            }

            product.id = ProductManager.productId;

            this.products.push(product);

            await fs.writeFile(this.path, JSON.stringify(this.products, null, 4));

            console.log("Producto agregado correctamente");
            return true

        } catch (error) {
            console.log(error);
            return error
        }
    }

    async deleteProduct(id) {
        try {
            
            this.products = JSON.parse( await fs.readFile(this.path, 'utf-8') );
            const productIndex = this.products.findIndex(prod => prod.id === id);



            if (productIndex) {
                
                this.products.splice(productIndex, 1);

                await fs.writeFile(this.path, JSON.stringify(this.products, null, 4));
                console.log("Producto eliminado correctamente");
                return
            } else {
                console.log(`El producto con id ${id} no fue encontrado`)
                return
            }

        } catch (error) {
            console.log(error);
            return
        }
    }

    async updateProduct(id, product) {
        try {
            
            this.products = JSON.parse( await fs.readFile(this.path, 'utf-8') );

            const productIndex = this.products.findIndex(prod => prod.id === id);
            product.id = id;

            this.products[productIndex] = product;

            await fs.writeFile(this.path, JSON.stringify(this.products, null, 4));

        } catch (error) {
            console.log(error);
            return
            
        }
    }

    async getProducts() {
        try {
            
            this.products = JSON.parse( await fs.readFile(this.path, 'utf-8') );
            console.log("La lista de productos es:");
            console.table(this.products);
            return this.products

        } catch (error) {
            console.log(error);
            return
        }
    }

    async getProductById(id) {
        try {

            this.products = JSON.parse( await fs.readFile(this.path, 'utf-8') );

            const productSearch = this.products.find(prod => prod.id === id);

            if (productSearch) {
                console.log(`El producto con el id ${id} es:`);
                console.table(productSearch);
                return productSearch
            } else {
                console.log(`El producto con id ${id} no fue encontrado`)
                return
            }

        } catch (error) {
            console.log(error);
            return
        }
    }
}

export default ProductManager;

// const testing = async () => {
//     const productManager = new ProductManager('./json/products.json');

//     await productManager.addProduct({
//         title: "Product 1",
//         description: "Description",
//         price: 300,
//         thumbnail: "Thumbnail",
//         code: "1234",
//         stock: 10,
//         category: "Category"
//     })

//     await productManager.addProduct({
//         title: "Product 2",
//         description: "Description",
//         price: 400,
//         thumbnail: "Thumbnail",
//         code: "13123123",
//         stock: 10,
//         category: "Category"
//     })

//     await productManager.addProduct({
//         title: "Product 3",
//         description: "Description",
//         price: 600,
//         thumbnail: "Thumbnail",
//         code: "131212313123",
//         stock: 10,
//         category: "Category"
//     })

//     await productManager.getProducts();
//     await productManager.getProductById(2);


//     await productManager.updateProduct(1,{
//             title: "Product 10",
//             description: "NEW Description",
//             price: 500,
//             thumbnail: "Thumbnail",
//             code: "13asedx3",
//             stock: 10,
//             category: "NEW Category"
//         })

//     await productManager.deleteProduct(3);
// }

// testing();