const { Pool } = require('pg');
const pool = require('./config/Database');

async function calculateAgeDistribution() {
  try {
    const query = `
      SELECT
        CASE
          WHEN age::text < '20' THEN '< 20'
          WHEN age::text >= '20' AND age::text <= '40' THEN '20 to 40'
          WHEN age::text > '40' AND age::text <= '60' THEN '40 to 60'
          ELSE '> 60'
        END AS age_group,
        COUNT(*) AS count
      FROM public.csv_data
      WHERE age IS NOT NULL
      GROUP BY age_group
    `;

    const result = await pool.query(query);

    let totalCount = 0;

    result.rows.forEach((row) => {
      const countAsInteger = parseInt(row.count, 10);
      totalCount += countAsInteger;
    });

    console.log('Total Count:', totalCount);
    console.log('Age-Group % Distribution');

    result.rows.forEach((row) => {
      const percentage = ((row.count / totalCount) * 100).toFixed(2);
      console.log(`${row.age_group} ${percentage}%`);
    });

    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

calculateAgeDistribution();
