// ================================
// FORMAT TANGGAL INDONESIA
// ================================
function formatTanggalIndonesia(tanggalISO){
if(!tanggalISO) return "-";

try{
const tanggal = new Date(tanggalISO);

if(isNaN(tanggal)) return tanggalISO;

return tanggal.toLocaleDateString("id-ID", {
day: "numeric",
month: "long",
year: "numeric"
});

}catch{
return tanggalISO;
}
}

function safeText(value){
if(value === null || value === undefined) return "-";

const text = String(value).trim();
return text !== "" ? text : "-";
}

function getStatusClass(status){
if(status === "On Progress") return "status-progress";
if(status === "Done") return "status-done";
if(status === "Pending") return "status-pending";
return "status-open";
}

function renderPhotoButton(url){
const foto = safeText(url);

if(foto === "-"){
return "-";
}

return `<button type="button" class="inline-action" onclick="openFotoStatus('${encodeURIComponent(foto)}')">Lihat Foto</button>`;
}

function renderTicketCard(ticket){
const statusText = safeText(ticket.status) === "-" ? "Waiting" : safeText(ticket.status);
const statusClass = getStatusClass(statusText);

return `
<div class="ticket-card">
  <div class="ticket-card-header">
    <div>
      <div class="ticket-label">Ticket ID</div>
      <div class="ticket-id">${safeText(ticket.id)}</div>
    </div>
    <span class="${statusClass}">${statusText}</span>
  </div>

<div class="ticket-grid">
    <div>
      <div class="label">Tanggal Lapor</div>
      <div class="value">${formatTanggalIndonesia(ticket.tanggal)}</div>
    </div>
    <div>
      <div class="label">Update Terakhir</div>
      <div class="value">${formatTanggalIndonesia(ticket.update)}</div>
    </div>
    <div>
      <div class="label">Cabang</div>
      <div class="value">${safeText(ticket.departemen)}</div>
    </div>
    <div>
      <div class="label">Nama Aset</div>
      <div class="value">${safeText(ticket.aset)}</div>
    </div>
    <div>
      <div class="label">Kategori</div>
      <div class="value">${safeText(ticket.kategori)}</div>
    </div>
    <div>
      <div class="label">Estimasi Selesai</div>
      <div class="value">${safeText(ticket.estimasi)}</div>
    </div>
  </div>

<div class="label">Deskripsi Kerusakan</div>
  <div class="value">${safeText(ticket.deskripsi)}</div>

  <div class="label">Catatan GA</div>
  <div class="value">${safeText(ticket.catatan)}</div>

  <div class="ticket-footer">
    <div>
      <div class="label">Vendor</div>
      <div class="value">${safeText(ticket.vendor)}</div>
    </div>
    <div>
      <div class="label">Foto Pelaporan</div>
      <div class="value">${renderPhotoButton(ticket.foto)}</div>
    </div>
  </div>
</div>
`;
}

async function loadMyTickets(){
const hasil = document.getElementById("hasil");

hasil.innerHTML = "<div class='loading-box'>Memuat laporan Anda...</div>";

try{
const response = await fetch(
API_URL +
"?action=myTickets" +
"&token=" + encodeURIComponent(localStorage.getItem("token"))
);

const data = await response.json();
if(data.session_expired){
alert("Session berakhir. Silakan login ulang.");
localStorage.clear();
window.location.href = "login.html";
return;
}

if(!data || data.success === false){
hasil.innerHTML = "<div class='empty-state'>Laporan tidak bisa dimuat.</div>";
return;
}

const tickets = Array.isArray(data.tickets) ? data.tickets : [];

if(tickets.length === 0){
hasil.innerHTML = `<div class='empty-state'>Belum ada laporan yang dibuat oleh akun ini.<br>Akun aktif: ${safeText(data.username)}</div>`;
return;
}

tickets.sort(function(a,b){
return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
});

hasil.innerHTML = tickets.map(renderTicketCard).join("");

}catch(err){
hasil.innerHTML = "<div class='empty-state'>Data laporan tidak bisa ditampilkan. Silakan hubungi admin.</div>";
console.error(err);
}
}

document.addEventListener("DOMContentLoaded", loadMyTickets);
