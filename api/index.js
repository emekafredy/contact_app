import express from 'express';
import bodyParser from 'body-parser';
import log from 'fancy-log';
import dotenv from 'dotenv';

import router from './server/routes';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();
const { PORT } = process.env;

router(app);

app.listen(PORT, () => log.info(`Server up and running on port ${PORT}`));
