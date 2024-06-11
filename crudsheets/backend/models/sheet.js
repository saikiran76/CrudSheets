'use strict';

const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
    class Spreadsheet extends Model {
        // static associate(models) {
        //     // Spreadsheet.belongsTo(models.User, {
        //     //     foreignKey: 'userId',
        //     //     as: 'user'
        //     // });
        // }
    }

    Spreadsheet.init({
        column1: DataTypes.STRING,
        column2: DataTypes.STRING,
        column3: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Spreadsheet',
    });
    return Spreadsheet;
};
