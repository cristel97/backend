const express = require("express");
const { Router } = express;
const Contenedor = require("../utils/Contenedor");
const db = "./utils/items.json";
const productos = new Contenedor(db);
const routerProductos = new Router();
const administrador = true;

routerProductos.use(express.json());
routerProductos.use(express.urlencoded({ extended: true })); 

//Routes

//GET prods
routerProductos.get("/", async (req, res) => {
    const prods = productos.getAll();
    const resultado = await prods;
    res.json(resultado);
    res.render("/api/productos", {
        productos: resultado,
        administrador: administrador,
    });
});

//Get Producto by ID
routerProductos.get("/:id", async (req, res) => {
    const id = req.params.id;
    const filtrado = productos.getById(id);
    const resultado = await filtrado;
    if (!resultado) {
        res.json({ message: "No se encuentra producto con esta id" });
    } else {
        res.json(resultado);
    }
});

//POST
routerProductos.post("/", async (req, res) => {
    if (administrador) {
        const item = req.body;
        const itemAgregado = productos.save(item);
        const resultado = await itemAgregado;
        const getAll = await productos.getAll();
        res.send(resultado);
        res.render("api/productos", {
            productos:getAll(),
        });
    } else {
        res.send("ruta no disponible");
    }
});

//PUT
routerProductos.put("/:id", async (req, res) => {
    if (administrador) {
        const id = req.params.id;
        const item = req.body;
        const prod = await productos.update(item, id);
        res.json(prod);
    } else {
        res.send("ruta no disponible");
    }
});

routerProductos.delete("/:id", async (req, res) => {
    if (administrador) {
        const id = req.params.id;
        const nuevoArray = await productos.deletByID(id);
        res.send(nuevoArray);
    } else {
        res.send("ruta no disponible");
    }
});

module.exports = routerProductos;