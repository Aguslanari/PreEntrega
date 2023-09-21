
const socket = io();

socket.emit('getProducts');

socket.on('productos', (products) => {
    const html = products.map((product) => {
        return (`   
        <tr>
            <td>${product.title}</td>
            <td>${product.code}</td>
            <td>${product.description}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
            <td>${product.category}</td>
        </tr>
        `);
    }).join(" ");
    document.getElementById('products').innerHTML = html;
});

const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', () => {
    try {
        fetch('/api/sessions/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        alert('Has cerrado sesion')
        window.location.replace('/static/login');
    } catch (error) {
        alert('Error al cerrar sesion');
        console.log(error);
    }
});