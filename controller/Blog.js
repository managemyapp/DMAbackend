require("dotenv").config();
const { response } = require("express");
const dbo = require("../db/conn");
const { ObjectId } = require("mongodb");

exports.addBlogPage = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    let blogPageData = {
      dataType: "blogPage",
      hero: {
        tag: req.body?.hero?.tag ?? "",
        heading: req.body?.hero?.heading ?? "",
        description: req.body?.hero?.description ?? "",
        image: req.body?.hero?.image ?? "",
      },
      category: req.body?.category ?? [],
      tags: req.body?.tags ?? [], // New field
    };

    const result = await db_connect
      .collection("blogPage")
      .insertOne(blogPageData);

    return res.status(201).send({
      status: true,
      message: "Blog page data created successfully 😃",
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

// exports.editBlogPage = async (req, res) => {
//   try {
//     let db_connect = dbo.getDb();

//     let updateFields = {};
//     const fields = ["hero", "category", "tags"];

//     fields.forEach((field) => {
//       if (req.body[field]) {
//         updateFields[field] = req.body[field];
//       }
//     });

//     const result = await db_connect
//       .collection("blogPage")
//       .updateOne({ dataType: "blogPage" }, { $set: updateFields });

//     return res.status(200).send({
//       status: true,
//       message: "Blog page data updated successfully 😃",
//       result,
//     });
//   } catch (err) {
//     return res.status(500).send({
//       status: false,
//       message: "Internal Server Error!",
//       error: err.message,
//     });
//   }
// };

exports.editBlogPage = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    let updateFields = {};
    const fields = ["hero", "category", "tags"];

    fields.forEach((field) => {
      if (req.body[field]) {
        updateFields[field] = req.body[field];
      }
    });

    const blogPageData = await db_connect
      .collection("blogPage")
      .findOne({ dataType: "blogPage" });

    // Handle category changes
    if (req.body.category) {
      const newCategories = req.body.category;
      const oldCategories = blogPageData.category;

      const removedCategories = oldCategories.filter(
        (cat) => !newCategories.includes(cat)
      );
      const renamedCategories = newCategories.filter(
        (cat) =>
          oldCategories.includes(cat) &&
          cat !== oldCategories[oldCategories.indexOf(cat)]
      );

      // Remove blogs associated with removed categories
      if (removedCategories.length > 0) {
        await db_connect
          .collection("blogs")
          .deleteMany({ category: { $in: removedCategories } });
      }

      // Update category name in blogs
      for (let oldCategory of oldCategories) {
        if (!newCategories.includes(oldCategory)) {
          const newCategory = newCategories[oldCategories.indexOf(oldCategory)];
          await db_connect
            .collection("blogs")
            .updateMany(
              { category: oldCategory },
              { $set: { category: newCategory } }
            );
        }
      }
    }

    // Handle tag removal
    if (req.body.tags) {
      const newTags = req.body.tags;
      const oldTags = blogPageData.tags;
      const removedTags = oldTags.filter((tag) => !newTags.includes(tag));

      // Remove tags from blogPage
      updateFields.tags = newTags;

      // Remove tags from blogs
      if (removedTags.length > 0) {
        await db_connect
          .collection("blogs")
          .updateMany(
            { tags: { $in: removedTags } },
            { $pull: { tags: { $in: removedTags } } }
          );
      }
    }

    const result = await db_connect
      .collection("blogPage")
      .updateOne({ dataType: "blogPage" }, { $set: updateFields });

    return res.status(200).send({
      status: true,
      message: "Blog page data updated successfully 😃",
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

exports.getBlogPage = async (req, res) => {
  let db_connect = dbo.getDb();
  try {
    const blogPageData = await db_connect
      .collection("blogPage")
      .findOne({ dataType: "blogPage" });

    return res.json({ blogPageData });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};

exports.addBlog = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    let blogData = {
      hero: {
        heading: req.body?.hero?.heading ?? "",
        description: req.body?.hero?.description ?? "",
        image: req.body?.hero?.image ?? "",
      },
      coverimage: req.body?.coverimage ?? "",
      title: req.body?.title ?? "",
      author: req.body?.author ?? "",
      // summary: req.body?.summary ?? "",

      createdAt: new Date(), // Store the current timestamp
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }), // Keep the formatted date for display purposes
      layout: req.body?.layout ?? [],
      tags: req.body?.tags ?? [],
      category: req.body?.category ?? "",
      views: 0, // Initialize view count
      pdfdata: req.body.pdfdata,

    };

    const result = await db_connect.collection("blogs").insertOne(blogData);

    // Append tags to blogPage data
    await db_connect
      .collection("blogPage")
      .updateOne(
        { dataType: "blogPage" },
        { $addToSet: { tags: { $each: blogData.tags } } }
      );

    return res.status(201).send({
      status: true,
      message: "Blog created successfully 😃",
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

// exports.editBlog = async (req, res) => {
//   try {
//     let db_connect = dbo.getDb();

//     const blogId = req.params.id;
//     if (!ObjectId.isValid(blogId)) {
//       return res.status(400).send({
//         status: false,
//         message: "Invalid blog ID!",
//       });
//     }

//     let updateFields = {};
//     const fields = [
//       "hero",
//       "coverimage",
//       "title",
//       "author",
// "summary",
//       "layout",
//       "tags",
//       "category",
//     ];

//     fields.forEach((field) => {
//       if (req.body[field]) {
//         updateFields[field] = req.body[field];
//       }
//     });

//     const result = await db_connect
//       .collection("blogs")
//       .updateOne({ _id: new ObjectId(blogId) }, { $set: updateFields });

//     if (result.matchedCount === 0) {
//       return res.status(404).send({
//         status: false,
//         message: "Blog not found!",
//       });
//     }

//     return res.status(200).send({
//       status: true,
//       message: "Blog updated successfully 😃",
//       result,
//     });
//   } catch (err) {
//     return res.status(500).send({
//       status: false,
//       message: "Internal Server Error!",
//       error: err.message,
//     });
//   }
// };

exports.editBlog = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    const blogId = req.params.id;
    if (!ObjectId.isValid(blogId)) {
      return res.status(400).send({
        status: false,
        message: "Invalid blog ID!",
      });
    }

    let updateFields = {};
    const fields = [
      "hero",
      "coverimage",
      "title",
      "author",
      // "summary",
      "layout",
      "tags",
      "category",
      "pdfdata",
    ];

    fields.forEach((field) => {
      if (req.body[field]) {
        updateFields[field] = req.body[field];
      }
    });

    const result = await db_connect
      .collection("blogs")
      .updateOne({ _id: new ObjectId(blogId) }, { $set: updateFields });

    if (result.matchedCount === 0) {
      return res.status(404).send({
        status: false,
        message: "Blog not found!",
      });
    }

    // Add new tags to blogPage data
    if (req.body.tags) {
      const newTags = req.body.tags;
      const blogPageData = await db_connect
        .collection("blogPage")
        .findOne({ dataType: "blogPage" });

      const existingTags = blogPageData.tags || [];
      const tagsToAdd = newTags.filter(tag => !existingTags.includes(tag));

      if (tagsToAdd.length > 0) {
        await db_connect.collection("blogPage").updateOne(
          { dataType: "blogPage" },
          { $addToSet: { tags: { $each: tagsToAdd } } }
        );
      }
    }

    return res.status(200).send({
      status: true,
      message: "Blog updated successfully 😃",
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

exports.incrementViewCount = async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    const blogId = req.params.id;

    if (!ObjectId.isValid(blogId)) {
      return res.status(400).send({
        status: false,
        message: "Invalid blog ID!",
      });
    }

    const result = await db_connect
      .collection("blogs")
      .updateOne({ _id: new ObjectId(blogId) }, { $inc: { views: 1 } });

    if (result.matchedCount === 0) {
      return res.status(404).send({
        status: false,
        message: "Blog not found!",
      });
    }

    return res.status(200).send({
      status: true,
      message: "View count incremented successfully 😃",
    });
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};

exports.getBlog = async (req, res) => {
  let db_connect = dbo.getDb();
  try {
    const blogId = req.params.id;
    if (!ObjectId.isValid(blogId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid blog ID!",
      });
    }

    // Fetch all blogs sorted by createdAt in ascending order
    const allBlogs = await db_connect
      .collection("blogs")
      .find({}, { projection: { _id: 1, title: 1, createdAt: 1 } })
      .sort({ createdAt: 1 }) // Ascending order: older blogs first
      .toArray();

    // Find the index of the current blog
    const currentIndex = allBlogs.findIndex(
      (blog) => blog._id.toString() === blogId
    );

    if (currentIndex === -1) {
      return res.status(404).json({
        status: false,
        message: "Blog not found!",
      });
    }

    // Get the full blog data
    const blogData = await db_connect
      .collection("blogs")
      .findOne({ _id: new ObjectId(blogId) });

    const blogPageData = await db_connect
      .collection("blogPage")
      .findOne({ dataType: "blogPage" });

    if (blogPageData) {
      blogData.hero.tag = blogPageData.hero.tag;
    }

    // Count approved comments
    const commentCount = await db_connect
      .collection("comments")
      .aggregate([
        { $match: { blogId: new ObjectId(blogId) } },
        {
          $project: {
            approvedCount: {
              $add: [
                { $cond: ["$approved", 1, 0] },
                {
                  $size: {
                    $filter: {
                      input: "$replies",
                      as: "reply",
                      cond: "$$reply.approved",
                    },
                  },
                },
              ],
            },
          },
        },
        { $group: { _id: null, totalApproved: { $sum: "$approvedCount" } } },
      ])
      .toArray();

    blogData.comments =
      commentCount.length > 0 ? commentCount[0].totalApproved : 0;

    // Determine previous and next blogs
    const previousBlog = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
    const nextBlog =
      currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;

    const response = {
      blogData,
      previous: previousBlog
        ? { id: previousBlog._id, title: previousBlog.title }
        : null,
      next: nextBlog ? { id: nextBlog._id, title: nextBlog.title } : null,
    };

    return res.json(response);
  } catch (error) {
    console.error("Main error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};

exports.getAllBlogs = async (req, res) => {
  let db_connect = dbo.getDb();
  try {
    const { category, tag, search, limit, page } = req.query;
    let filter = {};
    if (category) {
      filter.category = category;
    }
    if (tag) {
      filter.tags = tag;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        // { summary: { $regex: search, $options: "i" } },
        { "layout.story": { $regex: search, $options: "i" } },
        { "layout.note": { $regex: search, $options: "i" } },
      ];
    }

    let aggregationPipeline = [
      { $match: filter },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "blogId",
          as: "comments",
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          coverimage: 1,
          date: 1,
          author: 1,
          summary:1,
          views: 1,
          layout: 1,
          category: 1, // Include category field
          tags: 1,
          pdfdata:1, // Include tags field
          comments: {
            $reduce: {
              input: "$comments",
              initialValue: 0,
              in: {
                $add: [
                  "$$value",
                  { $cond: ["$$this.approved", 1, 0] },
                  {
                    $size: {
                      $filter: {
                        input: "$$this.replies",
                        as: "reply",
                        cond: "$$reply.approved",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      { $sort: { date: -1 } },
    ];

    if (limit && page) {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      aggregationPipeline.push({ $skip: skip });
      aggregationPipeline.push({ $limit: parseInt(limit) });
    }

    const [blogs, totalCount] = await Promise.all([
      db_connect
        .collection("blogs")
        .aggregate(aggregationPipeline)
        .toArray(),
      db_connect.collection("blogs").countDocuments(filter),
    ]);

    let response = {
      blogs,
      totalCount,
    };

    if (limit && page) {
      response.currentPage = parseInt(page);
      response.totalPages = Math.ceil(totalCount / parseInt(limit));
    }

    return res.json(response);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};

// exports.getAllBlogs = async (req, res) => {
//   let db_connect = dbo.getDb();
//   try {
//     const { category, tag, search, limit, page } = req.query;
//     let filter = {};
//     if (category) {
//       filter.category = category;
//     }
//     if (tag) {
//       filter.tags = tag;
//     }
//     if (search) {
//       filter.$or = [
//         { title: { $regex: search, $options: "i" } },
//         { author: { $regex: search, $options: "i" } },
//          { summary: { $regex: search, $options: "i" } },
//         { "layout.story": { $regex: search, $options: "i" } },
//         { "layout.note": { $regex: search, $options: "i" } },
//       ];
//     }

//     let aggregationPipeline = [
//       { $match: filter },
//       {
//         $lookup: {
//           from: "comments",
//           localField: "_id",
//           foreignField: "blogId",
//           as: "comments",
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           title: 1,
//           coverimage: 1,
//           date: 1,
//           author: 1,
//           summary:1,
//           views: 1,
//           layout: 1,
//           comments: {
//             $reduce: {
//               input: "$comments",
//               initialValue: 0,
//               in: {
//                 $add: [
//                   "$$value",
//                   { $cond: ["$$this.approved", 1, 0] },
//                   {
//                     $size: {
//                       $filter: {
//                         input: "$$this.replies",
//                         as: "reply",
//                         cond: "$$reply.approved",
//                       },
//                     },
//                   },
//                 ],
//               },
//             },
//           },
//         },
//       },
//       { $sort: { date: -1 } },
//     ];

//     if (limit && page) {
//       const skip = (parseInt(page) - 1) * parseInt(limit);
//       aggregationPipeline.push({ $skip: skip });
//       aggregationPipeline.push({ $limit: parseInt(limit) });
//     }

//     const [blogs, totalCount] = await Promise.all([
//       db_connect.collection("blogs").aggregate(aggregationPipeline).toArray(),
//       db_connect.collection("blogs").countDocuments(filter),
//     ]);

//     let response = {
//       blogs,
//       totalCount,
//     };

//     if (limit && page) {
//       response.currentPage = parseInt(page);
//       response.totalPages = Math.ceil(totalCount / parseInt(limit));
//     }

//     return res.json(response);
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: "Internal Server Error!",
//       error: error.message,
//     });
//   }
// };

exports.deleteBlog = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    const blogId = req.params.id;
    if (!ObjectId.isValid(blogId)) {
      return res.status(400).send({
        status: false,
        message: "Invalid blog ID!",
      });
    }

    // Delete the blog
    const result = await db_connect
      .collection("blogs")
      .deleteOne({ _id: new ObjectId(blogId) });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        status: false,
        message: "Blog not found!",
      });
    }

    // Optional: Clean up related comments if you have a comments collection
    await db_connect
      .collection("comments")
      .deleteMany({ blogId: new ObjectId(blogId) });

    // Optional: Update tags in blogPage if you want to remove unused tags
    const remainingBlogs = await db_connect.collection("blogs").find().toArray();
    const remainingTags = new Set(
      remainingBlogs.flatMap(blog => blog.tags || [])
    );

    const blogPageData = await db_connect
      .collection("blogPage")
      .findOne({ dataType: "blogPage" });

    if (blogPageData && blogPageData.tags) {
      const tagsToRemove = blogPageData.tags.filter(
        tag => !remainingTags.has(tag)
      );

      if (tagsToRemove.length > 0) {
        await db_connect.collection("blogPage").updateOne(
          { dataType: "blogPage" },
          { $pull: { tags: { $in: tagsToRemove } } }
        );
      }
    }

    return res.status(200).send({
      status: true,
      message: "Blog deleted successfully 😃",
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