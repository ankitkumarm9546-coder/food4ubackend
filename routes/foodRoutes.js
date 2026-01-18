const express = require('express');
const {
  createFood,
  listFoods,
  getFood,
  updateFood,
  deleteFood
} = require('../controllers/foodController');

const router = express.Router();

router.post('/', createFood);
router.get('/', listFoods);
router.get('/:id', getFood);
router.put('/:id', updateFood);
router.delete('/:id', deleteFood);

module.exports = router;

