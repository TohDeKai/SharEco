const Pool = require("pg").Pool;

// PostgreSQL connection pool configuration
const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// unlock badge
const unlockBadge = async (
  userId,
  badgeType,
  badgeTier,
  badgeProgress
) => {
  try {
    const result = await pool.query(
      `INSERT INTO "sharEco-schema"."achievement" 
        ("userId", "badgeType", "badgeTier", "badgeProgress") 
        values ($1, $2, $3, $4) returning *`,
      [userId, badgeType, badgeTier, badgeProgress]
    );
    return result.rows[0]
  }
  catch (error) {
    throw err;
  }
};

// update badge progress
const updateProgress = async (achievementId, badgeProgress) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."achievement" 
        SET "badgeProgress" = $1 
        WHERE "achievementId" = $2
        RETURNING *`,
      [badgeProgress, achievementId]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// upgrade badge tier
const upgradeBadge = async (achievementId, newBadgeTier) => {
  try {
    const result = await pool.query(
      `UPDATE "sharEco-schema"."achievement" 
        SET "badgeTier" = $1 
        WHERE "achievementId" = $2 
        RETURNING *`,
      [newBadgeTier, achievementId]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Get achievements by userId 
const getAchievementsByUserId = async (userId) => {
  try {
    const result = await pool.query(
      `SELECT * FROM "sharEco-schema"."achievement"
      WHERE "userId" = $1`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  unlockBadge,
  updateProgress,
  upgradeBadge,
  getAchievementsByUserId,
}