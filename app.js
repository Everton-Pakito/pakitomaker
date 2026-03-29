const v=document.getElementById("camera");
const c=document.getElementById("capturar");
const s=document.getElementById("trocar");
const h=document.getElementById("hora");
const d=document.getElementById("data");
const g=document.getElementById("gps");

let stream,front=true;

async function cam(){
 if(stream) stream.getTracks().forEach(t=>t.stop());
 stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:front?"user":"environment"}});
 v.srcObject=stream;
}
cam();

s.onclick=()=>{front=!front;cam()};

setInterval(()=>{
 let now=new Date();
 h.innerText=now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
 d.innerText=now.toLocaleDateString('pt-BR');
},1000);

navigator.geolocation.watchPosition(p=>{
 g.innerText=p.coords.latitude.toFixed(5)+", "+p.coords.longitude.toFixed(5);
});

c.onclick=()=>{
 let canvas=document.createElement("canvas");
 let ctx=canvas.getContext("2d");
 canvas.width=v.videoWidth;
 canvas.height=v.videoHeight;

 ctx.drawImage(v,0,0);

 ctx.fillStyle="white";
 ctx.font="bold 50px Arial";
 ctx.fillText(h.innerText,30,canvas.height-120);

 ctx.font="20px Arial";
 ctx.fillText(d.innerText,30,canvas.height-80);
 ctx.fillText("Operação: Florestal Suzano",30,canvas.height-50);
 ctx.fillText(g.innerText,30,canvas.height-20);
 ctx.fillText("PakitoMark",canvas.width-200,40);

 let a=document.createElement("a");
 a.download="MarkPakito.png";
 a.href=canvas.toDataURL();
 a.click();
};
