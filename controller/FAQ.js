require("dotenv").config();
const dbo = require("../db/conn");

exports.createFaq = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    let faqData = {
      dataType: "faq",
      heading: req.body?.heading ?? "",
      faq: req.body?.faq ?? [], // Array of [question, answer]
    };

    const result = await db_connect.collection("faq").insertOne(faqData);

    return res.status(201).send({
      status: true,
      message: "FAQ data created successfully 😃",
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

exports.editFaq = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    let updateFields = {};
    const fields = ["heading", "faq"];

    fields.forEach((field) => {
      if (req.body[field]) {
        updateFields[field] = req.body[field];
      }
    });

    const result = await db_connect
      .collection("faq")
      .updateOne({ dataType: "faq" }, { $set: updateFields });

    return res.status(200).send({
      status: true,
      message: "FAQ data updated successfully 😃",
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

exports.getFaq = async (req, res) => {
  let db_connect = dbo.getDb();
  try {
    const faqData = await db_connect
      .collection("faq")
      .findOne({ dataType: "faq" });

    return res.json({ faqData });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};
