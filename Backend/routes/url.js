const express = require("express");

const {
  generateUrl,
  redirectUrl,
  getStats,
  deleteShortUrl,
  getUrls
} = require("../controllers/urlcontroller");

const router = express.Router();

// router.get("/", (req, res) => {
//   res.send("URL route working");
// });

router.get("/", getUrls);

router.post("/shorten", generateUrl);

router.get("/stats/:shortCode", getStats);

router.get("/:shortCode", redirectUrl);


router.delete("/:shortCode", deleteShortUrl );

module.exports = router;