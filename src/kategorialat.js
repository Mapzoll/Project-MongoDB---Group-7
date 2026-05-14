const mongodb = require('mongodb');
require('dotenv').config();

class kategorimodel {
   constructor() {
      this.client = new mongodb.MongoClient(process.env.MONGODB_URI);
      this.db = this.client.db('MembershipDB').collection('Kategori Alat');
   }

   async findAll() {
      return await this.db.find().toArray();
   }

   async insertOne(nama_kategori, daftar_alat, kegunaan) {
      await this.db.insertOne({ nama_kategori, daftar_alat, kegunaan });
      return 'Kategori Alat Inserted!';
   }

   async updateOne(id, nama_kategori, daftar_alat, kegunaan) {
      await this.db.updateOne({ _id: new mongodb.ObjectId(id) }, { $set: { nama_kategori, daftar_alat, kegunaan } });
      return 'Kategori Alat Updated!';
   }

   async deleteOne(id) {
      await this.db.deleteOne({ _id: new mongodb.ObjectId(id) });
      return 'Kategori Alat Deleted!';
   }
}
module.exports = kategorimodel;
