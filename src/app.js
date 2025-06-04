import express from 'express'
import errorhandler from './middlewares/errorHandler.js';
import router from './routes/userRoutes.js';

const app = express();
app.use(express.json());

app.use('/github-users', router)

app.use(errorhandler);

export default app;
