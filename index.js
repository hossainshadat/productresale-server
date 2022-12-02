const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const jwt = require("jsonwebtoken");

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Resale product server is running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xovey.mongodb.net/?retryWrites=true&w=majority`;

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

const Users = client.db("resaleStore").collection("users");
const Category = client.db("resaleStore").collection("category");
const ProductCategory = client.db("resaleStore").collection("productCategory");
const ProductBooking = client.db("resaleStore").collection("ProductBooking");
const advertiseProducts = client
  .db("resaleStore")
  .collection("advertiseProducts");

/// Users

// app.post("/users", async (req, res) => {
//   try {
//     const user = req.body;
//     const users = await Users.insertOne(user);

//     res.send({
//       success: true,
//       message: "Successfully add the Data",
//       data: users,
//     });
//   } catch (error) {
//     res.send({
//       success: false,
//       message: error.message,
//     });
//   }
// });

app.put("/users/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = req.body;
    const filter = { email: email };
    const options = { upsert: true };
    const updateDoc = {
      $set: user,
    };
    const result = await Users.updateOne(filter, updateDoc, options);

    console.log(result);

    res.send({
      success: true,
      message: "Successfully add the Data",
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

app.get("/users", async (req, res) => {
  try {
    let query = {};
    if (req.query.email) {
      query = {
        email: req.query.email,
      };
    }
    const cursor = Users.find(query);
    const user = await cursor.toArray();

    res.send({
      success: true,
      message: "Successfully get the Data",
      data: user,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// delete user
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findOne({ _id: ObjectId(id) });

    if (!user?._id) {
      res.send({
        success: false,
        error: "User doesn't exist",
      });
      return;
    }
    const result = await Users.deleteOne({ _id: ObjectId(id) });

    if (result.deletedCount) {
      res.send({
        success: true,
        message: "Successfully deleted the User",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      message: "error.message",
    });
  }
});

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
    // const query = {
    //   category_id: req.query.category_id,
    // };
    let query = {};
    if (req.query.email) {
      query = {
        email: req.query.email,
      };
    } else {
      query = {
        category_id: req.query.category_id,
      };
    }
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
// productCategory Delete
app.delete("/productcategory/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const productInfo = await ProductCategory.findOne({ _id: ObjectId(id) });

    if (!productInfo?._id) {
      res.send({
        success: false,
        error: "Product doesn't exist",
      });
      return;
    }
    const result = await ProductCategory.deleteOne({ _id: ObjectId(id) });

    if (result.deletedCount) {
      res.send({
        success: true,
        message: "Successfully deleted the Product",
      });
    }
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

/// product Advertise

app.post("/advertise", async (req, res) => {
  try {
    const advertise = req.body;
    const advertiseItem = await advertiseProducts.insertOne(advertise);

    res.send({
      success: true,
      message: "Successfully add the Data",
      data: advertiseItem,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

app.get("/advertise", async (req, res) => {
  try {
    const cursor = advertiseProducts.find({});
    const advertiseItem = await cursor.toArray();

    res.send({
      success: true,
      message: "Successfully get the Data",
      data: advertiseItem,
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
