require("dotenv").config();
const dbo = require("../db/conn");

exports.createTestimonial = async (req, res) => {
     try {
        let db_connect = dbo.getDb();
    
        let testimonialData = {
          dataType: "testimonial",
          hero: {
            tag: req.body?.hero?.tag ?? "",
            heading: req.body?.hero?.heading ?? "",
            description: req.body?.hero?.description ?? "",
            image: req.body?.hero?.image ?? "",
          },
          client: {
            heading: req.body.client?.heading ?? "",
            video: req.body.client?.video ?? [],
          },
          service: {
            heading: req.body.service?.heading ?? "",
            video: req.body.service?.video ?? [],
          },
        }
    
        const result = await db_connect.collection("testimonial").insertOne(testimonialData);
    
        return res.status(201).send({
          status: true,
          message: "Testimonial data created successfully 😃",
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

exports.editTestimonial = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    let updateFields = {};
    const fields = ["hero", "client", "service"];

    fields.forEach((field) => {
      if (req.body[field]) {
        updateFields[field] = req.body[field];
      }
    });

    const result = await db_connect
      .collection("testimonial")
      .updateOne({ dataType: "testimonial" }, { $set: updateFields });

    return res.status(200).send({
      status: true,
      message: "Testimonial data updated successfully 😃",
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

exports.getTestimonial = async (req, res) => {
  let db_connect = dbo.getDb();
  try {
    const testimonialData = await db_connect
      .collection("testimonial")
      .findOne({ dataType: "testimonial" });

    return res.json({ testimonialData });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};