require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const ProductModel = require('./src/member');
const KategoriModel = require('./src/kategorialat');
const TransactionModel = require('./src/transaksi');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const pm = new ProductModel();
const km = new KategoriModel();
const tm = new TransactionModel();

//  MEMBER GYM 
app.get('/api/members', async (req, res) => {
    try {
        const data = await pm.findAll();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/members', async (req, res) => {
    try {
        const { nama, domisili, umur, gender, status, status_member } = req.body;
        await pm.insertOne(nama, domisili, Number(umur), gender, status, status_member);
        res.json({ message: 'Member berhasil ditambahkan!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/members/:id', async (req, res) => {
    try {
        await pm.deleteOne(req.params.id);
        res.json({ message: 'Member berhasil dihapus!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

//  KATEGORI ALAT 
app.get('/api/kategori', async (req, res) => {
    try {
        const data = await km.findAll();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/kategori', async (req, res) => {
    try {
        const { nama_kategori, daftar_alat, kegunaan } = req.body;
        const alatArray = daftar_alat ? daftar_alat.split(',').map(s => s.trim()) : [];
        
        const existing = await km.db.findOne({ nama_kategori: nama_kategori });
        if (existing) {
            let newAlat = existing.daftar_alat || [];
            if (!Array.isArray(newAlat)) newAlat = [newAlat];
            newAlat = newAlat.concat(alatArray);
            newAlat = [...new Set(newAlat)]; // Hapus duplikat
            
            const finalKegunaan = kegunaan || existing.kegunaan || '-';
            await km.db.updateOne({ _id: existing._id }, { $set: { daftar_alat: newAlat, kegunaan: finalKegunaan } });
            res.json({ message: 'Alat berhasil ditambahkan ke kategori yang ada!' });
        } else {
            const finalKegunaan = kegunaan || '-';
            await km.insertOne(nama_kategori, alatArray, finalKegunaan);
            res.json({ message: 'Kategori baru berhasil ditambahkan!' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/kategori/:id', async (req, res) => {
    try {
        await km.deleteOne(req.params.id);
        res.json({ message: 'Kategori berhasil dihapus!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//  TRANSACTION GYM 
app.get('/api/transactions', async (req, res) => {
    try {
        const data = await tm.findAll();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/transactions', async (req, res) => {
    try {
        const { member_id, tgl_transaksi, alat_dipakai } = req.body;
        // Konversi string yang dipisah koma menjadi array
        const alatArray = alat_dipakai.split(',').map(s => s.trim());
        await tm.insertOne(member_id, tgl_transaksi, alatArray);
        await pm.incrementKehadiran(member_id);
        res.json({ message: 'Transaksi berhasil ditambahkan!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/transactions/:id', async (req, res) => {
    try {
        const { ObjectId } = require('mongodb');
        const trx = await tm.db.findOne({_id: new ObjectId(req.params.id)});
        if(trx && trx.member_id) {
            await pm.decrementKehadiran(trx.member_id.toString());
        }
        await tm.deleteOne(req.params.id);
        res.json({ message: 'Transaksi berhasil dihapus!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/transactions', async (req, res) => {
    try {
        await tm.deleteAll();
        await pm.resetAllKehadiran();
        res.json({ message: 'Semua Transaksi berhasil dihapus!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Jalankan Web Server
app.listen(port, () => {
    console.log('\n=======================================');
    console.log(`🚀 WEB SERVER AKTIF DI PORT ${port}`);
    console.log('=======================================');
    console.log('Untuk melihat tampilan website HTML/CSS, buka link berikut di browser:');
    console.log(`👉 http://localhost:${port}`);
    console.log('Semua proses CRUD di website akan otomatis tersimpan di MongoDB Atlas!');
    console.log('Tekan Ctrl + C untuk mematikan server.');
});
