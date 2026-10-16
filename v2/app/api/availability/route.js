import {NextResponse} from "next/server";
import {db} from "../../../lib/db";
import {PRODUCTS,rentalDays} from "../../../lib/pricing";
export const dynamic="force-dynamic";
export async function GET(req){
 const u=new URL(req.url),start=u.searchParams.get("start"),end=u.searchParams.get("end"),days=rentalDays(start,end);
 if(days<1||days>365)return NextResponse.json({error:"Select between 1 and 365 rental days."},{status:400});
 try {
 const database=await db(),locks=await database.collection("v2_inventory").find({date:{$gte:start,$lt:end}}).toArray();
 const unavailable=[...new Set(locks.map(l=>l.product))];
 return NextResponse.json({available:PRODUCTS.filter(p=>!unavailable.includes(p.slug)).map(p=>p.slug),unavailable});
 }catch(e){console.error("Availability failed",e);return NextResponse.json({error:"Availability temporarily unavailable."},{status:503});}
}
