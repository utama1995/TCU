// ================================
// CEK LAPORAN SAYA (GROUPING)
// ================================

document.addEventListener("DOMContentLoaded", async function(){

const username = localStorage.getItem("username");
const content = document.getElementById("content");

if(!username){
content.innerHTML="Session tidak valid";
return;
}

try{

const res = await fetch(API_URL+"?action=list");
const data = await res.json();

if(!Array.isArray(data)){
content.innerHTML="Gagal memuat data";
return;
}

const myTickets = data.filter(t => t.nama === username);

if(myTickets.length === 0){
content.innerHTML="Anda belum memiliki laporan.";
return;
}

renderSection("Waiting","waiting");
renderSection("On Progress","process");
renderSection("Pending","pending");
renderSection("Done","done");

function renderSection(status,labelClass){

const group = myTickets.filter(t => t.status === status);
if(group.length === 0) return;

let html = `
<div class="section">
<h3 class="${labelClass}">${status}</h3>
`;

group.forEach(t=>{
html += `
<div class="card">
<div class="ticket-id">${t.id}</div>
<div><strong>Aset:</strong> ${t.aset || "-"}</div>
<div><strong>Cabang:</strong> ${t.departemen || "-"}</div>
<div><strong>Tanggal:</strong> ${formatTanggal(t.tanggal)}</div>
</div>
`;
});

html += `</div>`;
content.innerHTML += html;
}

}catch(err){
console.error(err);
content.innerHTML="Terjadi kesalahan memuat data.";
}

});


// ================================
// FORMAT TANGGAL
// ================================
function formatTanggal(date){

if(!date) return "-";

const d = new Date(date);
if(isNaN(d)) return "-";

return d.getDate().toString().padStart(2,'0')+"/"+
(d.getMonth()+1).toString().padStart(2,'0')+"/"+
d.getFullYear();

}
