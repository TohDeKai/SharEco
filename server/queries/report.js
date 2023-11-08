const Pool = require("pg").Pool;

// PostgreSQL connection pool configuration
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// Get all reports
const getAllReports = async () => {
  try {
    const result = await pool.query(`SELECT * FROM "sharEco-schema"."report"`);
    return result.rows;
  } catch (err) {
    throw err;
  }
};

// Get all reports by TYPE(S)
const getReportsByType = async (type) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."report" 
      WHERE "type" = $1`,
      [type]
    );
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// Create new report
const createReport = async (
  reportType,
  reportStatus,
  reporterId,
  reason,
  description,
  supportingImages,
  responseText,
  responseImages,
  targetId
) => {
  try {
    const result = await pool.query(
      `INSERT INTO "sharEco-schema"."report" 
          ("type", "status", "reporterId", "reason", "description", "supportingImages", "responseText", "responseImages", "targetId") 
            values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`,
      [
        reportType,
        reportStatus,
        reporterId,
        reason,
        description,
        supportingImages,
        responseText,
        responseImages,
        targetId,
      ]
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// Update report with response
const addReportResponse = async (responseText, responseImages, reportId) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."report" 
          SET 
          "responseText" = $1,
          "responseImages" = $2
          WHERE "reportId" = $3
          RETURNING *`,
      [responseText, responseImages, reportId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Update report status
const updateReportStatus = async (reportStatus, reportId) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."report" 
          SET 
          "status" = $1
          WHERE "reportId" = $2
          RETURNING *`,
      [reportStatus, reportId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};

// Update report with supporting images
const updateSupportingImages = async (supportingImages, reportId) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."report" 
          SET 
          "supportingImages" = $1
          WHERE "reportId" = $2
          RETURNING *`,
      [supportingImages, reportId]
    );
    return result.rows[0];
  } catch (err) {
    throw err;
  }
};
module.exports = {
  getAllReports,
  getReportsByType,
  createReport,
  addReportResponse,
  updateReportStatus,
  updateSupportingImages,
};
