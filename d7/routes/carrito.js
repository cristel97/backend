const express = require("express");
const { Router } = express;
const Contenedor = require("../utils/Contenedor");
const db = "./utils/carrito.json";
const prods = "./utils/items.json";
const administrador = true;
const carrito = new Contenedor(db);
const productos = new Contenedor(prods);
const routerCarrito = new Router();

routerCarrito.use(express.json());
routerCarrito.use(express.urlencoded({ extended: true }));

//Routes

//POST
routerCarrito.post("/", async (req, res) => {
    if (administrador) {
        const item = req.body;
        const carroAgregado = carrito.saveCarrito(item);
        const resultado = await carroAgregado;
        res.json(resultado.id);
    } else {
        res.send("ruta no disponible");
    }
});

routerCarrito.post("/:id/productos", async (req, res) => {
    const id = req.params.id;
    const carro = await carrito.getById(id);
    const item = await productos.getById(req.body.id);
    carro.productos.push(item);
    console.log(carro.productos);
    const resultado = await carrito.update(carro, id);

    res.json(resultado);
});

//GET ARRAY CARRO
routerCarrito.get("/", async (req, res) => {
    const array = carrito.getAll();
    const resultado = await array;
    res.json(resultado);
});

// GET PRODS DEL CARRITO
routerCarrito.get("/:id/productos", async (req, res) => {
    const id = req.params.id;
    const carro = carrito.getById(id);
    const resultado = await carro;
    const productosCarro = resultado.productos;
    res.json(productosCarro);
});

//DELETE CARRITO
routerCarrito.delete("/:id", async (req, res) => {
    if (administrador) {
        const id = req.params.id;
        const carroEliminado = carrito.deletByID(id);
        const resultado = await carroEliminado;
        res.json(resultado);
    } else {
        res.send("ruta no disponible");
    }
});

//DELETE PROD DEL CARRO
routerCarrito.delete("/:a/productos/:prod", async (req, res) => {
    const idCarro = req.params.a;
    const idProd = req.params.prod;
    console.log(idCarro, idProd);
    const resultado = await carrito.deletProd(idCarro, idProd);
    res.json(resultado);
});

module.exports = routerCarrito;