const healthCheck = async (req, res) => {
  return res.status(200).json({
    status: "OK",
    message: "URL Shortener API is running"
  });
};

module.exports = {
  healthCheck
};