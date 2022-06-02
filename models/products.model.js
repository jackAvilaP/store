const { DataTypes } = require('sequelize');
const { db } = require('../utils/database');

const Product = db.define('product', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active',
    },
    categoryId:{
        type: DataTypes.INTEGER,
        allowNull: false,  
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

});

module.exports = { Product };