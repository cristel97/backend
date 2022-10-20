let allProductos = [];
window.addEventListener('load', getAllProducts);
// The URLSearchParams API provides a consistent interface to the bits and pieces of the URL and allows trivial manipulation of the query string
const valores = window.location.search;
const urlParams = new URLSearchParams(valores);
let idCarrito = 0;
const productos = [];

if (urlParams.has('id')) {
    idCarrito = urlParams.get('id');
    let h1 = document.getElementById('h1_title');
    h1.innerHTML = `Listado de Productos del Carrito ${idCarrito}`;
    cargarProductos();
} else {
    let h1 = document.getElementById('h1_title');
    h1.innerHTML = 'Esta página no muestra información sin un ID de carrito';
}

function cargarProductos() {
    showProductos([]);
    fetch(`/api/carrito/${idCarrito}/productos`, {
        method: 'GET', 
        //The browser needs to know the media type of a resource
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((res) => {
        res.json()
            .then((response) => {
                if (Array.isArray(response)) {
                    productos.push(...response);
                    showProductos(productos);
                } 
            })
            .catch((e) => console.log(e));
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function showProductos(listaDeProductos) {
    div_prod = document.getElementById('productosCarrito');
    let html = '';
    if (listaDeProductos.length > 0) {
        html = `
        <table class="table bg-dark">
        <tr>
            <th class="text-info">Id</th>
            <th class="text-info">Nombre</th>
            <th class="text-info">Precio</th>
            <th class="text-info">Imagen</th>
        </tr>`;
        listaDeProductos.forEach(p => {
            html += `
            <tr>
                <td class="text-white">
                    <button type="button" class="btn btn-primary">
                        ${p.id}
                    </button>
                </td>
                <td class="text-white">${p.name}</td>
                <td class="text-white">${p.price}</td>
                <td class="text-white"><img src="${p.url}" alt="${p.name}" height="32"></td>
                <td class="text-white"><button class="btn btn-danger btnDeleteProducto" id="${p.id}">X</button></td>
            </tr>`;
        });
        html += `</table>`;
        html += `<button type="button" class="btn btn-primary" data-bs-toggle="modal" id=" " data-bs-target="#staticBackdrop">Add Productos</button>`;
    } else {
        html = `<p class="mt-3 mb-3 p-3">No se encontraron productos</p>`;
        html += `<button type="button" class="btn btn-primary" data-bs-toggle="modal" id="addProductos" data-bs-target="#staticBackdrop">Add Productos</button>`;
        
    }
    div_prod.innerHTML = html;
    addEventsToButtons();
}

function addEventsToButtons() {
    document.querySelectorAll('.btnDeleteProducto').forEach(item => {
        item.addEventListener('click', e => {
            idProducto = e.target.getAttribute('id');
            deleteProductFromCarrito(idProducto);
        });
    });
}

async function deleteProductFromCarrito(idProducto) {
    let res = await fetch(`/api/carrito/${idCarrito}/productos/${idProducto}`, {
        method: 'DELETE', 
        //The browser needs to know the media type of a resource
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let respuesta = await res.json();
    location.reload();
}

// This works fine
function showTableProductos(listaDeProductos) {
    const divBodyProduct = document.getElementById('bodyProduct');
    let html = '';
    if (listaDeProductos.length > 0) {
        html = `
        <table class="table bg-dark">
        <tr>
            <th class="text-info">Id</th>
            <th class="text-info">Nombre</th>
            <th class="text-info">Precio</th>
            <th class="text-info">Imagen</th>
            <th class="text-info">Agregar</th>
        </tr>`;
        listaDeProductos.forEach(p => {
            html += `
            <tr>
                <td class="text-white">
                    <button type="button" class="btn btn-primary">${p.id}</button>
                </td>
                <td class="text-white">${p.name}</td>
                <td class="text-white">${p.price}</td>
                <td class="text-white"><img src="${p.url}" alt="${p.name}" height="32"></td>
                <td class="text-white">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="${p.id}">
                    </div>
                </td>
            </tr>`;
        });
        html += `</table>`;
    } else {
        html = `<p class="mt-3 mb-3 p-3">No se encontraron productos</p>`;
    }
    divBodyProduct.innerHTML = html;
}

async function getAllProducts() {
    allProductos = [];
    showTableProductos([]);
    let res = await fetch('./api/productos', {
        method: 'GET', 
        //The browser needs to know the media type of a resource
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let respuesta = await res.json();
    if (Array.isArray(respuesta)) {
        allProductos.push(...respuesta);
        showTableProductos(allProductos);
    }
}

// Handle Modal
const btnAgregarProductos = document.getElementById('btnAgregarProductos');

btnAgregarProductos.addEventListener('click', async () => {
    let ids = [];
    document.querySelectorAll('.form-check-input').forEach(item => {
        if (item.checked) {
            ids.push(item.id);
        }
    });
    console.log('ids: ', ids, ' idCarrito: ', idCarrito);
    const modal = document.getElementById('staticBackdrop');
    let closeModal = bootstrap.Modal.getInstance(modal);
    closeModal.hide();
    const bodyPost = {"ids": ids};
    let res = await fetch(`/api/carrito/${idCarrito}/productos`, {
        method: 'POST', 
        body: JSON.stringify(bodyPost),
        //The browser needs to know the media type of a resource
        headers: {
            'Content-Type': 'application/json'
        }
    });
    await res.json();
    location.reload();
});
