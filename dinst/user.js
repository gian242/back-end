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
exports.userEndPonit = userEndPonit;
const connectionDB_1 = require("./connectionDB");
const index_1 = require("./index");
function userEndPonit() {
    const db = connectionDB_1.client.db("mall");
    const collection = db.collection("users");
    index_1.app.get("/get/users", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const users = yield collection.find({}).toArray();
        res.status(200).json(users);
    }));
    index_1.app.post("/post/user", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const body = req.body;
        try {
            yield collection.insertOne(body);
            res.status(200).json({ "succes": "operzaione completata" });
        }
        catch (error) {
            res.status(401).json(error);
        }
    }));
    index_1.app.delete("/delete/user/:username", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const username = req.params.username;
        try {
            const result = yield collection.deleteOne({ "username": username });
            if (result.deletedCount == 0)
                return res.status(200).send("nessuno utente trovato");
            return res.status(200).send("correct delete");
        }
        catch (err) {
            return res.status(404).send({ "error : ": err });
        }
    }));
    index_1.app.patch("/patch/user/:username", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const username = req.params.username;
        const body = req.body;
        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ message: "Nessun campo da aggiornare fornito" });
        }
        try {
            const result = yield collection.updateOne({ username: username }, { $set: body });
            if (result.matchedCount === 0) {
                return res.status(404).json({ message: "Utente non trovato" });
            }
            res.status(200).json({ message: "Utente aggiornato con successo" });
        }
        catch (err) {
            console.error("Errore durante l'update:", err);
            res.status(500).json({ message: "Errore del server" });
        }
    }));
}
