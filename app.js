const video = document.getElementById("camera");
const btn = document.getElementById("capturar");

const horaEl = document.getElementById("hora");
const dataEl = document.getElementById("data");
const gpsEl = document.getElementById("gps");

navigator.mediaDevices.getUserMedia({
  video: { facingMode: "user" }
})
.then(stream => video.srcObject = stream);

function atualizarDataHora() {
  const agora = new Date();
  horaEl.innerText = agora.toLocaleTimeString();
  dataEl.innerText = agora.toLocaleDateString();
}
setInterval(atualizarDataHora, 1000);

navigator.geolocation.getCurrentPosition(pos => {
  const lat = pos.coords.latitude.toFixed(5);
  const lon = pos.coords.longitude.toFixed(5);
  gpsEl.innerText = `Lat: ${lat} | Lon: ${lon}`;
});

btn.addEventListener("click", () => {

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const w = video.videoWidth;
  const h = video.videoHeight;

  canvas.width = w;
  canvas.height = h;

  ctx.drawImage(video, 0, 0, w, h);

  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(20, h - 180, 350, 140);

  ctx.fillStyle = "white";
  ctx.font = "22px Arial";

  const agora = new Date();

  ctx.fillText("PakitoMaker", 20, 40);
  ctx.fillText(agora.toLocaleString(), 20, h - 140);
  ctx.fillText("Operação: Florestal Suzano", 20, h - 100);

  if (gpsEl.innerText) {
    ctx.fillText(gpsEl.innerText, 20, h - 60);
  }

  const nome = `PakitoMaker_${agora.toISOString().replace(/[:.]/g, "-")}.png`;

  const link = document.createElement("a");
  link.download = nome;
  link.href = canvas.toDataURL("image/png");
  link.click();

});
