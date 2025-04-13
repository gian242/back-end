import { client, connectionDb } from "./connectionDB";
const port: number = 8080;
import express = require("express");
import { userEndPonit } from "./user";
const cors = require("cors");
export const app: any = express();
import { ObjectId } from "mongodb"
import e = require("express");
app.use(cors());
app.use(express.json());

connectionDb();
userEndPonit();
app.get("/get/namePizze", async (req: express.Request, res: express.Response) => {
    const db = client.db("mall");
    const collection = db.collection("tipiPizze");
    const products = await collection.find({}).toArray();

    res.status(200).json(products);
    // console.log("La GET funziona!");
});

app.get("/get/pizza/:id", async (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    const db = client.db("mall");
    const collection = db.collection("tipiPizze");
    const pizza = await collection.findOne({ _id: new ObjectId(id) });

    if (pizza) {
        res.status(200).json(pizza);
    } else {
        res.status(404).json({ message: "Pizza non trovata" });
    }
})

app.get("/get/images", async (req: Request, res: express.Response) => {
    const db = client.db("mall");
    const collection = db.collection("immagini");
    const images = await collection.find({}).toArray();

    res.status(200).send(images);
    // console.log("get funziona");
})

app.post("/post/image", async (req: Request, res: express.Response) => {
    const db = client.db("mall");
    const collection = db.collection("immagini");
    const body = req.body;

    try {
        if (body)
            await collection.insertOne(body);
        res.status(200).send("succes");
    } catch (err) {
        console.log("error", err);
        res.status(404).send({ "error": err });
    }

})

//order
app.post("/post/order", async (req: express.Request, res: express.Response) => {
    const db = client.db("mall");
    const collection = db.collection("order");
    const body = req.body;

    try {
        collection.insertOne(body);
        res.status(200).send({ "succes": "operazione effetuata con sucesso" })
    } catch (err) { res.status(404).send({ "error": err }) }

})

app.get("/get/orders", async (req: express.Request, res: express.Response) => {
    const db = client.db("mall");
    const collection = db.collection("order");
    const orders = await collection.find({}).toArray();

    res.status(200).send(orders);
})

app.get("/get/order/:idUser", async (req: express.Request, res: express.Response) => {
    try {
        const idUser = req.params.idUser;
        const db = client.db("mall");
        const collection = db.collection("order");
        
        console.log("ID utente:", idUser);
        console.log("ID utente:", new ObjectId(idUser));
       
        const order = await collection.find({ userId: idUser }).toArray();
        
        console.log(order);
        if(order.length != 0) {
            res.status(200).json(order);
        }else res.status(404).json({ message: "Nessun ordine trovato" });
    } catch (err) {
        console.error("Errore durante il recupero della order:", err);
        res.status(500).send({ message: "Errore del server" });
    }
});



// Avvio del server
app.listen(port, () => { 
    console.log(`Server avviato su http://localhost:${port}`);
});
export { express };

