const mongoose = require('mongoose');

const prepMethodSchema = new mongoose.Schema({
  method: { type: String, required: true, trim: true },
  prepTimeMultiplier: { type: Number, required: true },
  nutritionRetention: { type: Number, required: true }
}, { _id: false });

const nutritionSchema = new mongoose.Schema({
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 }
}, { _id: false });

const servingSchema = new mongoose.Schema({
  size: { type: Number, required: true },
  unit: { type: String, required: true, trim: true }
}, { _id: false });

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  imageUrl: { type: String, trim: true },
  category: { type: String, required: true, trim: true },
  dietaryTags: { type: [String], default: [] },
  allergens: { type: [String], default: [] },
  serving: { type: servingSchema, required: true },
  basePrepTime: { type: Number, required: true },
  prepMethods: { type: [prepMethodSchema], default: [] },
  nutrition: { type: nutritionSchema, required: true },
  glycemicIndex: { type: Number },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

foodSchema.index({ name: 1, category: 1 }, { unique: true });
foodSchema.index({ name: 1 });
foodSchema.index({ category: 1 });

module.exports = mongoose.model('Food', foodSchema);

