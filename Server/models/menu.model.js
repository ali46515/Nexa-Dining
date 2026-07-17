import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['starters', 'mains', 'desserts', 'drinks', 'sides'],
      message: '{VALUE} is not a valid category'
    }
  },
  subCategory: {
    type: String,
    enum: ['appetizers', 'soups', 'salads', 'seafood', 'meat', 'pasta', 'vegetarian', 'grill', 'hot-drinks', 'cold-drinks', 'cocktails', 'wine']
  },
  images: [{
    url: String,
    altText: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  dietaryTags: [{
    type: String,
    enum: ['V', 'GF', 'DF', 'NF', 'VG', 'H'],
    uppercase: true
  }],
  ingredients: [{
    name: String,
    isAllergen: {
      type: Boolean,
      default: false
    }
  }],
  nutritionalInfo: {
    calories: Number,
    protein: String,
    carbs: String,
    fat: String
  },
  preparationTime: Number, // in minutes
  spicyLevel: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isSpecial: {
    type: Boolean,
    default: false
  },
  isSeasonal: {
    type: Boolean,
    default: false
  },
  chefSpecialNote: String,
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numberOfReviews: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

menuItemSchema.index({ category: 1, isAvailable: 1 });
menuItemSchema.index({ isSpecial: 1, isAvailable: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);