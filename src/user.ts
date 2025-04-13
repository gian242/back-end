import { client } from "./connectionDB"
import {app,express} from "./index"
export function userEndPonit(){
    const db = client.db("mall");
    const collection = db.collection("users");
    app.get("/get/users",async(req:express.Request,res:express.Response) => {
        const users = await collection.find({}).toArray();
        res.status(200).json(users);
    });

    app.post("/post/user",async (req:express.Request,res:express.Response) =>{
        const body = req.body;
        try{
            await collection.insertOne(body);
            res.status(200).json({"succes":"operzaione completata"});
        }catch(error){
            res.status(401).json(error);
        }
        
    });

    app.delete("/delete/user/:username",async (req:express.Request,res:express.Response) => {
        const username = req.params.username;
        try{
            const result = await collection.deleteOne({"username":username})
            if(result.deletedCount == 0 ) return res.status(200).send("nessuno utente trovato")
            return res.status(200).send("correct delete")
        }catch(err){
            return res.status(404).send({"error : ":err});
        }
    })

    app.patch("/patch/user/:username", async (req: express.Request, res: express.Response) => {
        const username = req.params.username;
        const body = req.body;
    
        
        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ message: "Nessun campo da aggiornare fornito" });
        }
    
        try {
            const result = await collection.updateOne(
                { username: username },
                { $set: body }
            );
    
            if (result.matchedCount === 0) {
                return res.status(404).json({ message: "Utente non trovato" });
            }
    
            res.status(200).json({ message: "Utente aggiornato con successo" });
        } catch (err) {
            console.error("Errore durante l'update:", err);
            res.status(500).json({ message: "Errore del server" });
        }
    });
    

}