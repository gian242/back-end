import * as MongoDB from 'mongodb';
import { Collection } from 'mongodb';

const url: string = "mongodb+srv://gianlucabattaglia06:2TY398TG8gQAUJT9@cluster0.qdxx7qq.mongodb.net/mall?retryWrites=true&w=majority&appName=Cluster0";

export const client = new MongoDB.MongoClient(url);

export async function connectionDb() {
    try {
        await client.connect();
        console.log('✅ Connessione a MongoDB Atlas riuscita!');
    } catch (error) {
        console.log("❌ Errore di connessione: ", error);
    }
}
