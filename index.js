// This API will convert data form csv file into json and uploads the data to Postgresql.
const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const pool = require('./config/Database'); 

app.use(express.json());

app.post('/convert', async (req, res) => {
  try {
    const jsonArray = [];
    const fileContent = fs.readFileSync('../data/test.csv', 'utf8');
    const rows = fileContent.split('\n');
    const fileHeaders = rows[0].split(',');

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(',');
      const obj = {};

      for (let j = 0; j < fileHeaders.length; j++) {
        const keys = fileHeaders[j].split('.');
        let currentObj = obj;

        for (let k = 0; k < keys.length - 1; k++) {
          const key = keys[k];
          if (!currentObj[key]) {
            currentObj[key] = {};
          }
          currentObj = currentObj[key];
        }

        currentObj[keys[keys.length - 1]] = row[j];
      }

      jsonArray.push(obj);
    }

    
    const columnNames = Object.keys(jsonArray[0]);

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS csv_data (
        ${columnNames.map((header) => `${header} TEXT`).join(', ')}
      )
    `;

    await pool.query(createTableQuery);

    
    for (const row of jsonArray) {
      const values = columnNames.map((header) => row[header]);
      const insertQuery = `
        INSERT INTO csv_data
        (${columnNames.join(', ')})
        VALUES
        (${values.map((_, idx) => `$${idx + 1}`).join(', ')})
      `;

      await pool.query(insertQuery, values);
    }

    res.json(jsonArray);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred during conversion or database insertion.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
