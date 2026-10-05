// Fit every pose and its floating motion between the navigation and reader.
export function fitActor({y,scale,height,viewportHeight,headerHeight,readerHeight,gap=24}){
 if(height<=0)return {y,scale};
 const top=headerHeight+gap+8;
 const bottom=viewportHeight-readerHeight-gap-8-16;
 const available=Math.max(0,bottom-top);
 const fittedScale=Math.min(scale,available/height);
 const half=height*fittedScale/2;
 return {y:Math.max(top+half,Math.min(bottom-half,y)),scale:fittedScale};
}
