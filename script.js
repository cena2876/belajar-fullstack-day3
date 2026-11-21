const inputNama = document.getElementById('namaItem');
const inputNominal = document.getElementById('nominal');
const btnMasuk = document.getElementById('btnMasuk');
const btnKeluar = document.getElementById('btnKeluar');
const daftar = document.getElementById('daftarTransaksi');
const elSisaSaldo = document.getElementById('sisaSaldo');

const API_URL = 'http://localhost:3000/api/transaksi';

// Tampilkan 1 baris transaksi dengan warna & tanda sesuai tipe
function tampilkanKeLayar(item) {
  const li = document.createElement('li');
  const isMasuk = item.tipe === 'masuk';
  const tanda = isMasuk ? '+' : '-';
  const kelasWarna = isMasuk ? 'nominal-masuk' : 'nominal-keluar';

  li.innerHTML = `
    <span class="item-nama">${item.nama}</span>
    <div class="item-kanan">
      <strong class="${kelasWarna}">${tanda} Rp ${Number(item.nominal).toLocaleString('id-ID')}</strong>
      <button class="btn-hapus" onclick="hapusTransaksi(${item.id})" title="Hapus">×</button>
    </div>
  `;
  daftar.appendChild(li);
}

// Ambil semua data dari server & hitung saldo otomatis
async function muatTransaksi() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    daftar.innerHTML = '';
    let saldo = 0;

    data.forEach((item) => {
      tampilkanKeLayar(item);
      if (item.tipe === 'masuk') {
        saldo += Number(item.nominal);
      } else {
        saldo -= Number(item.nominal);
      }
    });

    elSisaSaldo.textContent = `Rp ${saldo.toLocaleString('id-ID')}`;
    elSisaSaldo.style.color = saldo < 0 ? '#ef4444' : '#10b981';
  } catch (error) {
    console.error('Gagal mengambil data:', error);
  }
}

// Fungsi kirim transaksi baru ('masuk' atau 'keluar')
async function kirimTransaksi(tipe) {
  const nama = inputNama.value.trim();
  const nominal = Number(inputNominal.value);

  if (!nama || nominal <= 0) {
    alert('Isi keterangan dan nominal yang benar!');
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama, nominal, tipe })
    });

    if (response.ok) {
      inputNama.value = '';
      inputNominal.value = '';
      muatTransaksi();
    }
  } catch (error) {
    alert('Server backend mati! Jalankan node server.js dulu di terminal.');
  }
}

// Hapus transaksi berdasarkan ID
async function hapusTransaksi(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  muatTransaksi();
}

btnMasuk.addEventListener('click', () => kirimTransaksi('masuk'));
btnKeluar.addEventListener('click', () => kirimTransaksi('keluar'));

muatTransaksi();