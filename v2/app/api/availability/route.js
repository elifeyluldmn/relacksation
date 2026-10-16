import {NextResponse} from "next/server";
import {db} from "../../../lib/db";
import {PRODUCTS,rentalDays} from "../../../lib/pricing";
export const dynamic="force-dynamic";
export async function GET(req){
 const u=new URL(req.url),start=u.searchParams.get("start"),end=u.searchParams.get("end"),days=rentalDays(start,end);
 if(days<1||days>365)return NextResponse.json({error:"Select between 1 and 365 rental days."},{status:400});
 try {
 const database=await db(),locks=await database.collection("v2_inventory").find({date:{$gte:start,$lt:end}}).toArray();
 const dates=[];for(let i=0;i<days;i++)dates.push(new Date(Date.parse(start+"T00:00:00Z")+i*86400000).toISOString().slice(0,10));
 const remaining=Object.fromEntries(PRODUCTS.map(p=>[p.slug,p.slug==="cold-plunge"?2:1]));
 for(const date of dates){
  const dayLocks=locks.filter(l=>l.date===date);
  for(const p of PRODUCTS){
   const taken=p.slug==="cold-plunge"?dayLocks.filter(l=>l.product==="cold-plunge"||l.product==="cold-plunge-2").length:dayLocks.filter(l=>l.product===p.slug).length;
   remaining[p.slug]=Math.min(remaining[p.slug],Math.max(0,(p.slug==="cold-plunge"?2:1)-taken));
  }
 }
 const available=PRODUCTS.filter(p=>remaining[p.slug]>0).map(p=>p.slug);
 return NextResponse.json({available,unavailable:PRODUCTS.filter(p=>remaining[p.slug]===0).map(p=>p.slug),remaining});
 }catch(e){console.error("Availability failed",e);return NextResponse.json({error:"Availability temporarily unavailable."},{status:503});}
}
