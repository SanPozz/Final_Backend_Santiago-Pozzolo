

let productsContainer = document.getElementById('user-cart');
let finishButton = document.getElementById('finish-button');
let totalCart = document.getElementById('total-cart');
let cleanCart = document.getElementById('clean-button');

async function obtenerCarritoUsuarioActual() {
    const response = await fetch('api/sessions/current');
    const data = await response.json();
    if (data.user) {
        return data.user.user_cart;
    } else {
        console.error('Error al obtener el carrito de usuario actual');
        return null;
    }
}

async function carritoRender() {
    const userCartId = await obtenerCarritoUsuarioActual();
    if (userCartId) {
        axios.get(`api/carts/${userCartId}`)
            .then((response) => {
                let total = 0;
                response.data.products.forEach((product) => {
                    total += product.product_id.price * product.quantity;
                });
                totalCart.innerHTML = `Total: ${total} $`;
                const userCart = response.data;
                productsContainer.innerHTML = '';
                userCart.products.forEach((product) => {
                    const productElement = document.createElement('div');
                    productElement.innerHTML = `
                    <div>
                        <h3>${product.product_id.title}</h3>
                        <p>Precio: ${product.product_id.price} $</p>
                        <p>Subtotal: ${product.product_id.price * product.quantity} $</p>
                        <p>Cantidad: ${product.quantity}</p>
                        <button id="buttonDeleteProduct" data-id="${product.product_id._id}">Eliminar Producto</button>
                        <hr>
                    </div>
                    `;
                    productsContainer.appendChild(productElement);
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

carritoRender()


finishButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const userCartId = await obtenerCarritoUsuarioActual();
    if (userCartId) {

        try {
            
            const response = await axios.post(`api/carts/${userCartId}/purchase`);
            const data = response.data;

            if (!data.ticketToAdd) {
                throw new Error('No se pudo generar el ticket');
            }

            ticket = data.ticketToAdd

            if (ticket.productsPurchased.length > 0) {
                const response2 = await axios.post(`api/tickets/generate-ticket`, data.ticketToAdd);
                console.log(response2.data)

                const response3 = await axios.post(`api/mailing/purchase/${userCartId}`, data.ticketToAdd);
                console.log(response3.data)
                alert('Se ha generado el ticket con éxito');
                location.reload();
            } else {
                console.log('No se pudo generar el ticket');
            }

        } catch (error) {
            console.log(error)

        }

    }
})

document.addEventListener('click', async (e) => {
    if (e.target.id === 'buttonDeleteProduct') {
        const userCartId = await obtenerCarritoUsuarioActual();
        const productId = e.target.dataset.id;
        const responseDelete = await axios.delete(`api/carts/${userCartId}/products/${productId}`);
        console.log(responseDelete.data)
        location.reload();
    }
})

cleanCart.addEventListener('click', async (e) => {
    const userCartId = await obtenerCarritoUsuarioActual();
    const responseDelete = await axios.delete(`api/carts/${userCartId}`);
    console.log(responseDelete.data)
    location.reload();
})

