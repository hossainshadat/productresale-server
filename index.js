const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Resale product server is running");
});

const uri =
  "mongodb+srv://admin:storeadmin@cluster0.xovey.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function dbConnect() {
  try {
    await client.connect();
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(error.name, error.message);
  }
}

dbConnect();

const Category = client.db("resaleStore").collection("category");

// Home category

app.get("/category", async (req, res) => {
  try {
    const cursor = Category.find({});
    const category = await cursor.toArray();

    res.send({
      success: true,
      message: "Successfully get the Data",
      data: category,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Resale app listening on port: ${port}`);
});

module.exports = app;
