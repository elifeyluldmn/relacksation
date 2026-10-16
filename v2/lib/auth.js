import crypto from "node:crypto";
import {cookies} from "next/headers";
const cookieName="relacks_owner";
function sign(value) {return crypto.createHmac("sha256",process.env.SESSION_SECRET||"").update(value).digest("hex");}
export function verifyPassword(password) {
 const expected=process.env.ADMIN_PASSWORD;
 if(!expected||!process.env.SESSION_SECRET||expected.length<16||process.env.SESSION_SECRET.length<32) return false;
 const a=crypto.createHash("sha256").update(password||"").digest();
 const b=crypto.createHash("sha256").update(expected).digest();
 return crypto.timingSafeEqual(a,b);
}
export async function isAdmin(){
 if(!process.env.SESSION_SECRET||process.env.SESSION_SECRET.length<32) return false;
 const raw=(await cookies()).get(cookieName)?.value||"";
 const [expiry,signature]=raw.split(".");
 if(!expiry||!signature||!/^\d+$/.test(expiry)||Number(expiry)<Date.now()) return false;
 const expected=sign(expiry);
 return signature.length===expected.length&&crypto.timingSafeEqual(Buffer.from(signature),Buffer.from(expected));
}
export function adminCookie(){
 const expiry=String(Date.now()+12*3600*1000);
 return {name:cookieName,value:expiry+"."+sign(expiry),options:{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:12*3600}};
}
export function clearAdminCookie(){return {name:cookieName,value:"",options:{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:0}};}
