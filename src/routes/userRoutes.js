import express from 'express';
import collectUserInsights from './../controllers/githubUserInsightController.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const { searchTerm } = req.query;

  collectUserInsights(searchTerm || 'Javascript Developer')
    .then(result => {
      res.json({
        success: true,
        data: result,
      });
    })
  .catch(error => next(error));
})

export default router;
