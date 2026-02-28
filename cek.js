document.addEventListener("DOMContentLoaded", async function(){

const username = localStorage.getItem("username");
const content = document.getElementById("content");

if(!username){
content.innerHTML="<div class='empty'>Session tidak valid</div>";
return;
}

try{

const res = await fetch(API_URL+"?action=list");
const data = await res.json();

if(!Array.isArray(data)){
content.innerHTML="<div class='empty'>Gagal memuat data</div>";
return;
}

const myTickets = data.filter(t => t.nama === username);

if(myTickets.length === 0){
content.innerHTML="<div class='empty'>Anda belum memiliki laporan.</div>";
return;
}

renderSection("Waiting","waiting");
renderSection("On Progress","process");
renderSection("Pending","pending");
renderSection("Done","done");

function renderSection(status,className){

const group = myTickets.filter(t => t.status === status);
if(group.length === 0) return;

let html = `
<div class="section">
<div class="section-title ${className}">
${status} (${group.length})
</div>
`;

group.forEach(t=>{
html += `
<div class="card">
<div class="ticket-id">${t.id}</div>

<div class="label">Aset</div>
<div class="value">${t.aset || "-"}</div>

<div class="label">Cabang</div>
<div class="value">${t.departemen || "-"}</div>

<div class="label">Tanggal</div>
<div class="value">${formatTanggal(t.tanggal)}</div>
</div>
`;
});

html += `</div>`;

content.innerHTML += html;
}

}catch(err){
console.error(err);
content.innerHTML="<div class='empty'>Terjadi kesalahan memuat data.</div>";
}

});


function formatTanggal(date){

if(!date) return "-";

const d = new Date(date);
if(isNaN(d)) return "-";

return d.getDate().toString().padStart(2,'0')+"/"+
(d.getMonth()+1).toString().padStart(2,'0')+"/"+
d.getFullYear();
}
