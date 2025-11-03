require("dotenv").config();
const dbo = require("../db/conn");
const { ObjectId } = require('mongodb');

// Service Page CRUD operations
exports.createServicePage = async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    let servicePageData = {
      dataType: "servicePage",
      hero: {
        tag: req.body?.hero?.tag ?? "",
        heading: req.body?.hero?.heading ?? "",
        description: req.body?.hero?.description ?? "",
        image: req.body?.hero?.image ?? "",
      },
      coverimage: req.body?.coverimage ?? "",
      title: req.body?.title ?? "",
      description: req.body?.description ?? "",
    };

    const result = await db_connect.collection("servicepage").insertOne(servicePageData);

    return res.status(201).send({
      status: true,
      message: "Service page data created successfully 😃",
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

exports.editServicePage = async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    let updateFields = {};
    const fields = ["hero", "coverimage", "title", "description"];

    fields.forEach((field) => {
      if (req.body[field]) {
        updateFields[field] = req.body[field];
      }
    });

    const result = await db_connect
      .collection("servicepage")
      .updateOne({ dataType: "servicePage" }, { $set: updateFields });

    return res.status(200).send({
      status: true,
      message: "Service page data updated successfully 😃",
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

exports.getServicePage = async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    const servicePageData = await db_connect
      .collection("servicepage")
      .findOne({ dataType: "servicePage" });

    return res.json({ servicePageData });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};

// Service List operations
exports.getServiceList = async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    const serviceList = await db_connect
      .collection("servicelist")
      .findOne({ dataType: "serviceList" });

    return res.json({ serviceList: serviceList?.serviceList || [] });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};

// Main Service CRUD operations
exports.createMainService = async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    let mainServiceData = {
      serviceType: "main",
      hero: req.body.hero,
      title: req.body.title,
      coverimage: req.body.coverimage,
      layout: req.body.layout,
      faqdata: req.body.faqdata,
      pdfdata: req.body.pdfdata,

    };

    const result = await db_connect.collection("service").insertOne(mainServiceData);

    // Update serviceList
    await db_connect.collection("servicelist").updateOne(
      { dataType: "serviceList" },
      {
        $push: {
          serviceList: {
            _id: result.insertedId,
            title: req.body.title,
            coverimage: req.body.coverimage,
            description: req.body.hero.description,
            subService: [],
          },
        },
      },
      { upsert: true }
    );

    return res.status(201).send({
      status: true,
      message: "Main service created successfully 😃",
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

exports.editMainService = async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    const { id } = req.params;
    let updateFields = req.body;
    delete updateFields._id;

    const result = await db_connect
      .collection("service")
      .updateOne({ _id: new ObjectId(id), serviceType: "main" }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return res.status(404).send({
        status: false,
        message: "Main service not found",
      });
    }

    // Update serviceList
    if (updateFields.title || updateFields.coverimage || updateFields.hero?.description) {
      await db_connect.collection("servicelist").updateOne(
        { "serviceList._id": new ObjectId(id) },
        {
          $set: {
            "serviceList.$.title": updateFields.title,
            "serviceList.$.coverimage": updateFields.coverimage,
            "serviceList.$.description": updateFields.hero?.description,
          },
        }
      );
    }

    return res.status(200).send({
      status: true,
      message: "Main service updated successfully 😃",
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

// Sub Service CRUD operations
exports.createSubService = async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    let subServiceData = {
      serviceType: "sub",
      mainServiceId: new ObjectId(req.body.mainServiceId),
      hero: req.body.hero,
      title: req.body.title,
      layout: req.body.layout,
      faqdata: req.body.faqdata,
      pdfdata: req.body.pdfdata,
      rightsection:req.body.rightsection,

    };

    const result = await db_connect.collection("service").insertOne(subServiceData);

    // Update serviceList
    await db_connect.collection("servicelist").updateOne(
      { "serviceList._id": new ObjectId(req.body.mainServiceId) },
      {
        $push: {
          "serviceList.$.subService": {
            _id: result.insertedId,
            title: req.body.title,
          },
        },
      }
    );

    return res.status(201).send({
      status: true,
      message: "Sub service created successfully 😃",
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

exports.editSubService = async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    const { id } = req.params;

    let updateFields = req.body;
    delete updateFields._id;

    const result = await db_connect
      .collection("service")
      .updateOne({ _id: new ObjectId(id), serviceType: "sub" }, { $set:{ ...updateFields} });

    if (result.matchedCount === 0) {
      return res.status(404).send({
        status: false,
        message: "Sub service not found",
      });
    }

    // Update serviceList if title changed
    if (updateFields.title) {
      await db_connect.collection("servicelist").updateOne(
        { "serviceList.subService._id": new ObjectId(id) },
        { $set: { "serviceList.$[].subService.$[sub].title": updateFields.title } },
        { arrayFilters: [{ "sub._id": new ObjectId(id) }] }
      );
    }

    return res.status(200).send({
      status: true,
      message: "Sub service updated successfully 😃",
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

exports.getMainService = async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    const { id } = req.params;
    const mainService = await db_connect
      .collection("service")
      .findOne({ _id: new ObjectId(id), serviceType: "main" });

    return res.json({ mainService });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};

exports.getSubService = async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    const { id } = req.params;
    const subService = await db_connect
      .collection("service")
      .findOne({ _id: new ObjectId(id), serviceType: "sub" });

    return res.json({ subService });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};

exports.deleteMainService = async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    const { id } = req.params;

    // Delete the main service
    const result = await db_connect
      .collection("service")
      .deleteOne({ _id: new ObjectId(id), serviceType: "main" });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        status: false,
        message: "Main service not found",
      });
    }

    // Remove from serviceList
    await db_connect.collection("servicelist").updateOne(
      { dataType: "serviceList" },
      { $pull: { serviceList: { _id: new ObjectId(id) } } }
    );

    // Delete all associated subServices from service collection
    await db_connect.collection("service").deleteMany({ mainServiceId: new ObjectId(id) });

    return res.status(200).send({
      status: true,
      message: "Main service and associated sub-services deleted successfully 😃",
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

exports.deleteSubService = async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    const { id } = req.params;

    // Find the sub-service to get its mainServiceId
    const subService = await db_connect
      .collection("service")
      .findOne({ _id: new ObjectId(id), serviceType: "sub" });

    if (!subService) {
      return res.status(404).send({
        status: false,
        message: "Sub service not found",
      });
    }

    // Delete the sub-service
    const result = await db_connect
      .collection("service")
      .deleteOne({ _id: new ObjectId(id), serviceType: "sub" });

    // Remove from serviceList
    await db_connect.collection("servicelist").updateOne(
      { "serviceList._id": subService.mainServiceId },
      { $pull: { "serviceList.$.subService": { _id: new ObjectId(id) } } }
    );

    return res.status(200).send({
      status: true,
      message: "Sub service deleted successfully 😃",
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