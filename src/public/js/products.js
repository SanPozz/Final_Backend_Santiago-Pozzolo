async function agregarProductoAlCarrito(productId) {
    const userCartId = await obtenerCarritoUsuarioActual();
    if (userCartId) {
        const response = await axios.post(`api/carts/${userCartId}/products/${productId}`);


    }
}

document.addEventListener("click", (e) => {
    if (e.target.id === 'agregar-producto') {
        const productId = e.target.dataset.id;

        agregarProductoAlCarrito(productId);
    }
});

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