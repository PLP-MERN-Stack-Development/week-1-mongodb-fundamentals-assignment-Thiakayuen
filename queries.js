// queries.js
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017"; 

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("bookstore");
    const books = db.collection("books");

    // Example query: Find all books
    const allBooks = await books.find().toArray();
    console.log("All books:", allBooks);
    
    // Example query: Find books by genre
    const sciFi = await books.find({ genre: "Science Fiction" }).toArray();
    console.log("Sci-Fi Books:", sciFi);

    // Add more queries here...

  } finally {
    await client.close();
  }
}
run().catch(console.dir);


// Advanced Queries

// Books in stock and published after 2010
console.log(await books.find({
	in_stock: true,
	published_year: { $gt: 2010 }
}).toArray());

// Projection: only title, author, price
console.log(await books.find({}, {
	projection: { title: 1, author: 1, price: 1, _id: 0 }
}).toArray());

// Sort by price ascending
console.log(await books.find().sort({ price: 1 }).toArray());

// Sort by price descending
console.log(await books.find().sort({ price: -1 }).toArray());

// Pagination: 5 books per page, skip first 5 (page 2)
console.log(await books.find().skip(5).limit(5).toArray());


// Aggregation Pipeline

// Avg price by genre
console.log(await books.aggregate([
	{ $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
]).toArray());

// Author with most books
console.log(await books.aggregate([
	{ $group: { _id: "$author", count: { $sum: 1 } } },
	{ $sort: { count: -1 } },
	{ $limit: 1 }
]).toArray());

// Group books by decade
console.log(await books.aggregate([
	{
	$group: {
		_id: {
		$concat: [
			{ $toString: { $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10] } },
			"s"
		]
		},
		count: { $sum: 1 }
	}
	}
]).toArray());


// Indexing

// Index on title
await books.createIndex({ title: 1 });

// Compound index
await books.createIndex({ author: 1, published_year: -1 });

// Explain performance
const explainBefore = await books.find({ title: "The Alchemist" }).explain();
console.log("Explain:", explainBefore);
