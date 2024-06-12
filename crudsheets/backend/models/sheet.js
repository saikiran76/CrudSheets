const { Model, DataTypes } = require('sequelize');

class Spreadsheet extends Model {}

module.exports = (sequelize) => {
    Spreadsheet.init({
        data: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    }, {
        sequelize,
        modelName: 'Spreadsheet',
        tableName: 'Spreadsheets',
    });

    return Spreadsheet;
};
