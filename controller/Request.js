require("dotenv").config();
const dbo = require("../db/conn");
const { ObjectId } = require("mongodb");
const nodemailer = require("nodemailer");
const { convert } = require("html-to-text");
const {
  createUserEmailTemplate,
  createAdminEmailTemplate,
} = require("../util/emailTemplates");

// Configure nodemailer (set these environment variables)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to check if an email is valid (basic check)
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (
    regex.test(email) && !email.endsWith(".test") && !email.endsWith(".example")
  );
}

exports.createRequest = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    const { type, name, email, subject, problem, phone, message } = req.body;

    if (!["help", "contact", "callback"].includes(type)) {
      return res.status(400).send({
        status: false,
        message: "Invalid request type",
      });
    }

    let requestData = {
      type,
      name,
      email,
      subject,
      problem,
      phone,
      message,
      createdAt: new Date(),
      responded: false,
    };

    // Remove undefined fields
    Object.keys(requestData).forEach(
      (key) => requestData[key] === undefined && delete requestData[key]
    );

    const result = await db_connect
      .collection("requests")
      .insertOne(requestData);

    // Send email to admin
    const adminEmailSubject = `New ${type} Request from ${name}`;
    const adminEmailHtml = createAdminEmailTemplate(type, requestData);
    const adminEmailText = convert(adminEmailHtml, {
      wordwrap: 130,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: adminEmailSubject,
      html: adminEmailHtml,
      text: adminEmailText,
    })
    .then(() => console.log("Admin email sent successfully!"))
    .catch((error) => console.error("Failed to send admin email:", error));

    // Send confirmation email to user if valid email provided
    if (email && isValidEmail(email)) {
      const userEmailSubject = "Request Confirmation";
      const userEmailHtml = createUserEmailTemplate(name, type);
      const userEmailText = convert(userEmailHtml, {
        wordwrap: 130,
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: userEmailSubject,
        html: userEmailHtml,
        text: userEmailText,
      });
    }

    return res.status(201).send({
      status: true,
      message: "Request created and emails sent successfully 😃",
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

exports.getAllRequests = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    const requests = await db_connect
      .collection("requests")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json({ requests });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};

exports.markAsResponded = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    const { id } = req.params;

    const result = await db_connect
      .collection("requests")
      .updateOne({ _id: new ObjectId(id) }, { $set: { responded: true } });

    if (result.modifiedCount === 0) {
      return res.status(404).send({
        status: false,
        message: "Request not found",
      });
    }

    return res.status(200).send({
      status: true,
      message: "Request marked as responded successfully 😃",
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
