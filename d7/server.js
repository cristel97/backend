const express = require("express");
const app = express();
const productosRouter = require("./routes/productos");
const carritoRouter = require("./routes/carrito");

app.use(express.static("public"));

app.use("/api/productos", productosRouter);
app.use("/api/carrito", carritoRouter);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("*", (req, res) => {
    res.json("Error: Ruta o metodo no implementado");
});

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
});
server.on('error', err => console.log( 'Error at server: ' + err ));