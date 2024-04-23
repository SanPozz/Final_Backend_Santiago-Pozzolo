const socket = io()

const formAddProduct = document.getElementById("form-add-product");
const containerProducts = document.getElementById("products-container")

socket.emit('loadProducts');

formAddProduct.addEventListener("submit", (e) => {
    e.preventDefault();
    const dataForm = new FormData(e.target);
    const productToAdd = Object.fromEntries(dataForm);

    socket.emit("addProduct", productToAdd);
})

socket.on('sentProducts', products => {
    containerProducts.innerHTML = '';
    products.forEach(prod => {
        containerProducts.innerHTML += `
        <div class="product-item">
            <p>ID: ${prod._id}</p>
            <p>Title: ${prod.title}</p>
            <p>Description: ${prod.description}</p>
            <p>Price: ${prod.price}</p>
            <p>Code: ${prod.code}</p>
            <p>Stock: ${prod.stock}</p>
            <p>Category: ${prod.category}</p>
            <p>Status: ${prod.status}</p>
            <button class="buttonDeleteProduct" data-id="${prod._id}">Eliminar Producto</button>
        </div>
        `
    });
})

containerProducts.addEventListener("click", function(event) {
    if (event.target.classList.contains("buttonDeleteProduct")) {
        let productIdDelete = event.target.dataset.id;
        socket.emit('productToDelete', productIdDelete)
    }})