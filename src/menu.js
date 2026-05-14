const productmodel = require('./member');
const rl = require('readline-sync');

class menu {
    constructor() {
        this.pm = new productmodel();
    }

    // Fungsi pembantu agar tidak menulis ulang tampilan daftar berkali-kali
    async tampilkanDaftar() {
        const members = await this.pm.findAll();
        console.log('\n= Daftar Member Gym =');
        members.forEach((e, index) => {
            console.log(`${index + 1}. ${e.nama} | ${e.umur} tahun | ${e.gender} | ${e.domisili} | ${e.status} | ${e.status_member}`);
        });
        return members;
    }

    async registrasiMember() {
        console.log('\n-- Tambah Member Baru --');
        const nama = rl.question('Masukkan nama: ');
        const domisili = rl.question('Masukkan domisili: ');
        const umur = Number(rl.question('Masukkan umur: '));
        const gender = rl.question('Masukkan gender (Laki-laki/Perempuan): ');
        const status = rl.question('Masukkan status (Pekerja/Pelajar): ');
        const status_member = rl.question('Masukkan status member (Gold/Silver/Standard): ');

        const insert = await this.pm.insertOne(nama, domisili, umur, gender, status, status_member);
        console.log('>>>', insert);
    }

    async tampilkanDaftarMember() {
        await this.tampilkanDaftar();
    }

    async filterMember() {
        console.log('\n=== Menu Filter Member ===');
        console.log('1. Berdasarkan Gender');
        console.log('2. Berdasarkan Status Member');
        const kategori = rl.question('Pilih kategori filter: ');

        let query = {};

        if (kategori === '1') {
            console.log('Pilih Gender: (1. Laki-laki / 2. Perempuan)');
            const gChoice = rl.question('Pilihan: ');
            query = { gender: gChoice === '1' ? 'Laki-laki' : 'Perempuan' };
        }
        else if (kategori === '2') {
            console.log('Pilih Status: (1. Gold / 2. Silver / 3. Standard)');
            const sChoice = rl.question('Pilihan: ');
            const statusMap = { '1': 'Gold', '2': 'Silver', '3': 'Standard' };
            query = { status_member: statusMap[sChoice] };
        } else {
            console.log('Pilihan tidak valid.');
            return;
        }

        // Eksekusi filter ke model
        const hasil = await this.pm.findFilter(query);

        console.log(`\n--- Hasil Filter: ${Object.values(query)[0]} ---`);
        if (hasil.length === 0) {
            console.log('Tidak ada member ditemukan.');
        } else {
            hasil.forEach((e, index) => {
                console.log(`${index + 1}. ${e.nama} | ${e.umur} tahun | ${e.domisili} | ${e.status} | ${e.status_member}`);
            });
        }
    }
    async perbaruiMember() {
        const members = await this.tampilkanDaftar();
        const index = Number(rl.question('\nPilih nomor member yang ingin diperbarui: ')) - 1;

        if (index < 0 || index >= members.length) {
            console.log('>>> Member tidak ditemukan.');
            return;
        }

        console.log('- Masukkan Data Baru -');
        const nama = rl.question('Nama baru: ');
        const domisili = rl.question('Domisili baru: ');
        const umur = Number(rl.question('Umur baru: '));
        const gender = rl.question('Gender baru (Laki-laki/Perempuan): ');
        const status = rl.question('Status baru (Pekerja/Pelajar): ');
        const status_member = rl.question('Status member baru (Gold/Silver/Standard): ');

        const update = await this.pm.updateOne(members[index]._id, nama, domisili, umur, gender, status, status_member);
        console.log('>>>', update);
    }

    async hapusMember() {
        const members = await this.tampilkanDaftar();
        const index = Number(rl.question('\nPilih nomor member yang ingin dihapus: ')) - 1;

        if (index < 0 || index >= members.length) {
            console.log('>>> Member tidak ditemukan.');
            return;
        }

        const deleteResult = await this.pm.deleteOne(members[index]._id);
        console.log('>>>', deleteResult);
    }
}

module.exports = menu;