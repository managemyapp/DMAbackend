require("dotenv").config();
const dbo = require("../db/conn");
const formatDate = require("../util/formatDate");

// GET API to get user email
exports.getSubscriber = async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    const subscriber = await db_connect.collection("news").find({}).toArray();
    return res.status(200).send({ status: true, subscriber });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// POST API to store user email
exports.addSubscriber = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    // Check if the email already exists
    const existingSubscriber = await db_connect.collection("news").findOne({ email: req.body.email });
    if (existingSubscriber) {
      return res.status(400).send({
        status: false,
        message: "Email already exists!",
      });
    }

    let emailData = {
      email: req.body.email,
      subscribedAt: formatDate(new Date()),
    };

    const result = await db_connect.collection("news").insertOne(emailData);

    return res.status(201).send({
      status: true,
      message: "Subscribed successfully 😃",
      result,
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};

// DELETE API to remove user email
exports.editSubscriber = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    const result = await db_connect
      .collection("news")
      .deleteOne({ email: req.body.email });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        status: false,
        message: "Email not found!",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Unsubscribed successfully 😃",
      result,
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};
