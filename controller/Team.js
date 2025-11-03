require("dotenv").config();
const dbo = require("../db/conn");

exports.createTeam = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    let teamData = {
      dataType: "team",
      hero: {
        tag: req.body?.hero?.tag ?? "",
        heading: req.body?.hero?.heading ?? "",
        description: req.body?.hero?.description ?? "",
        image: req.body?.hero?.image ?? "",
      },
      team: {
        heading: req.body?.team?.heading ?? "",
        member: req.body?.team?.member ?? [],
      },
    };

    const result = await db_connect.collection("team").insertOne(teamData);

    return res.status(201).send({
      status: true,
      message: "Team data created successfully 😃",
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

exports.editTeam = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    let updateFields = {};
    const fields = ["hero", "team"];

    fields.forEach((field) => {
      if (req.body[field]) {
        updateFields[field] = req.body[field];
      }
    });

    const result = await db_connect
      .collection("team")
      .updateOne({ dataType: "team" }, { $set: updateFields });

    return res.status(200).send({
      status: true,
      message: "Team data updated successfully 😃",
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

exports.getTeam = async (req, res) => {
  let db_connect = dbo.getDb();
  try {
    const teamData = await db_connect
      .collection("team")
      .findOne({ dataType: "team" });

    return res.json({ teamData });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};