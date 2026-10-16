import {NextResponse} from "next/server";
import {ObjectId} from "mongodb";
import {db} from "../../../lib/db";
import {isAdmin} from "../../../lib/auth";
import {PRODUCTS,quote,rentalDays} from "../../../lib/pricing";
import {sendBookingEmail} from "../../../lib/mail";
export const dynamic="force-dynamic";
const clean=s=>typeof s==="string"?s.trim():"";
export async function GET(){
 if(!await isAdmin())return NextResponse.json({error:"Unauthorized"},{status:401});
 try {const database=await db();return NextResponse.json(await database.collection("v2_bookings").find().sort({createdAt:-1}).limit(300).toArray());}
 catch(e){console.error(e);return NextResponse.json({error:"Unable to load bookings"},{status:503});}
}
export async function POST(req){
 const body=await req.json().catch(()=>null);
 if(!body)return NextResponse.json({error:"Invalid request"},{status:400});
 const start=clean(body.startDate),end=clean(body.endDate),products=body.products,days=rentalDays(start,end);
 const customer={name:clean(body.customer?.name),email:clean(body.customer?.email),phone:clean(body.customer?.phone)};
 const address={line1:clean(body.address?.line1),city:clean(body.address?.city),state:clean(body.address?.state),zip:clean(body.address?.zip)};
 const today=new Date().toISOString().slice(0,10);
 if(days<1||days>365||start<today)return NextResponse.json({error:"Choose valid future rental dates (up to 365 days)."}, {status:400});
 if(!Array.isArray(products)||products.length<1||new Set(products).size!==products.length||products.some(p=>!PRODUCTS.some(x=>x.slug===p)))return NextResponse.json({error:"Select valid rental products."},{status:400});
 if(Object.values(customer).some(v=>!v||v.length>200)||!/^\S+@\S+\.\S+$/.test(customer.email)||Object.values(address).some(v=>!v||v.length>200))return NextResponse.json({error:"Please complete your contact and delivery details."},{status:400});
 const q=quote(start,end,products);
 const booking={_id:new ObjectId(),startDate:start,endDate:end,products,customer,address,days,total:q.total,subtotal:q.subtotal,discount:q.discount,status:"pending",createdAt:new Date()};
 try {
 const database=await db(),client=database.client||null;
 // Unique inventory keys prevent overlapping requests even if two customers submit simultaneously.
 // A MongoDB transaction ensures a failed multi-day request leaves no partial reservations.
 const {MongoClient}=await import("mongodb");
 // Use a separate connection to start a transaction on the same configured database.
 const mongo=new MongoClient(process.env.MONGODB_URI);await mongo.connect();
 try{
 const session=mongo.startSession();
 try{
 await session.withTransaction(async()=>{
 const transactionalDb=mongo.db(database.databaseName);
 const inv=transactionalDb.collection("v2_inventory");
 await inv.createIndex({product:1,date:1},{unique:true});
 const rows=[];
 for(let i=0;i<days;i++){const d=new Date(Date.parse(start+"T00:00:00Z")+i*86400000).toISOString().slice(0,10);for(const p of products)rows.push({product:p,date:d,bookingId:booking._id});}
 await inv.insertMany(rows,{session,ordered:true});
 await transactionalDb.collection("v2_bookings").insertOne(booking,{session});
 });
 }finally{await session.endSession();}
 }finally{await mongo.close();}
 }catch(e){
 if(e.code===11000||e.code===112)return NextResponse.json({error:"Some equipment is no longer available for those dates. Please choose other dates."},{status:409});
 console.error("Booking failed",e);return NextResponse.json({error:"We couldn't save your request. Please try again."},{status:503});
 }
 sendBookingEmail(booking).catch(e=>console.error("Booking email error",e));
 return NextResponse.json({bookingId:String(booking._id),status:"pending",total:booking.total},{status:201});
}
