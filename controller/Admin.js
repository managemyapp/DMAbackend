const dbo = require("../db/conn");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { convert } = require("html-to-text");
require("dotenv").config();
const { adminEmailTemplate } = require("../util/emailTemplates");

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendAdminCredentials = async (req, res) => {
  let db_connect = dbo.getDb();

  try {
    const admin = await db_connect
      .collection("admin")
      .findOne({ header: "Admin" });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const adminEmailText = convert(adminEmailTemplate, {
      wordwrap: 130,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: "Admin Panel Credentials",
      html: adminEmailTemplate,
      text: adminEmailText,
    });

    res.json({ success: true, message: "Admin credentials sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.adminLogin = async (req, res) => {
  let db_connect = dbo.getDb();

  try {
    const user = await db_connect
      .collection("admin")
      .findOne({ header: "Admin" });

    if (
      !user ||
      user.userName != req.body.userName ||
      user.password != req.body.password
    ) {
      return res.status(401).json({ msg: "Wrong Credentials!" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_ADMIN, {
      expiresIn: "3d",
    });
    res.json({ success: true, token: token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.adminUpdate = async (req, res) => {
  let db_connect = dbo.getDb();

  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res
        .status(400)
        .json({ message: "Username and password required" });
    }

    const updateResult = await db_connect
      .collection("admin")
      .updateOne(
        { header: "Admin" },
        { $set: { userName: userName, password: password } }
      );

    if (updateResult.acknowledged) {
      res.json({ success: true, message: "Credentials updated successfully" });
    } else {
      res.status(500).json({ message: "Failed to update credentials" });
    }
  } catch (error) {
    console.error("Update credentials error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
