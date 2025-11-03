const express = require("express");
const router = express.Router();

const HomeRoutes = require("../controller/Home");
const AdminRoutes = require("../controller/Admin");
const NewsRoutes = require("../controller/News");
const FooterRoutes = require("../controller/Footer");
const BetaUserRoutes = require("../controller/BetaUser");
const AboutRoutes = require("../controller/About");
const ContactRoutes = require("../controller/Contact");
const RequestRoutes = require("../controller/Request");
const GalleryRoutes = require("../controller/Gallery");
const TeamRoutes = require("../controller/Team");
const BlogRoutes = require("../controller/Blog");
const CommentRoutes = require("../controller/Comment");
const ServiceRoutes = require("../controller/Service");
const FAQRoutes = require("../controller/FAQ");
const brochureController = require("../controller/Brochure");
const requireAdminLogin = require("../middleware/requireAdminLogin");
const testimonialRoutes = require("../controller/Testimonial");
const headerRoutes =  require("../controller/Header")
const founderRoutes = require("../controller/Founder")

// Debug API
router.get("/debug", (_, res) => {
  let data = "😍 !!";
  return res.send({ data: data });
});

// APIs ---

router.post("/createHome", HomeRoutes.createHome);
router.put("/editHome", HomeRoutes.editHome);
router.get("/getHome", HomeRoutes.getHome);
router.get("/testHome", HomeRoutes.testHome);

router.post("/sendAdminCredentials", AdminRoutes.sendAdminCredentials);
router.post("/adminLogin", AdminRoutes.adminLogin);
router.put("/adminUpdate", AdminRoutes.adminUpdate);

router.post("/addBetaUser", BetaUserRoutes.addBetaUser);
router.delete("/editBetaUser", BetaUserRoutes.editBetaUser);
router.get("/getBetaUser", BetaUserRoutes.getBetaUser);

router.post("/addSubscriber", NewsRoutes.addSubscriber);
router.delete("/editSubscriber", NewsRoutes.editSubscriber);
router.get("/getSubscriber", NewsRoutes.getSubscriber);

router.post("/createFooter", FooterRoutes.createFooter);
router.put("/editFooter", FooterRoutes.editFooter);
router.get("/getFooter", FooterRoutes.getFooter);

router.post("/createAbout", AboutRoutes.createAbout);
router.put("/editAbout", AboutRoutes.editAbout);
router.get("/getAbout", AboutRoutes.getAbout);

router.post("/createTeam", TeamRoutes.createTeam);
router.put("/editTeam", TeamRoutes.editTeam);
router.get("/getTeam", TeamRoutes.getTeam);

router.post("/createGallery", GalleryRoutes.createGallery);
router.put("/editGallery", GalleryRoutes.editGallery);
router.get("/getGallery", GalleryRoutes.getGallery);

router.post("/createContact", ContactRoutes.createContact);
router.put("/editContact", ContactRoutes.editContact);
router.get("/getContact", ContactRoutes.getContact);

router.post("/createRequest", RequestRoutes.createRequest);
router.get("/getAllRequests", RequestRoutes.getAllRequests);
router.put("/markResponded/:id", RequestRoutes.markAsResponded);

router.post("/addBlogPage", BlogRoutes.addBlogPage);
router.put("/editBlogPage", BlogRoutes.editBlogPage);
router.get("/getBlogPage", BlogRoutes.getBlogPage);

router.post("/addBlog", BlogRoutes.addBlog);
router.put("/editBlog/:id", BlogRoutes.editBlog);
router.get("/getBlog/:id", BlogRoutes.getBlog);
router.get("/getAllBlogs", BlogRoutes.getAllBlogs);
router.put("/incBlogView/:id", BlogRoutes.incrementViewCount);
router.delete("/deleteBlog/:id", BlogRoutes.deleteBlog);

router.post("/postComment/:blogId", CommentRoutes.postComment);
router.put("/approveComment/:commentId", CommentRoutes.approveComment);
router.get("/getApprovedComments/:blogId", CommentRoutes.getApprovedComments);
router.get("/getPendingComments", CommentRoutes.getPendingComments);
router.delete("/deleteComment/:commentId", CommentRoutes.deleteComment);

router.post("/createServicePage", ServiceRoutes.createServicePage);
router.put("/editServicePage", ServiceRoutes.editServicePage);
router.get("/getServicePage", ServiceRoutes.getServicePage);
router.get("/getServiceList", ServiceRoutes.getServiceList);

router.post("/createMainService", ServiceRoutes.createMainService);
router.put("/editMainService/:id", ServiceRoutes.editMainService);
router.get("/getMainService/:id", ServiceRoutes.getMainService);
router.delete("/deleteMainService/:id", ServiceRoutes.deleteMainService);

router.post("/createSubService", ServiceRoutes.createSubService);
router.put("/editSubService/:id", ServiceRoutes.editSubService);
router.get("/getMainService/:id", ServiceRoutes.getMainService); 
router.get("/getServiceList", ServiceRoutes.getServiceList); 

router.get("/getSubService/:id", ServiceRoutes.getSubService);
router.delete("/deleteSubService/:id", ServiceRoutes.deleteSubService);

router.post("/createFaq", FAQRoutes.createFaq);
router.put("/editFaq", FAQRoutes.editFaq);
router.get("/getFaq", FAQRoutes.getFaq);

router.post("/createBrochure", brochureController.createBrochure);
router.put("/editBrochure", brochureController.editBrochure);
router.get("/getBrochure", brochureController.getBrochure);

router.post("/createTestimonial",testimonialRoutes.createTestimonial)
router.put("/editTestimonial",testimonialRoutes.editTestimonial)
router.get("/getTestimonial",testimonialRoutes.getTestimonial)

router.post("/createHeader",headerRoutes.createHeader)
router.put("/editHeader",headerRoutes.editHeader)
router.get("/getHeader",headerRoutes.getHeader)

router.post("/createFounder",founderRoutes.createFounder)
router.put("/editFounder",founderRoutes.EditFounder)
router.get("/getFounder",founderRoutes.getFounder)

module.exports = router;
