require("dotenv").config();
const dbo = require("../db/conn");

exports.createHome = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    let homeData = {
      dataType: "home",
      hero: {
        heading: req.body.hero?.heading ?? "",
        description: req.body.hero?.description ?? "",
        image: req.body.hero?.image ?? "",
        default: req.body.hero?.default ?? false,
      },
      client: {
        heading: req.body.client?.heading ?? "",
        image: req.body.client?.image ?? [""],
        default: req.body.client?.default ?? false,
      },
      service: {
        heading: req.body.service?.heading ?? "",
        description: req.body.service?.description ?? "",
        all: req.body.service?.all ?? false,
        selected: req.body.service?.selected ?? [0],
        default: req.body.service?.default ?? false,
      },
      blog: {
        heading: req.body.blog?.heading ?? "",
        description: req.body.blog?.description ?? "",
        all: req.body.blog?.all ?? false,
        selected: req.body.blog?.selected ?? [0],
        default: req.body.blog?.default ?? false,
      },
      reason: {
        heading: req.body.reason?.heading ?? "",
        description: req.body.reason?.description ?? "",
        cards: req.body.reason?.cards ?? [{ logo: "", tag: "", value: "" }],
        default: req.body.reason?.default ?? false,
      },
      about: {
        heading: req.body.about?.heading ?? "",
        subheading: req.body.about?.subheading ?? "",
        description: req.body.about?.description ?? ["", ""],
        link: req.body.about?.link ?? "",
        image: req.body.about?.image ?? "",
        default: req.body.about?.default ?? false,
      },
      gallery: {
        heading: req.body.gallery?.heading ?? "",
        description: req.body.gallery?.description ?? "",
        video: req.body.gallery?.video ?? "",
        extra: {
          heading: req.body.gallery?.extra?.heading ?? "",
          description: req.body.gallery?.extra?.description ?? "",
          cards: req.body.gallery?.extra?.cards ?? [
            { logo: "", heading: "", description: "" },
          ],
        },
        default: req.body.gallery?.default ?? false,
      },
      reviews: {
        heading: req.body.reviews?.heading ?? "",
        description: req.body.reviews?.description ?? "",
        all: req.body.reviews?.all ?? false,
        selected: req.body.reviews?.selected ?? [0],
        default: req.body.reviews?.default ?? false,
      },
    };

    const result = await db_connect.collection("home").insertOne(homeData);

    return res.status(201).send({
      status: true,
      message: "Home data created successfully 😃",
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

exports.editHome = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    let updateFields = {};
    const sections = ['hero', 'client', 'service', 'blog', 'reason', 'about', 'gallery', 'reviews'];

    sections.forEach((section) => {
      if (req.body[section]) {
        updateFields[`${section}`] = req.body[section];
      }
    });

    const result = await db_connect.collection("home").updateOne(
      { dataType: "home" },
      { $set: updateFields }
    );

    return res.status(200).send({
      status: true,
      message: "Home data updated successfully 😃",
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

exports.getHome = async (req, res) => {
  let db_connect = dbo.getDb();
  try {
    // Fetch home data
    const homeData = await db_connect
      .collection("home")
      .findOne({ dataType: "home" });

    // Fetch service list data
    const serviceListData = await db_connect
      .collection("servicelist")
      .findOne({ dataType: "serviceList" });

    // Remove subService from each service list item
    if (serviceListData?.serviceList) {
      serviceListData.serviceList.forEach(service => {
        delete service.subService;
      });
    }

    // Fetch all blogs
    const blogs = await db_connect
      .collection("blogs")
      .find({})
      .toArray();

    // Format blog data to include only the specified fields
    const blogList = blogs.map(blog => ({
      _id: blog._id,
      coverimage: blog.coverimage,
      title: blog.title,
      category: blog.category,
      firstStory: blog.layout.find(item => item.story)?.story || ""
    }));

    // Add serviceList to homeData
    if (homeData) {
      homeData.service = {
        ...homeData.service,
        list: serviceListData?.serviceList || []
      };

      homeData.blog.list = blogList;
    }

    return res.json({ homeData });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};

exports.testHome = async (req, res) => {
  let db_connect = dbo.getDb();
  return res.json({ test: db_connect ? "Connected" : "Not Connected" });
};