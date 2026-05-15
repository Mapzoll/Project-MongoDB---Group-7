// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('MembershipDB');
db.getCollection('Member Gym').aggregate([
  {
    $group: {
      _id: null,
      rataRataUmur: { $avg: "$umur" },
      totalMember: { $sum: 1 }
    }
  }
]);