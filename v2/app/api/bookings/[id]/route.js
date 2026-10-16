import {NextResponse} from "next/server";
import {ObjectId,MongoClient} from "mongodb";
import {isAdmin} from "../../../../lib/auth";
export async function PATCH(req,{params}){
 if(!await isAdmin())return NextResponse.json({error:"Unauthorized"},{status:401});
 const {id}=await params,{status}=await req.json().catch(()=>({}));
 if(!ObjectId.isValid(id)||!["pending","confirmed","canceled"].includes(status))return NextResponse.json({error:"Invalid booking or status"},{status:400});
 const client=new MongoClient(process.env.MONGODB_URI);await client.connect();
 try{
 const session=client.startSession();let found=false;
 try{await session.withTransaction(async()=>{
 const database=client.db(),bookings=database.collection("v2_bookings"),inventory=database.collection("v2_inventory");
 const booking=await bookings.findOne({_id:new ObjectId(id)},{session});if(!booking)return;
 found=true;
 if(booking.status==="canceled"&&status!=="canceled")throw new Error("Canceled bookings cannot be reactivated; make a new request.");
 if(status==="canceled"&&booking.status!=="canceled")await inventory.deleteMany({bookingId:booking._id},{session});
 await bookings.updateOne({_id:booking._id},{$set:{status}},{session});
 });}finally{await session.endSession();}
 if(!found)return NextResponse.json({error:"Booking not found"},{status:404});
 return NextResponse.json({ok:true,status});
 }catch(e){return NextResponse.json({error:e.message||"Update failed"},{status:409});}
 finally{await client.close();}
}
