require("dotenv").config();
const dbo = require("../db/conn");

exports.createBrochure = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    let brochureData = {
      dataType: "brochure",
      heading: req.body?.heading ?? "",
      description: req.body?.description ?? "",
      title: req.body?.title ?? "",
      url: req.body?.url ?? "",
    };

    const result = await db_connect
      .collection("brochure")
      .insertOne(brochureData);

    return res.status(201).send({
      status: true,
      message: "Brochure data created successfully 😃",
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

exports.editBrochure = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    let updateFields = {};
    const fields = ["heading", "description", "title", "url"];

    fields.forEach((field) => {
      if (req.body[field] != null || req.body[field] != undefined) {
        updateFields[field] = req.body[field];
      }
    });

    const result = await db_connect
      .collection("brochure")
      .updateOne({ dataType: "brochure" }, { $set: updateFields });

    return res.status(200).send({
      status: true,
      message: "Brochure data updated successfully 😃",
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

exports.getBrochure = async (req, res) => {
  let db_connect = dbo.getDb();
  try {
    const brochureData = await db_connect
      .collection("brochure")
      .findOne({ dataType: "brochure" });

    return res.json({ brochureData });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};
