require("dotenv").config();
const dbo = require("../db/conn");

exports.createHeader = async (req, res) => {

     try {
            let db_connect = dbo.getDb();
        
            let headerData = {
              dataType: "header",
               hero: {
                number: req.body?.hero?.number ?? "",
                email: req.body?.hero?.email ?? "",
              }
              
            }
        
            const result = await db_connect.collection("header").insertOne(headerData);
        
            return res.status(201).send({
              status: true,
              message: "Header data created successfully 😃",
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

exports.editHeader = async (req, res) => {
    try {
      console.log("Incoming request body:", req.body);
      let db_connect = dbo.getDb();
  
      let updateFields = {};
      const fields = ["hero"];
  
      fields.forEach((field) => {
        if (req.body[field]) {
          updateFields[field] = req.body[field];
        }
      });
  
      console.log("Update fields:", updateFields);
  
      const result = await db_connect
        .collection("header")
        .updateOne({ dataType: "header" }, { $set: updateFields });
  
      console.log("Update result:", result);
  
      // Check if any document was actually modified
      if (result.modifiedCount === 0) {
        return res.status(404).send({
          status: false,
          message: "No matching document found to update"
        });
      }
  
      return res.status(200).send({
        status: true,
        message: "Header data updated successfully 😃",
        result,
      });
    } catch (err) {
      console.error("Update error:", err);
      return res.status(500).send({
        status: false,
        message: "Internal Server Error!",
        error: err.message,
      });
    }
  };

exports.getHeader = async (req, res) => {
  let db_connect = dbo.getDb();
  try {
    const headerData = await db_connect
      .collection("header")
      .findOne({ dataType: "header" });
    return res.json({ headerData });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};