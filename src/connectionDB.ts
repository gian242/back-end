import * as MongoDB from 'mongodb';
import { Collection } from 'mongodb';

 export const client = new MongoDB.MongoClient('mongodb://localhost:27017')
export async function connectionDb(){
    try {
       await client.connect();
       const db = client.db('mall');
       const collection: Collection = db.collection('book');//crete or use collection
       console.log('connect created with succes');
    } catch (error) {
        console.log("error ", error);
    }
}