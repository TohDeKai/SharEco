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
  responseImages
) => {
  try {
    const result = await pool.query(
      `INSERT INTO "sharEco-schema"."report" 
          ("type", "status", "reporterId", "reason", "description", "supportingImages", "responseText", "responseImages") 
            values ($1, $2, $3, $4, $5, $6, $7, $8) returning *`,
      [
        reportType,
        reportStatus,
        reporterId,
        reason,
        description,
        supportingImages,
        responseText,
        responseImages,
      ]
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// Update report with response

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

module.exports = {
  getAllReports,
  getReportsByType,
  createReport,
  updateReportStatus,
};
