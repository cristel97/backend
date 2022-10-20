const fs = require("fs");

class Contenedor {
    constructor(url) {
        this.url = url;
    } 

    /*Metodos*/
async getAll() {
        try {
            const contenido = await fs.promises.readFile(this.url, "utf-8");
            const datos = await JSON.parse(contenido);
            return datos;
        } catch (error) {
            return console.log(error);
        }
    }

    async saveCarrito(obj) {
        const data = await this.getAll();

        let id = data[data.length - 1] + 1;
        let timestamp = Date.now();
        const carro = {
            id: id,
            timestamp: timestamp,
            productos: [obj],
        };

        data.push(carro);

        try {
            if (data.length == 0) {
                id = 1;
                carro.id = id;
            } else {
                carro.id = data.length;
            }

            await fs.promises.writeFile(this.url, JSON.stringify(data));
            return carro;
        } catch (error) {
            console.log(error);
        }
    }
    async save(obj) {
        const data = await this.getAll();

        let id = data[data.length - 1] + 1;

        obj.id = id;
        let timestamp = Date.now();
        obj.timestamp = timestamp;

        data.push(obj);

        try {
            if (data.length == 0) {
                id = 1;
                obj.id = id;
            } else {
                obj.id = data.length;
            }

            await fs.promises.writeFile(this.url, JSON.stringify(data));
            return obj;
        } catch (error) {
            console.log(error);
        }
    }

    async getById(num) {
        try {
            const data = await this.getAll();
            const filtrado = data.find((item) => {
                if (num == item.id) {
                    return item;
                } else {
                    return null;
                }
            });
            return filtrado;
        } catch (error) {
            return console.log(error);
        }
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile(this.url, "[]");
        } catch (error) {
            console.log(error);
        }
    }

    async deletByID(num) {
        try {
            const data = await this.getAll();
            const filtrado = data.filter((item) => {
                if (num != item.id) {
                    return item;
                } else {
                    return null;
                }
            });
            fs.promises.writeFile(
                this.url,

                JSON.stringify(filtrado)
            );

            return filtrado;
        } catch (error) {
            return console.log(error);
        }
    }

    async deletProd(num, prodId) {
        try {
            const data = await this.getById(num);
            const arrayProd = await data.productos;
            //const getAll = await this.getAll();
            const filtrado = arrayProd.filter((item) => {
                if (prodId != item.id) {
                    return item;
                } else {
                    return null;
                }
            });

            const nuevoCarrito = { ...data, productos: filtrado };
            console.log(nuevoCarrito);
            const asd = await this.deletByID(num);
            asd.push(nuevoCarrito);

            const dataFinal = asd.sort((a, b) => {
                return a.id - b.id;
            });
            const nuevoArray = fs.promises.writeFile(
                this.url,
                JSON.stringify(dataFinal)
            );
            return nuevoArray;
        } catch (error) {
            return console.log(error);
        }
    }

    async update(prod, id) {
        const data = await this.deletByID(id);
        const newProd = { ...prod, id };
        data.push(newProd);
        const dataFinal = data.sort((a, b) => {
            return a.id - b.id;
        });

        const nuevoArray = fs.promises.writeFile(
            this.url,
            JSON.stringify(dataFinal)
        );
        return nuevoArray;
    }
}

module.exports = Contenedor;