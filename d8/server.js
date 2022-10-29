import { options } from './options/mariaDB.js'
import SqlClient from './mySql'
import express from 'express'
const app = express();


import { createServer } from "http";
import { Server } from "socket.io";
const httpServer = createServer();
const io = new Server(httpServer)

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(express.static('public'))

const sql = new SqlClient(options)

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");
    sql.createTable()
      .then(() => {
        return sql.listProducts();
      })
      .then((products) => {
        socket.emit("products", products);
      })
      .then((products) => {
        socket.on("new-product", (product) => {
          io.sockets.emit("products", products)
          sql.insertProducts(product)
        })
      })
      .catch((err) => { console.log(err); throw err })
      .finally(() => {
          sql.close()
      })
    })


// running server
const PORT = process.env.PORT || 8080;

const srv = httpServer.listen(PORT, () => { 
    console.log(`Servidor Http escuchando en el puerto ${srv.address().port}`);
})
srv.on('error', error => console.log(`Error en servidor ${error}`))