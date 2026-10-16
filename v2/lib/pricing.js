export const PRODUCTS = [
  {slug:"sauna",name:"Portable Sauna",price:500,description:"A cozy propane-heated sauna experience, delivered to your Nantucket space.",icon:"♨"},
  {slug:"cold-plunge",name:"Cold Plunge",price:150,description:"Refresh and reset with an invigorating cold plunge.",icon:"◌"},
  {slug:"fire-pit",name:"Fire Pit",price:100,description:"Make your evening a little warmer.",icon:"✦"}
];
export function rentalDays(start,end) {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(start||"") || !/^\d{4}-\d{2}-\d{2}$/.test(end||"")) return 0;
  const a=Date.parse(start+"T00:00:00Z"),b=Date.parse(end+"T00:00:00Z");
  if(!Number.isFinite(a)||!Number.isFinite(b)||new Date(a).toISOString().slice(0,10)!==start||new Date(b).toISOString().slice(0,10)!==end) return 0;
  return Math.round((b-a)/86400000);
}
export function discountRate(days) { return days>=30?.35:days>=7?.20:days>=3?.10:0; }
export function quote(start,end,slugs) {
  const days=rentalDays(start,end);
  const items=PRODUCTS.filter(p=>slugs.includes(p.slug));
  const subtotal=days*items.reduce((s,p)=>s+p.price,0);
  const discount=discountRate(days);
  return {days,subtotal,discount,savings:Math.round(subtotal*discount*100)/100,total:Math.round(subtotal*(1-discount)*100)/100,items};
}
