require("dotenv").config();
const dbo = require("../db/conn");

exports.createFounder = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    let FounderData = {
      dataType: "founder",
      hero: {
        tag: req.body.hero?.tag ?? "",
        heading: req.body.hero?.heading ?? "",
        description: req.body.hero?.description ?? "",
        image: req.body.hero?.image ?? "",
        default: req.body.hero?.default ?? false,
      },
      main: {
        title: req.body.main?.title ?? "",
        description: req.body?.main?.description ?? "",
        url: req.body.main?.url ?? "",
      },
      founderCard:{
        image:req.body.founderCard?.image??"",
        name:req.body.founderCard?.name??"",
        status:req.body.founderCard?.status??"",
        message:req.body.founderCard?.message??"",
        // social:req.body.founderCard?.social??[{logo:"",value:""}],
        instagram:req.body.founderCard?.instagram??"",
        twitter:req.body.founderCard?.twitter??"",
        mail:req.body.founderCard?.mail??"",
        linkedin:req.body.founderCard?.linkedin??"",
        facebook:req.body.founderCard?.facebook??"",

      }
    };

    const result = await db_connect.collection("founder").insertOne(FounderData);

    return res.status(201).send({
      status: true,
      message: "founder data created successfully 😃",
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

exports.EditFounder=async(req,res)=>{
try {
    let db_connect = dbo.getDb();

    let updateFields = {};
    const sections = ['hero', 'main', 'founderCard'];

    sections.forEach((section) => {
      if (req.body[section]) {
        updateFields[`${section}`] = req.body[section];
      }
    });

    const result = await db_connect.collection("founder").updateOne(
      { dataType: "founder" },
      { $set: updateFields }
    );

    return res.status(200).send({
      status: true,
      message: "Founder data updated successfully 😃",
      result,
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
      error: err.message,
    });
  }
}

exports.getFounder = async (req, res) => {
  let db_connect = dbo.getDb();
  try {
    const founderData = await db_connect
      .collection("founder")
      .findOne({ dataType: "founder" });

    return res.json({ founderData });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};
