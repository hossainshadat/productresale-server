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

const uri = `mongodb+srv://${process.env.DBID}:${process.env.DBPASS}@cluster0.xovey.mongodb.net/?retryWrites=true&w=majority`;

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
const ProductCategory = client.db("resaleStore").collection("productCategory");
const ProductBooking = client.db("resaleStore").collection("ProductBooking");

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

// Category Product

app.get("/productcategory", async (req, res) => {
  try {
    const query = {
      category_id: req.query.category_id,
    };
    // let query = {};
    // if (req.query.id) {
    //   query = {
    //     category_id: req.query.id,
    //   };
    // } else {
    //   query = {
    //     category_id: req.query.category_id,
    //   };
    // }
    const cursor = ProductCategory.find(query);
    const categoryProduct = await cursor.toArray();

    res.send({
      success: true,
      message: "Successfully get the Data",
      data: categoryProduct,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// productCategory post

app.post("/productcategory", async (req, res) => {
  try {
    const prodCate = req.body;
    const cateItem = await ProductCategory.insertOne(prodCate);

    res.send({
      success: true,
      message: "Successfully add the Data",
      data: cateItem,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// Product Booking

app.get("/booking", async (req, res) => {
  try {
    const query = {
      email: req.query.email,
    };
    const cursor = ProductBooking.find(query);
    const productBooked = await cursor.toArray();

    res.send({
      success: true,
      message: "Successfully get the Data",
      data: productBooked,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});
app.post("/booking", async (req, res) => {
  try {
    const booking = req.body;
    const booked = await ProductBooking.insertOne(booking);

    res.send({
      success: true,
      message: "Successfully add the Data",
      data: booked,
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
