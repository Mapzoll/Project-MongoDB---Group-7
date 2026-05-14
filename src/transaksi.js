const mongodb = require('mongodb');
require('dotenv').config();

class transactionmodel {
   constructor() {
      this.client = new mongodb.MongoClient(process.env.MONGODB_URI);
      this.db = this.client.db('MembershipDB').collection('Transaksi');
   }

   async findAll() {
      return await this.db.find().toArray();
   }

   async insertOne(member_id, tgl_transaksi, alat_dipakai) {
      await this.db.insertOne({ member_id: new mongodb.ObjectId(member_id), tgl_transaksi: new Date(tgl_transaksi), alat_dipakai });
      return 'Transaction Inserted!';
   }

   async updateOne(id, member_id, tgl_transaksi, alat_dipakai) {
      await this.db.updateOne({ _id: new mongodb.ObjectId(id) }, { $set: { member_id: new mongodb.ObjectId(member_id), tgl_transaksi: new Date(tgl_transaksi), alat_dipakai } });
      return 'Transaction Updated!';
   }

   async deleteOne(id) {
      await this.db.deleteOne({ _id: new mongodb.ObjectId(id) });
      return 'Transaction Deleted!';
   }

   async deleteAll() {
      await this.db.deleteMany({});
      return 'All Transactions Deleted!';
   }
}
module.exports = transactionmodel;
