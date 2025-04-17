"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.express = void 0;
const connectionDB_1 = require("./connectionDB");
const express = require("express");
exports.express = express;
const user_1 = require("./user");
const mongodb_1 = require("mongodb");
exports.app = express();
const cors = require("cors");
let PORT = process.env.PORT;
if (PORT == undefined)
    PORT = "8080";
exports.app.use(cors());
exports.app.use(express.json());
(0, connectionDB_1.connectionDb)();
(0, user_1.userEndPonit)();
exports.app.get("/get/namePizze", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = connectionDB_1.client.db("mall");
    const collection = db.collection("typePizze");
    const products = yield collection.find({}).toArray();
    res.status(200).json(products);
    // console.log("La GET funziona!");
}));
exports.app.get("/get/pizza/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const db = connectionDB_1.client.db("mall");
    const collection = db.collection("typePizze");
    const pizza = yield collection.findOne({ _id: new mongodb_1.ObjectId(id) });
    if (pizza) {
        res.status(200).json(pizza);
    }
    else {
        res.status(404).json({ message: "Pizza non trovata" });
    }
}));
//order
exports.app.get("/get/orders", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = connectionDB_1.client.db("mall");
    const collection = db.collection("order");
    const orders = yield collection.find({}).toArray();
    res.status(200).send(orders);
}));
exports.app.get("/get/order/:idUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idUser = req.params.idUser;
        const db = connectionDB_1.client.db("mall");
        const collection = db.collection("order");
        console.log("ID utente:", idUser);
        console.log("ID utente:", new mongodb_1.ObjectId(idUser));
        const order = yield collection.find({ userId: idUser }).toArray();
        console.log(order);
        if (order) {
            res.status(200).json(order);
        }
        else
            res.status(404).json({ message: false });
    }
    catch (err) {
        console.error("Errore durante il recupero della order:", err);
        res.status(500).send({ message: "Errore del server" });
    }
}));
exports.app.put("/put/order/:idorder", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = connectionDB_1.client.db("mall");
    const collection = db.collection("order");
    const idOrder = req.params.idorder;
    const body = req.body;
    console.log("ID ordine:", idOrder);
    console.log("body quantita", body.quantita);
    try {
        const result = yield collection.updateOne({ _id: new mongodb_1.ObjectId(idOrder) }, {
            $addToSet: {
                idPizze: { $each: body.idPizze }
            },
            $push: {
                quantita: { $each: body.quantita }
            }
        });
        console.log("Risultato dell'aggiornamento:", result);
        res.status(200).send({ message: "Ordine aggiornato con successo" });
    }
    catch (err) {
        console.error("Errore durante l'aggiornamento dell'ordine:", err);
        res.status(500).send({ message: "Errore del server", err });
    }
}));
exports.app.post("/post/order", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = connectionDB_1.client.db("mall");
    const collection = db.collection("order");
    const body = req.body;
    console.log("body", body);
    try {
        collection.insertOne(body);
        res.status(200).send({ "succes": "operazione effetuata con sucesso" });
    }
    catch (err) {
        res.status(404).send({ "error": err });
    }
}));
// Avvio del server
exports.app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});
