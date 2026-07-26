const pool = require("../db/db");

const createShortUrl = async (originalUrl, shortCode) => {
  const result = await pool.query(
    `INSERT INTO urls(original_url, short_code)
     VALUES($1, $2)
     RETURNING *`,
    [originalUrl, shortCode]
  );

  return result.rows[0];
};

const getUrlByCode = async (shortCode) => {
  const result = await pool.query(
    `SELECT * FROM urls
     WHERE short_code = $1`,
    [shortCode]
  );

  return result.rows[0];
};

const getUrlStats = async (shortCode) => {
  const result = await pool.query(
    `SELECT id, original_url, short_code, clicks, created_at
     FROM urls
     WHERE short_code = $1`,
    [shortCode]
  );

  return result.rows[0];
};

const incrementClicks = async (shortCode) => {
  await pool.query(
    `UPDATE urls
     SET clicks = clicks + 1
     WHERE short_code = $1`,
    [shortCode]
  );
};

const getAllUrls = async () => {
  const result = await pool.query(
    `SELECT * FROM urls
     ORDER BY id DESC`
  );

  return result.rows;
};

const deleteUrl = async (shortCode) => {
  const result = await pool.query(
    `DELETE FROM urls
     WHERE short_code = $1
     RETURNING *`,
    [shortCode]
  );

  return result.rows[0];
};

module.exports = {
  createShortUrl,
  getUrlByCode,
  getUrlStats,
  incrementClicks,
  getAllUrls,
  deleteUrl
};