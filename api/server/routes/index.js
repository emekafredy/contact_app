import userRoutes from './user';
import contactRoutes from './contact';
import { errorResponse } from '../utils';

// Define API prefix
const prefix = '/api';

const router = (app) => {
  // CORS HEADERS MIDDLEWARE
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE');
    // eslint-disable-next-line max-len
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id');
    res.header('Access-Control-Expose-Headers', 'authorization');
  
    next();
  });

  userRoutes(app, prefix);
  contactRoutes(app, prefix);

  app.use((req, res) => {
    errorResponse('Sorry! This route does not exist', 404, res);
  });
};

export default router;
