const Database = require('./db');
const mongodb = require('mongodb');

class productmodel {
   constructor() {
      this.client = new mongodb.MongoClient(process.env.MONGODB_URI);
      this.db = this.client.db('MembershipDB').collection('Member Gym');
   }

   async findAll() {
      return await this.db.find().toArray();
   }

   async insertOne(nama, domisili, umur, gender, status, status_member) {
      await this.db.insertOne({ nama: nama, domisili: domisili, umur: umur, gender: gender, status: status, status_member: status_member, kehadiran: 0 });
      return 'Data Inserted!';
   }

   async incrementKehadiran(id) {
       let result = await this.db.updateOne({ _id: new mongodb.ObjectId(id) }, { $inc: { kehadiran: 1 } });
       if (result.matchedCount === 0) {
           await this.db.updateOne({ _id: id }, { $inc: { kehadiran: 1 } });
       }
   }

   async decrementKehadiran(id) {
       let result = await this.db.updateOne({ _id: new mongodb.ObjectId(id) }, { $inc: { kehadiran: -1 } });
       if (result.matchedCount === 0) {
           await this.db.updateOne({ _id: id }, { $inc: { kehadiran: -1 } });
       }
   }

   async resetAllKehadiran() {
       await this.db.updateMany({}, { $set: { kehadiran: 0 } });
   }

   async findFilter(query) {
      return await this.db.find(query).toArray();
   }

   async updateOne(id, nama, domisili, umur, gender, status, status_member) {
      let result = await this.db.updateOne({ _id: new mongodb.ObjectId(id) }, { $set: { nama, domisili, umur, gender, status, status_member } });
      if (result.matchedCount === 0) {
          await this.db.updateOne({ _id: id }, { $set: { nama, domisili, umur, gender, status, status_member } });
      }
      return 'Data Updated!';
   }

   async deleteOne(id) {
      let result = await this.db.deleteOne({ _id: new mongodb.ObjectId(id) });
      if (result.deletedCount === 0) {
          await this.db.deleteOne({ _id: id });
      }
      return 'Data Deleted!';
   }

}
module.exports = productmodel;