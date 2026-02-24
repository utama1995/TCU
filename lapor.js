// ================================
// GLOBAL LOCK (ANTI DOUBLE SUBMIT)
// ================================
let isProcessing = false;


// ================================
// SANITASI INPUT
// ================================
function cleanInput(text){
return text
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;");
}


// ================================
// UPLOAD FOTO KE CLOUDINARY
// ================================
async function uploadFoto(file){

if(!file){
alert("Pilih foto terlebih dahulu");
return null;
}

const formData = new FormData();
formData.append("file", file);
formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

try{

const response = await fetch(CLOUDINARY_URL,{
method:"POST",
body:formData
});

const data = await response.json();

if(!data.secure_url){
return null;
}

return data.secure_url;

}catch(error){

return null;

}

}


// ================================
// KIRIM LAPORAN (PRODUCTION FLOW)
// ================================
async function kirimLaporan(){

if(isProcessing) return;
isProcessing = true;

const btn = document.getElementById("btnKirim");
const hasil = document.getElementById("hasil");

btn.disabled = true;
btn.innerText = "Memproses...";

try{

// ================================
// AMBIL DATA FORM
// ================================
const nama = document.getElementById("nama").value.trim();
const cabang = document.getElementById("cabang").value.trim();
const aset = document.getElementById("aset").value.trim();
const kategori = document.getElementById("kategori").value;
const deskripsi = document.getElementById("deskripsi").value.trim();
const file = document.getElementById("foto").files[0];


// ================================
// VALIDASI WAJIB ISI
// ================================
if(!nama || !cabang || !aset || !kategori || !deskripsi){
alert("Semua field wajib diisi");
resetButton();
return;
}


// ================================
// VALIDASI PANJANG KARAKTER
// ================================
if(nama.length < 3){
alert("Nama minimal 3 karakter");
resetButton();
return;
}

if(deskripsi.length < 10){
alert("Deskripsi minimal 10 karakter");
resetButton();
return;
}


// ================================
// VALIDASI FILE
// ================================
if(!file){
alert("Foto wajib diupload");
resetButton();
return;
}

if(file.size > 2 * 1024 * 1024){
alert("Ukuran foto maksimal 2MB");
resetButton();
return;
}


// ================================
// UPLOAD FOTO
// ================================
hasil.innerHTML = "Upload foto...";

const fotoURL = await uploadFoto(file);

if(!fotoURL){
hasil.innerHTML = "<span style='color:red;'>Gagal upload foto</span>";
resetButton();
return;
}


// ================================
// KIRIM DATA KE APPS SCRIPT
// ================================
hasil.innerHTML = "Mengirim laporan...";

const formData = new FormData();
formData.append("action","createTicket");
formData.append("nama", cleanInput(nama));
formData.append("cabang", cleanInput(cabang));
formData.append("aset", cleanInput(aset));
formData.append("kategori", kategori);
formData.append("deskripsi", cleanInput(deskripsi));
formData.append("foto", fotoURL);
formData.append("client_time", new Date().toISOString());

const response = await fetch(API_URL,{
method:"POST",
body:formData
});

const data = await response.json();

if(data.success){

hasil.innerHTML = `
<span style="color:green;">
Laporan berhasil dikirim<br>
Ticket ID: <b>${data.ticket_id}</b>
</span>
`;

document.getElementById("formLapor").reset();

}else{

hasil.innerHTML = "<span style='color:red;'>Gagal kirim laporan</span>";

}

}catch(err){

hasil.innerHTML = "<span style='color:red;'>Terjadi kesalahan sistem</span>";
console.error(err);

}

resetButton();

}


// ================================
// RESET BUTTON STATE
// ================================
function resetButton(){
const btn = document.getElementById("btnKirim");
btn.disabled = false;
btn.innerText = "KIRIM LAPORAN";
isProcessing = false;
}
