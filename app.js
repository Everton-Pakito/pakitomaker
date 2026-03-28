const video = document.getElementById("camera");
const btn = document.getElementById("capturar");

let usandoFrontal = true;
let streamAtual = null;

async function iniciarCamera() {
  if (streamAtual) {
    streamAtual.getTracks().forEach(track => track.stop());
  }

  streamAtual = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: usandoFrontal ? "user" : "environment" }
  });

  video.srcObject = streamAtual;
}

iniciarCamera();

const trocar = document.createElement("button");
trocar.innerText = "🔄";
trocar.style.position = "fixed";
trocar.style.top = "20px";
trocar.style.right = "20px";
trocar.style.zIndex = "999";
document.body.appendChild(trocar);

trocar.onclick = () => {
  usandoFrontal = !usandoFrontal;
  iniciarCamera();
};

let gps = "...";

navigator.geolocation.watchPosition(
  pos => {
    gps = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
  },
  () => gps = "GPS indisponível",
  { enableHighAccuracy: true, maximumAge: 3000 }
);

const logo = new Image();
logo.src = "logo.png";

btn.addEventListener("click", () => {

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const w = video.videoWidth;
  const h = video.videoHeight;

  canvas.width = w;
  canvas.height = h;

  ctx.drawImage(video, 0, 0, w, h);

  const agora = new Date();

  const hora = agora.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  const data = agora.toLocaleDateString();
  const dia = agora.toLocaleDateString('pt-BR', { weekday: 'short' });

  ctx.fillStyle = "red";
  ctx.fillRect(w - 15, 0, 15, h);

  ctx.fillStyle = "orange";
  ctx.font = "bold 28px Arial";
  ctx.fillText("Timemark", w - 200, 40);

  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText("Foto 100% Real", w - 200, 65);

  if (logo.complete) {
    ctx.drawImage(logo, 20, 20, 220, 90);
  }

  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(20, h - 220, 360, 180);

  ctx.fillStyle = "white";
  ctx.font = "bold 70px Arial";
  ctx.fillText(hora, 30, h - 120);

  ctx.font = "22px Arial";
  ctx.fillText(data, 30, h - 80);
  ctx.fillText(dia, 200, h - 80);

  ctx.font = "20px Arial";
  ctx.fillText("Operação: Florestal Suzano", 30, h - 40);

  ctx.font = "16px Arial";
  ctx.fillText(gps, 30, h - 10);

  ctx.save();
  ctx.translate(w - 5, h / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.font = "14px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(`Registro: ${agora.toISOString()}`, 0, 0);
  ctx.restore();

  const nome = `TIMEMARK_${agora.toISOString().replace(/[:.]/g, "-")}.png`;

  const link = document.createElement("a");
  link.download = nome;
  link.href = canvas.toDataURL("image/png");
  link.click();

});
