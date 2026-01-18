const Food = require('../models/Food');

const createFood = async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json(food);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Food with this name and category already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating food',
      error: error.message
    });
  }
};

const listFoods = async (req, res) => {
  try {
    const { category, dietary, search } = req.query;
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (dietary) {
      const dietaryTags = dietary.split(',').map((tag) => tag.trim()).filter(Boolean);
      if (dietaryTags.length > 0) {
        filter.dietaryTags = { $in: dietaryTags };
      }
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const foods = await Food.find(filter)
      .select('name category basePrepTime nutrition.calories dietaryTags allergens glycemicIndex')
      .lean();

    res.json(foods.map((food) => ({
      id: food._id,
      name: food.name,
      category: food.category,
      basePrepTime: food.basePrepTime,
      nutrition: { calories: food.nutrition?.calories },
      dietaryTags: food.dietaryTags,
      allergens: food.allergens,
      glycemicIndex: food.glycemicIndex
    })));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching foods',
      error: error.message
    });
  }
};

const getFood = async (req, res) => {
  try {
    const food = await Food.findOne({ _id: req.params.id, isActive: true }).lean();
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found'
      });
    }

    res.json({
      id: food._id,
      name: food.name,
      imageUrl: food.imageUrl,
      category: food.category,
      dietaryTags: food.dietaryTags,
      allergens: food.allergens,
      serving: food.serving,
      basePrepTime: food.basePrepTime,
      prepMethods: food.prepMethods,
      nutrition: food.nutrition,
      glycemicIndex: food.glycemicIndex
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching food',
      error: error.message
    });
  }
};

const updateFood = async (req, res) => {
  try {
    const food = await Food.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found'
      });
    }

    res.json(food);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Food with this name and category already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating food',
      error: error.message
    });
  }
};

const deleteFood = async (req, res) => {
  try {
    const food = await Food.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { $set: { isActive: false } },
      { new: true }
    ).lean();

    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food not found'
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting food',
      error: error.message
    });
  }
};

module.exports = {
  createFood,
  listFoods,
  getFood,
  updateFood,
  deleteFood
};

