require("dotenv").config();
const dbo = require("../db/conn");

exports.createAbout = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    let aboutData = {
      dataType: "about",
      hero: {
        tag: req.body?.hero?.tag ?? "",
        heading: req.body?.hero?.heading ?? "",
        description: req.body?.hero?.description ?? "",
        image: req.body?.hero?.image ?? "",
      },
      overview: {
        heading: req.body?.overview?.heading ?? "",
        description: req.body?.overview?.description ?? "",
        image: req.body?.overview?.image ?? "",
        section: req.body?.overview?.section ?? [], 
        phone: req.body?.overview?.phone ?? "",
      },
      value: req.body?.value ?? [],
      message: {
        heading: req.body?.message?.heading ?? "",
        description: req.body?.message?.description ?? "",
        image: req.body?.message?.image ?? "",
        name: req.body?.message?.name ?? "",
        designation: req.body?.message?.designation ?? "",
        links: req.body?.message?.links ?? [],
        quote: req.body?.message?.quote ?? "",
      },
      // team: {
      //   heading: req.body?.team?.heading ?? "",
      //   member: req.body?.team?.member ?? [],
      // },
    };

    const result = await db_connect.collection("about").insertOne(aboutData);

    return res.status(201).send({
      status: true,
      message: "About data created successfully 😃",
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

exports.editAbout = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    let updateFields = {};
    const fields = ["hero", "overview", "value", "message"];

    fields.forEach((field) => {
      if (req.body[field]) {
        updateFields[field] = req.body[field];
      }
    });

    const result = await db_connect
      .collection("about")
      .updateOne({ dataType: "about" }, { $set: updateFields });

    return res.status(200).send({
      status: true,
      message: "About data updated successfully 😃",
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

exports.getAbout = async (req, res) => {
  let db_connect = dbo.getDb();
  try {
    const aboutData = await db_connect
      .collection("about")
      .findOne({ dataType: "about" });

    const teamData = await db_connect
      .collection("team")
      .findOne({ dataType: "team" });

    // Merge team data with aboutData
    if (teamData) {
      aboutData.team = teamData.team;
    }

    return res.json({ aboutData });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};


// create comment post api where user can comment in a blog and other user can reply to the comment and the comments can be deeply nested, user do not need to log in, user just need to type their name, email and comment and the _id of blog will be collected from frontend blog page. by default all comments will be approved = false. and create a get api to fetch only all approved = true comments in a deeply nested object. and api for admin panel to approved the approve = false comments