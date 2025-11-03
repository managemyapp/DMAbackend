require("dotenv").config();
const dbo = require("../db/conn");

exports.createFooter = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    let footerData = {
      dataType: "footer",
      heading: req.body?.heading ?? "",
      description: req.body?.description ?? "",
      newsletter: req.body?.newsletter ?? "",
      image: req.body?.image ?? "",
      contact: {
        heading: req.body?.contact?.heading ?? "",
        description: req.body?.contact?.description ?? "",
        links: req.body?.contact?.links ?? [""],
      },
      copyright: req.body?.copyright ?? "",
      firstSection: {
        heading: req.body?.firstSection?.heading ?? "",
        link: req.body?.firstSection?.link ?? [],
      },
      secondSection: {
        heading: req.body?.secondSection?.heading ?? "",
        link: req.body?.secondSection?.link ?? [],
      },
      thirdSection: {
        heading: req.body?.thirdSection?.heading ?? "",
        link: req.body?.thirdSection?.link ?? [],
      },
    };

    const result = await db_connect.collection("footer").insertOne(footerData);

    return res.status(201).send({
      status: true,
      message: "Footer data created successfully 😃",
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

exports.editFooter = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    let updateFields = {};
    const fields = ["heading", "description", "newsletter", "image", "contact", "copyright", "firstSection", "secondSection", "thirdSection"];

    fields.forEach((field) => {
      if (req.body[field]) {
        updateFields[field] = req.body[field];
      }
    });

    const result = await db_connect
      .collection("footer")
      .updateOne({ dataType: "footer" }, { $set: updateFields });

    return res.status(200).send({
      status: true,
      message: "Footer data updated successfully 😃",
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

exports.getFooter = async (req, res) => {
  let db_connect = dbo.getDb();
  try {
    const footerData = await db_connect
      .collection("footer")
      .findOne({ dataType: "footer" });

    return res.json({ footerData });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};