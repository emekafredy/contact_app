import log from 'fancy-log';
import pool from './config';

const createUserTable = `
  CREATE TABLE IF NOT EXISTS Users (
    id serial PRIMARY KEY,
    name VARCHAR (50) NOT NULL,
    email VARCHAR (75) NOT NULL UNIQUE,
    password VARCHAR (150) NOT NULL,
    phone VARCHAR (15) NOT NULL,
    createdAt date NOT NULL DEFAULT CURRENT_DATE
  );
`;

const createContactTable = `
  CREATE TABLE IF NOT EXISTS Contacts (
    id serial PRIMARY KEY,
    userId INT NOT NULL,
    name VARCHAR (50) NOT NULL,
    email VARCHAR (75) NOT NULL UNIQUE,
    phone VARCHAR (15) NOT NULL,
    createdAt date NOT NULL DEFAULT CURRENT_DATE
  );
`;

const migrationQuery = `${createUserTable} ${createContactTable}`;

pool.query(migrationQuery)
  .then(() => {
    log.info('Migration successful!');
    process.exit();
  })
  .catch((error) => log.info(error));
