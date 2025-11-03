const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = "mongodb+srv://dmassociatesin:LE5nIx28duJ0FYXu@dma.2n2jff3.mongodb.net/?retryWrites=true&w=majority&appName=DMA";

let client;
let clientPromise;
let db;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  clientPromise = client.connect();
}

module.exports = {
  connectToServer: async function () {
    try {
      if (!db) {
        const connectedClient = await clientPromise;
        db = connectedClient.db("dma");
        console.log("Successfully connected to MongoDB.");
      }
      return db;
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
      throw err;
    }
  },

  getDb: function () {
    return db;
  },
};