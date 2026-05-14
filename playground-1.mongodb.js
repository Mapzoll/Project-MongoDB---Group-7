// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('MembershipDB');

db.getCollection('Transaksi').aggregate([
  {
    $lookup: {
      from: "Member Gym",       // Koleksi asal
      localField: "member_id",  // Field di koleksi Transaksi
      foreignField: "_id",      // Field di koleksi Member Gym
      as: "detail_member"       // Nama output field baru
    }
  },
  { $unwind: "$detail_member" } // Memecah array hasil lookup agar rapi
]);
