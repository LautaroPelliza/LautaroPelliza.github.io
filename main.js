// Cargar los productos desde el archivo JSON y renderizarlos en el catalogo
let productos = [];
fetch('productos.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        productos = data;
        console.log('Productos cargados:', productos);
        renderizarCatalogo();
    })
    .catch(error => {
        console.error('Error al cargar el archivo JSON:', error);
    });

// Variables de DOM
let catalogoContainer = document.getElementById('container-catalogo');
let carritoContainer = document.getElementById('container-carrito');
let btnCarrito = document.getElementById('btn-carrito');
let btnFinalizar = document.getElementById('btn-finalizar');
let btnVaciar = document.getElementById('btn-vaciar');
let productosCarrito = document.getElementById('carrito-count');

// Variables de carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
if (carrito.length !== 0) {
    //confirmacion para cargar el carrito
    Swal.fire({
        title: 'Se ha detectado un carrito existente',
        text: '¿Desea cargar el carrito?',
        icon: 'question',
        iconColor: '#43a047',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = JSON.parse(localStorage.getItem('carrito'));
            renderizarCarrito();
        }else{
            carrito = [];
            renderizarCarrito();
        }
    })
    renderizarCarrito();
}

// Constructor
class compra {
    constructor(id,name,precio,imgsrc,cantidad){
        this.id = id
        this.name = name
        this.precio = precio
        this.imgsrc = imgsrc
        this.cantidad = cantidad
    }
}


// Renderizar el catalogo
function renderizarCatalogo(){
    catalogoContainer.innerHTML = '';
    for (let i = 0; i < productos.length; i++) {
        const {id, name, imgsrc, precio,cant} = productos[i];
        catalogoContainer.innerHTML += `
        <div class="card" >
            <img src="./img/productos/${imgsrc}.jpg" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <p class="card-text">$${precio}</p>
                <p class="card-text">x${cant}</p>
                <button class="btn-agregar" id='${id}' onclick="agregarAlCarrito(${id})">Comprar</button>
            </div>
        </div>
        `;
    }
}


// Renderizar el carrito
function renderizarCarrito(){
    carritoContainer.innerHTML = '';
    let total = 0
    document.getElementById('total-carrito').innerHTML = `Total: $${total}`
    for (let i = 0; i < carrito.length; i++) {
        const {id, name, imgsrc,precio,cantidad} = carrito[i];
        carritoContainer.innerHTML += `
        <div class="carrito-item" >
            <img src="./img/productos/${imgsrc}.jpg" class="cart-img-top" alt="...">
            <div class="item-body">
                <h5 class="item-title">${name}</h5>
                <p class="item-text">$${precio*cantidad}</p>
                <div class="item-cant">
                    <button class="btn-restar" id='${id}' onclick="restarDelCarrito(${id})"><img src="./img/iconos/Minus.png" class="img-minus"></button>
                    <p class="item-text">${cantidad}</p>
                    <button class="btn-sumar" id='${id}' onclick="sumarAlCarrito(${id})"><img src="./img/iconos/Plus.png" class="img-plus"></button>
                </div>
            </div>
        </div>
        `;
        total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
        document.getElementById('total-carrito').innerHTML = `Total: $${total}`
        if (carrito.length === 0) {
            document.getElementById('total-carrito').innerHTML = `Total: $0`
        }
        
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCantidad();
}


// Agregar un elemento al carrito
function agregarAlCarrito(id){
    const producto = productos.find((producto) => producto.id === id);
    if (carrito.find((product) => product.name === producto.name)) {
        console.log('el elemento ya existe en el carrito');
        Swal.fire({
            text: 'El elemento ya existe en el carrito',
            icon: 'warning',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 2000,
            background: '#fff',
            color: '#f9a825',
            iconColor: '#f9a825',
            timerProgressBar: true,
            width: 'fit-content',
            showCloseButton: true
        })
    }else{
        carrito.push(new compra(producto.id,producto.name,producto.precio,producto.imgsrc,1))
        Swal.fire({
            text: 'Articulo agregado',
            icon: 'success',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 2000,
            background: '#fff',
            color: '#43a047',
            iconColor: '#43a047',
            timerProgressBar: true,
            width: 'fit-content',
            showCloseButton: true,
        })
    };
    renderizarCarrito();
}

// Sumar un elemento al carrito
function sumarAlCarrito(id){
    const item = carrito.find((item) => item.id === id);
    item.cantidad++;
    renderizarCarrito();
}

// Eliminar un elemento del carrito
function restarDelCarrito(id){
    const item = carrito.find((item) => item.id === id);
    if (item.cantidad > 1) {
        item.cantidad--;
    } else {
        const index = carrito.indexOf(item);
        carrito.splice(index, 1);
        Swal.fire({
            text: 'Articulo eliminado',
            icon: 'success',
            toast: true,
            position: 'bottom',
            showConfirmButton: false,
            timer: 2000,
            background: '#fff',
            color: '#43a047',
            iconColor: '#43a047',
            timerProgressBar: true,
            width: 'fit-content',
            showCloseButton: true,
        })
    }
    renderizarCarrito();
}

// Vaciar el carrito
function vaciarCarrito(){
    carrito = [];
    renderizarCarrito();
    Swal.fire({
        text: 'Carrito vaciado',
        icon: 'success',
        toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 2000,
        background: '#fff',
        color: '#43a047',
        iconColor: '#43a047',
        timerProgressBar: true,
        width: 'fit-content',
        showCloseButton: true,
    })
}
btnVaciar.addEventListener('click', () => {
    if (carrito.length !== 0) {
        vaciarCarrito();
    }
})

// Finalizar la compra
function finalizarCompra(){
    Swal.fire({
        title: 'Formulario de Compra',
        color: '#004080',
        html: `
            <input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
            <input type="email" id="email" class="swal2-input" placeholder="Email">
        `,
        focusConfirm: false,
        confirmButtonText: 'Comprar',
        confirmButtonColor: '#004080',
        preConfirm: () => {
            const nombre = Swal.getPopup().querySelector('#nombre').value;
            const email = Swal.getPopup().querySelector('#email').value;
            if (!nombre || !email ) {
                Swal.showValidationMessage(`Por favor, completa todos los campos`);
            }
            return { nombre: nombre, email: email};
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title:'Compra realizada!',
                color: '#004080',
                html:`<p>Gracias ${result.value.nombre},<br> Cantidad de productos: ${cantidadCarrito()}<br>
                Total a pagar: $${carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)}
                <br> Nos pondremos en contacto con ${result.value.email} para coordinar el envio.<p>`,
                icon:'success',
                confirmButtonText:'Volver',
                confirmButtonColor: '#004080',
            }
            );
            carrito = [];
            renderizarCarrito();
        }
    })
}
btnFinalizar.addEventListener('click', () => {
    if (carrito.length !== 0) {
        finalizarCompra();
    }
})

// Mostrar/ocultar el carrito
btnCarrito.addEventListener('click', () => {
    let carritoSidebar = document.getElementById('carrito-sidebar');
    if (carritoSidebar.classList.contains('visible')) {
        carritoSidebar.classList.remove('visible');
        carritoSidebar.classList.add('hidden');
        btnCarrito.classList.remove('hidden');
        btnCarrito.classList.add('visible');
        productosCarrito.classList.remove('hidden');
        productosCarrito.classList.add('visible');
    } else {
        carritoSidebar.classList.remove('hidden');
        carritoSidebar.classList.add('visible');
        btnCarrito.classList.remove('visible');
        btnCarrito.classList.add('hidden');
        productosCarrito.classList.remove('visible');
        productosCarrito.classList.add('hidden');
    }
})




let cantidadCarrito = () => carrito.reduce((acc, item) => acc + item.cantidad, 0)

// Renderizar cantidad de elementos en el carrito
function renderizarCantidad(){
    if (carrito.length !== 0) {
        productosCarrito.innerHTML = `${carrito.length}`;
    }else{
        productosCarrito.innerHTML = `0`;
    }
}
renderizarCatalogo();