import log from 'fancy-log';
import pool from './config';

const seedUser = `
  INSERT INTO Users (name,email,password,phone) 
    VALUES ('Adaeze Samuel','${process.env.USER_EMAIL}','${process.env.USER_PASSWORD}','${process.env.USER_PHONE}');
`;

const seedQuery = `${seedUser}`;

pool.query(seedQuery)
  .then(() => {
    log.info('Data created!');
    process.exit();
  })
  .catch((error) => log.info(error));
