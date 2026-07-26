const { nanoid } = require("nanoid");

const {
  createShortUrl,
  getUrlByCode,
  getUrlStats,
  incrementClicks,
  deleteUrl,
  getAllUrls
} = require("../models/urlModels");


const generateUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        message: "originalUrl is required"
      });
    }

    const shortCode = nanoid(8);

    const url = await createShortUrl(
      originalUrl,
      shortCode
    );

    return res.status(201).json({
      message: "Short URL created successfully",
      data: url
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await getUrlByCode(shortCode);

    if (!url) {
      return res.status(404).json({
        message: "Short URL not found"
      });
    }

    await incrementClicks(shortCode);

    return res.redirect(url.original_url);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

const getStats = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await getUrlStats(shortCode);

    if (!url) {
      return res.status(404).json({
        message: "Short URL not found"
      });
    }

    return res.status(200).json({
      message: "URL statistics fetched successfully",
      data: url
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

const deleteShortUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const deletedUrl = await deleteUrl(shortCode);

    if (!deletedUrl) {
      return res.status(404).json({
        message: "Short URL not found"
      });
    }

    return res.status(200).json({
      message: "Short URL deleted successfully",
      data: deletedUrl
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

async function getUrls(req, res) {
  try {
    const urls = await getAllUrls();

    res.status(200).json({
      message: "URLs fetched successfully",
      data: urls
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
}

module.exports = {
  generateUrl,
  redirectUrl,
  getStats,
  deleteShortUrl,
  getUrls
};