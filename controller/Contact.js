require("dotenv").config();
const dbo = require("../db/conn");

exports.createContact = async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    
    let contactData = {
      dataType: "contact",
      hero: {
        tag: req.body?.hero?.tag ?? "",
        heading: req.body?.hero?.heading ?? "",
        description: req.body?.hero?.description ?? "",
        image: req.body?.hero?.image ?? "",
      },
      card: {
        heading: req.body?.card?.heading ?? "",
        description: req.body?.card?.description ?? "",
        social: req.body?.card?.social ?? [],
        time: req.body?.card?.time ?? "",
        phone: req.body?.card?.phone ?? "",
        email: req.body?.card?.email ?? "",
        location: req.body?.card?.location ?? "",
      },
      form: {
        heading: req.body?.form?.heading ?? "",
        description: req.body?.form?.description ?? "",
        problems: req.body?.form?.problems ?? [],
      },
    };

    const result = await db_connect.collection("contact").insertOne(contactData);

    return res.status(201).send({
      status: true,
      message: "Contact data created successfully 😃",
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

exports.editContact = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    let updateFields = {};
    const fields = ["hero", "card", "form"];

    fields.forEach((field) => {
      if (req.body[field]) {
        updateFields[field] = req.body[field];
      }
    });

    const result = await db_connect
      .collection("contact")
      .updateOne({ dataType: "contact" }, { $set: updateFields });

    return res.status(200).send({
      status: true,
      message: "Contact data updated successfully 😃",
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

exports.getContact = async (req, res) => {
  let db_connect = dbo.getDb();
  try {
    const contactData = await db_connect
      .collection("contact")
      .findOne({ dataType: "contact" });

    return res.json({ contactData });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};