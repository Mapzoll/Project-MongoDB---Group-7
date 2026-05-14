require('dotenv').config();
const mongodb = require('mongodb');

class Database {
   constructor() {
      this.client = new mongodb.MongoClient(process.env.MONGODB_URI);
   }

   async connect() {
      await this.client.connect();
      console.log('Connected to MongoDB');
   }

   async close() {
      return await this.client.close();
   }

}

module.exports = Database;