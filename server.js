const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Lokasi file penyimpanan permanen kita
const FILE_DATA = path.join(__dirname, 'transaksi.json');

// Fungsi 1: Baca data dari file transaksi.json
function bacaData() {
  // Jika file transaksi.json belum ada, buat dulu dengan Modal Awal
  if (!fs.existsSync(FILE_DATA)) {
    const dataAwal = [{ id: 1, nama: 'Modal Awal', nominal: 500000, tipe: 'masuk' }];
    fs.writeFileSync(FILE_DATA, JSON.stringify(dataAwal, null, 2));
    return dataAwal;
  }
  const isiFile = fs.readFileSync(FILE_DATA, 'utf-8');
  return JSON.parse(isiFile);
}

// Fungsi 2: Simpan array transaksi ke file transaksi.json
function simpanData(data) {
  fs.writeFileSync(FILE_DATA, JSON.stringify(data, null, 2));
}

// Ambil semua transaksi dari file
app.get('/api/transaksi', (req, res) => {
  const daftarTransaksi = bacaData();
  res.json(daftarTransaksi);
});

// Tambah transaksi baru & simpan permanen ke file
app.post('/api/transaksi', (req, res) => {
  const { nama, nominal, tipe } = req.body;

  if (!nama || nominal <= 0 || !['masuk', 'keluar'].includes(tipe)) {
    return res.status(400).json({ pesan: 'Data tidak valid!' });
  }

  const daftarTransaksi = bacaData();
  const transaksiBaru = {
    id: Date.now(),
    nama: nama,
    nominal: Number(nominal),
    tipe: tipe
  };

  daftarTransaksi.push(transaksiBaru);
  simpanData(daftarTransaksi); // Tulis ke transaksi.json!
  res.status(201).json(transaksiBaru);
});

// Hapus transaksi & perbarui file
app.delete('/api/transaksi/:id', (req, res) => {
  const id = Number(req.params.id);
  let daftarTransaksi = bacaData();
  daftarTransaksi = daftarTransaksi.filter((item) => item.id !== id);
  simpanData(daftarTransaksi); // Tulis ulang ke transaksi.json!
  res.json({ pesan: 'Terhapus' });
});

app.listen(PORT, () => {
  console.log(`Server Day 3 (Penyimpanan Permanen) jalan di http://localhost:${PORT}`);
});