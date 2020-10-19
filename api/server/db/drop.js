import log from 'fancy-log';
import pool from './config';

const dropUsersTable = `
  DROP TABLE IF EXISTS users CASCADE;
`;

const dropContactsTable = `
  DROP TABLE IF EXISTS contacts;
`;

const dropQuery = `${dropUsersTable} ${dropContactsTable}`;

pool.query(dropQuery)
  .then(() => process.exit())
  .catch((error) => log.info(error));
