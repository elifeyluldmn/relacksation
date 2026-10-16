import {NextResponse} from "next/server";
import {adminCookie,clearAdminCookie,verifyPassword,isAdmin} from "../../../lib/auth";
export async function GET(){return NextResponse.json({authenticated:await isAdmin()});}
export async function POST(req){
 const {password}=await req.json().catch(()=>({}));
 if(!verifyPassword(password))return NextResponse.json({error:"Incorrect password or admin settings missing."},{status:401});
 const res=NextResponse.json({ok:true});const c=adminCookie();res.cookies.set(c.name,c.value,c.options);return res;
}
export async function DELETE(){const res=NextResponse.json({ok:true});const c=clearAdminCookie();res.cookies.set(c.name,c.value,c.options);return res;}
