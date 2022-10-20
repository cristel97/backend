const carritos = [];
let idCarrito = 0;
window.addEventListener('load', getAllCarritos);

function getAllCarritos() {
    showCarritos([]);
    fetch('/api/carrito', {
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
                    carritos.push(...response);
                    showCarritos(carritos);
                } 
            })
            .catch((e) => console.log(e));
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function addEventsToButtons() {
    document.querySelectorAll('.btnDeleteCarrito').forEach(item => {
        item.addEventListener('click', e => {
            idCarrito = e.target.getAttribute('id');
            deleteCarrito();
        });
    });
    
    const btnAddCarrito = document.getElementById('addCarrito');
    btnAddCarrito.addEventListener('click', addCarrito);
}

function showCarritos(listaDeCarritos) {
    div_carrito = document.getElementById('carritos');
    let html = '';
    if (listaDeCarritos.length > 0) {
        html = `
        <table class="table bg-dark">
        <tr>
            <th class="text-info">Id</th>
            <th class="text-info">Fecha creación</th>
            <th class="text-info"></th>
        </tr>`;
        listaDeCarritos.forEach(c => {
            let fecha = new Date(c.timestamp);
            html += `
            <tr>
                <td class="text-white"><a href="/listarProdByCarrito.html?id=${c.id}">${c.id}</td>
                <td class="text-white">${fecha}</td>
                <td class="text-white"><button class="btn btn-danger btnDeleteCarrito" id="${c.id}">X</button></td>
            </tr>`;
        });
        html += `</table>`;
        html += `<button class="btn btn-primary" id="addCarrito">Add Carrito</button>`;
    } else {
        html = `<p class="mt-3 mb-3 p-3 aviso">No se encontraron carritos</p>`;
        html += `<button class="btn btn-primary" id="addCarrito">Add Carrito</button>`;
    }
    div_carrito.innerHTML = html;
    addEventsToButtons();
}

async function deleteCarrito() {
    let res = await fetch(`/api/carrito/${idCarrito}`, {
        method: 'DELETE',
         //The browser needs to know the media type of a resource
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let respuesta = await res.json();
    //The location reload() method in HTML DOM is used to reload the current document. This method refreshes the current documents. It is similar to the refresh button in the browser. 
    location.reload();
}

function addCarrito() {
    fetch('/api/carrito', {
        method: 'POST',
         //The browser needs to know the media type of a resource
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((res) => {
        res.json()
            .then((response) => {
                //The location reload() method in HTML DOM is used to reload the current document. This method refreshes the current documents. It is similar to the refresh button in the browser. 
                location.reload();
            })
            .catch((e) => console.log(e));
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}