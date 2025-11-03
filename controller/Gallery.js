require("dotenv").config();
const dbo = require("../db/conn");

exports.createGallery = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    let galleryData = {
      dataType: "gallery",
      hero: {
        tag: req.body?.hero?.tag ?? "",
        heading: req.body?.hero?.heading ?? "",
        description: req.body?.hero?.description ?? "",
        image: req.body?.hero?.image ?? "",
      },
      video: {
        heading: req.body?.video?.heading ?? "",
        video: req.body?.video?.video ?? [],
      },
      image: {
        heading: req.body?.image?.heading ?? "",
        image: req.body?.image?.image ?? [],
      },
    };

    const result = await db_connect.collection("gallery").insertOne(galleryData);

    return res.status(201).send({
      status: true,
      message: "Gallery data created successfully 😃",
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

exports.editGallery = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    let updateFields = {};
    const fields = ["hero", "video", "image"];

    fields.forEach((field) => {
      if (req.body[field]) {
        updateFields[field] = req.body[field];
      }
    });

    const result = await db_connect
      .collection("gallery")
      .updateOne({ dataType: "gallery" }, { $set: updateFields });

    return res.status(200).send({
      status: true,
      message: "Gallery data updated successfully 😃",
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

exports.getGallery = async (req, res) => {
  let db_connect = dbo.getDb();
  try {
    const galleryData = await db_connect
      .collection("gallery")
      .findOne({ dataType: "gallery" });

    return res.json({ galleryData });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};