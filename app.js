const video = document.getElementById("camera");
const btn = document.getElementById("capturar");

const horaEl = document.getElementById("hora");
const dataEl = document.getElementById("data");
const gpsEl = document.getElementById("gps");

async function iniciarCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false
    });
    video.srcObject = stream;
  } catch (err) {
    alert("Erro ao acessar câmera");
  }
}
iniciarCamera();

setInterval(() => {
  const agora = new Date();
  horaEl.innerText = agora.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  dataEl.innerText = agora.toLocaleDateString('pt-BR');
}, 1000);

navigator.geolocation.watchPosition(
  pos => {
    gpsEl.innerText = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
  },
  () => gpsEl.innerText = "GPS indisponível"
);

btn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  ctx.drawImage(video, 0, 0);

  const link = document.createElement("a");
  link.download = "PakitoMaker.png";
  link.href = canvas.toDataURL();
  link.click();
});
