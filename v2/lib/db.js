import {MongoClient} from "mongodb";
let clientPromise;
export function db() {
  if(!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not configured");
  if(!clientPromise) clientPromise=new MongoClient(process.env.MONGODB_URI).connect();
  return clientPromise.then(client=>client.db());
}
