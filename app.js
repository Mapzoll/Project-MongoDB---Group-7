const Database = require('./src/db');
const menu = require('./src/menu');
const productmodel = require('./src/member');
const rl = require('readline-sync');

async function main() {
    const dbManager = new Database();

    try {
        await dbManager.connect('MembershipDB');
        const m = new menu();

        while (true) {
            console.log('\n=== Menu Utama ===');
            console.log('1. Insert Member');
            console.log('2. View All Members');
            console.log('3. Filter Member');
            console.log('4. Update Member');
            console.log('5. Delete Member');
            console.log('6. Exit');

            const choice = rl.question('Enter your choice: ');

            if (choice === '1') { await m.registrasiMember(); }
            else if (choice === '2') { await m.tampilkanDaftarMember(); }
            else if (choice === '3') { await m.filterMember(); }
            else if (choice === '4') { await m.perbaruiMember(); }
            else if (choice === '5') { await m.hapusMember(); }
            else if (choice === '6') {
                console.log('Bye Bye!');
                await dbManager.client.close();
                return;
            } else {
                console.log('Pilihan tidak valid, silakan coba lagi.');
            }
        }
    } catch (error) {
        console.error('Terjadi kesalahan fatal:', error.message);
    }
}

main().catch(console.error);