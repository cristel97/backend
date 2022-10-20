const getYd = () => {
    const id = document.getElementById("idProd").value;
    fetch(`http://localhost:8080/api/productos/${id}`)
        .then((data) => {
            window.location.replace(data.url);
        })
        .then((post) => {
            console.log(post.title);
        });
};
const method = {
    method: "DELETE",
};
const delYd = () => {
    const id = document.getElementById("deletId").value;
    fetch(`http://localhost:8080/api/productos/${id}`, method)
        .then((data) => {
            window.location.replace(data.url);
        })
        .then((post) => {
            console.log(post.title);
        });
};

const getCarro = () => {
    const id = document.getElementById("idCarro").value;
    fetch(`http://localhost:8080/api/carrito/${id}/productos`)
        .then((data) => {
            window.location.replace(data.url);
        })
        .then((post) => {
            console.log(post.title);
        });
};
const delProd = () => {
    const id = document.getElementById("deletProd").value;
    const prod = document.getElementById("prod").value;
    fetch(`http://localhost:8080/api/carrito/${id}/prods/${prod}`, method)
        .then((data) => {
            window.location.replace(data.url);
        })
        .then((post) => {
            console.log(post.title);
        });
};

const productos = [];
let oneProduct = {};
window.addEventListener('load', getAllProducts);

function getAllProducts() {
    showProductos([]);
    fetch('./api/productos', {
        method: 'GET', 
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

function enviarDatos() {
    let store = document.getElementById('store');
    let name = document.getElementById('name');
    let price = document.getElementById('price');
    let url = document.getElementById('url');
    let description = document.getElementById('description');
    let code = document.getElementById('code');
    let stock = document.getElementById('stock');
    let producto = {
        "store": store,
        "name": name.value,
        "price": price.value,
        "url": url.value,
        "description": description.value,
        "code": code.value,
        "stock": stock.value
    };
    fetch('./api/productos', {
        method: 'POST', 
        body: JSON.stringify(producto),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((res) => {
        res.json()
            .then((response) => {
                console.log('Success:', response);
                store.value = '';
                name.value = '';
                price.value = '';
                url.value = '';
                description.value = '';
                code.value = '';
                stock.value = '';
                location.reload();
            })
            .catch((e) => console.log(e));
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function showProductos(listaDeProductos) {
    div_prod = document.getElementById('productos');
    let html = '';
    if (listaDeProductos.length > 0) {
        listaDeProductos.forEach(p => {
            html += `
            <div class="row">
                <div class="col-sm-6">
                    <div class="card" style="width: 18rem;">
                    <img src="${p.url}" class="card-img-top" alt="${p.name}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${p.name}</h5>
                        <p class="card-text">${p.store}</p>
                        <p class="card-text">${p.description}</p>
                        <p class="card-text ">$${p.price}</p>
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-prod-id="${p.id}" data-bs-target="#staticBackdrop">
                        ${p.id}
                    </button>
                    </div>
                    </div>
                </div>
            </div>
            `
        });
    } else {
        html = `<p class="mt-3 mb-3 p-3">No se encontraron productos</p>`;
    }
    div_prod.innerHTML = html;
}

async function getOneProduct(id) {
    let res = await fetch(`./api/productos/${id}`, {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let respuesta = await res.json();
    return respuesta;
}

function generateProductDetail(p) {
    html = `<form>
    <div class="mb-3">
        <label for="store_detail" class="form-label">Marca</label>
        <input type="text" class="form-control" id="store_detail" value="${p.store}"/>
    </div>
    <div class="mb-3">
        <label for="name_detail" class="form-label">Nombre</label>
        <input type="text" class="form-control" id="name_detail" value="${p.name}"/>
    </div>
    <div class="mb-3">
        <label for="desc_detail" class="form-label">Descripción</label>
        <input type="text" class="form-control" id="desc_detail" value="${p.description}"/>
    </div>
    <div class="mb-3">
        <label for="codigo_detail" class="form-label">Código</label>
        <input type="text" class="form-control" id="codigo_detail" value="${p.code}"/>
    </div>
    <div class="mb-3">
        <label for="url_detail" class="form-label">Foto</label>
        <input type="text" class="form-control" id="url_detail" value="${p.url}"/>
    </div>
    <div class="mb-3">
        <label for="price_detail" class="form-label">Precio</label>
        <input type="number" class="form-control" id="price_detail" value="${p.price}"/>
    </div>
    <div class="mb-3">
        <label for="stock_detail" class="form-label">Stock</label>
        <input type="number" class="form-control" id="stock_detail" value="${p.stock}"/>
    </div>
    </form>`;
    return html;
}

const modal = document.getElementById('staticBackdrop');

modal?.addEventListener('show.bs.modal', async (e) => {
    let id = e.relatedTarget.getAttribute('data-prod-id');
    //console.log(`Se abrió la ventana de detalle del producto con el id: ${id}`);
    const divBodyProduct = document.getElementById('bodyProduct');
    oneProduct = await getOneProduct(id);
    divBodyProduct.innerHTML = generateProductDetail(oneProduct);
});

async function updateProduct() {
    let closeModal = bootstrap.Modal.getInstance(modal);
    let producto = {};
    producto.store = document.getElementById('store_detail').value;
    producto.name = document.getElementById('name_detail').value;
    producto.description = document.getElementById('description_detail').value;
    producto.code = document.getElementById('code_detail').value;
    producto.url = document.getElementById('url_detail').value;
    producto.price = document.getElementById('price_detail').value;
    producto.stock = document.getElementById('stock_detail').value;
    closeModal.hide();
    let res = await fetch(`/api/productos/${oneProduct.id}`, {
        method: 'PUT',
        body: JSON.stringify(producto), 
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let respuesta = await res.json();
    location.reload();
}

async function deleteProduct() {
    let closeModal = bootstrap.Modal.getInstance(modal);
    closeModal.hide();
    let res = await fetch(`/api/productos/${oneProduct.id}`, {
        method: 'DELETE', 
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let respuesta = await res.json();
    location.reload();
}

const boton = document.getElementById('enviar');
boton?.addEventListener('click', enviarDatos);

const btnUpdate = document.getElementById('btnUpdate');
btnUpdate?.addEventListener('click', updateProduct);

const btnDelete = document.getElementById('btnDelete');
btnDelete?.addEventListener('click', deleteProduct);