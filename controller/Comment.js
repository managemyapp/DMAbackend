require("dotenv").config();
const dbo = require("../db/conn");
const { ObjectId } = require("mongodb");

exports.postComment = async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    const blogId = req.params.blogId;
    const { parentCommentId, name, email, content } = req.body;

    // Create the new comment or reply
    const comment = {
      _id: new ObjectId(),
      blogId: new ObjectId(blogId),
      name,
      email,
      content,
      approved: false,
      createdAt: new Date(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      replies: []
    };

    if (parentCommentId) {
      const parentCommentObjectId = new ObjectId(parentCommentId);

      // Function to find and update the nested comment
      const findAndUpdateNestedComment = async (comments, parentId, reply) => {
        for (let comment of comments) {
          if (comment._id.equals(parentId)) {
            if (!comment.approved) {
              return res.status(400).json({
                status: false,
                message: "Cannot reply to an unapproved comment",
              });
            }
            comment.replies.push(reply);
            return comments;
          } else if (comment.replies && comment.replies.length > 0) {
            let updatedReplies = await findAndUpdateNestedComment(comment.replies, parentId, reply);
            if (updatedReplies) {
              comment.replies = updatedReplies;
              return comments;
            }
          }
        }
        return null;
      };

      let parentComment = await db_connect.collection("comments").findOne({ _id: parentCommentObjectId });

      if (!parentComment) {
        return res.status(404).json({
          status: false,
          message: "Parent comment not found",
        });
      }

      let updatedComments = await findAndUpdateNestedComment([parentComment], parentCommentObjectId, comment);

      if (!updatedComments) {
        return res.status(404).json({
          status: false,
          message: "Parent comment not found",
        });
      }

      // Update the parent comment in the database
      await db_connect.collection("comments").updateOne(
        { _id: parentCommentObjectId },
        { $set: { replies: updatedComments[0].replies } }
      );

    } else {
      // Insert new top-level comment
      await db_connect.collection("comments").insertOne(comment);
    }

    return res.status(201).json({
      status: true,
      message: "Comment posted successfully 😃",
      commentId: comment._id
    });
  } catch (err) {
    console.error("Error posting comment:", err);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};


exports.getApprovedComments = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    const blogId = new ObjectId(req.params.blogId);
    const { limit, page } = req.query;

    const filterApproved = (comments) => {
      return comments
        .filter((comment) => comment.approved)
        .map((comment) => ({
          ...comment,
          replies: filterApproved(comment.replies || []),
        }));
    };

    const comments = await db_connect
      .collection("comments")
      .find({ blogId: blogId, approved: true })
      .sort({ createdAt: -1 })
      .toArray();

    const approvedComments = filterApproved(comments);
    const totalComments = approvedComments.length;

    let response = {
      comments: approvedComments,
      totalComments,
    };

    if (limit && page) {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const paginatedComments = approvedComments.slice(
        skip,
        skip + parseInt(limit)
      );
      response.comments = paginatedComments;
      response.currentPage = parseInt(page);
      response.totalPages = Math.ceil(totalComments / parseInt(limit));
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

exports.getPendingComments = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    const comments = await db_connect
      .collection("comments")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const collectUnapproved = (comments, result = []) => {
      comments.forEach((comment) => {
        if (!comment.approved) {
          result.push(comment);
        }
        if (comment.replies && comment.replies.length > 0) {
          collectUnapproved(comment.replies, result);
        }
      });
      return result;
    };

    const pendingComments = collectUnapproved(comments);

    return res.json({ comments: pendingComments });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};

exports.approveComment = async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    const commentId = new ObjectId(req.params.commentId);

    // First, try to find and update a top-level comment
    let result = await db_connect
      .collection("comments")
      .findOneAndUpdate(
        { _id: commentId },
        { $set: { approved: true } },
        { returnDocument: "after" }
      );

    if (result) {
      return res.status(200).json({
        status: true,
        message: "Comment approved successfully 😃",
      });
    }

    // If not found, search for the comment containing the reply
    result = await db_connect
      .collection("comments")
      .findOneAndUpdate(
        { "replies._id": commentId },
        { $set: { "replies.$.approved": true } },
        { returnDocument: "after" }
      );

    if (result) {
      return res.status(200).json({
        status: true,
        message: "Reply approved successfully 😃",
      });
    }

    // If still not found, return an error
    return res.status(404).json({
      status: false,
      message: "Comment or reply not found",
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    const commentId = new ObjectId(req.params.commentId);

    // Function to recursively delete a comment and its replies
    const deleteCommentAndReplies = async (commentId) => {
      const comment = await db_connect.collection("comments").findOne({ _id: commentId });
      
      if (comment) {
        // Delete the comment
        await db_connect.collection("comments").deleteOne({ _id: commentId });
        return true;
      }

      // If not found as a top-level comment, search in replies
      const parentComment = await db_connect.collection("comments").findOne({ "replies._id": commentId });
      
      if (parentComment) {
        // Remove the reply from the parent comment
        await db_connect.collection("comments").updateOne(
          { _id: parentComment._id },
          { $pull: { replies: { _id: commentId } } }
        );
        return true;
      }

      return false;
    };

    const deleted = await deleteCommentAndReplies(commentId);

    if (deleted) {
      return res.status(200).json({
        status: true,
        message: "Comment or reply deleted successfully 😃",
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "Comment or reply not found",
      });
    }
  } catch (err) {
    console.error("Error deleting comment:", err);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};