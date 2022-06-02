
//Models
const { Categories } = require('../models/categories.model');
const { AppError } = require('../utils/appError');

//Utils
const { catchAsync } = require("../utils/catchAsync");

const getAllCategories = catchAsync(async (req, res, next) => {
    const categories = await Categories.findAll({ where: { status: 'active' } });
    res.status(200).json({ categories });
});

const createCategories = catchAsync(async (req, res, next) => {
    const { name } = req.body;

    if (name.length === 0) {
        return next(new AppError('Name cannot be empty', 400));
    }

    const newCategory = await Categories.create({ name });

    res.status(201).json({ newCategory });
});

const updateCategories = catchAsync(async (req, res, next) => { 
  
  const { newName } = req.body;
  const { id } = req.params;

  const category = await Categories.findOne({
    where: { id, status: 'active' },
  });

  if (!category) {
    return next(new AppError('Category does not exits with given id', 404));
  }

  if (newName.length === 0) {
    return next(new AppError('The updated name cannot be empty', 400));
  }

  await category.update({ name: newName });

  res.status(200).json({ status: 'success' });
});

module.exports = {
    getAllCategories,
    createCategories,
    updateCategories,
};