const { Spreadsheet } = require('../models');
const xlsx = require('xlsx');
const { Op } = require('sequelize');

exports.getSpreadsheets = async (req, res) => {
    try {
        const { date } = req.query;
        let spreadsheets;
        // const spreadsheets = await Spreadsheet.findAll();
        if(date){
            const selectedDate = new Date(date);
            spreadsheets = await Spreadsheet.findAll({
                where: {
                    createdAt: {
                        [Op.eq]: selectedDate
                    }
                }
            });
        } else {
            spreadsheets = await Spreadsheet.findAll();
        }
        res.status(200).json(spreadsheets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch spreadsheets' });
    }
};

exports.getDates = async (req, res) => {
    try {
        const dates = await Spreadsheet.findAll({
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'date']
            ],
            group: ['date']
        });
        res.status(200).json(dates.map(date => date.date));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch dates' });
    }
};

exports.createSpreadsheet = async (req, res) => {
    try {
        const newSpreadsheet = await Spreadsheet.create(req.body);
        res.status(201).json(newSpreadsheet);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create spreadsheet' });
    }
};

exports.updateSpreadsheet = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Spreadsheet.update(req.body, { where: { id } });
        if (updated) {
            const updatedSpreadsheet = await Spreadsheet.findOne({ where: { id } });
            res.status(200).json(updatedSpreadsheet);
        } else {
            res.status(404).json({ error: 'Spreadsheet not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update spreadsheet' });
    }
};

exports.deleteSpreadsheet = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Spreadsheet.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Spreadsheet not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete spreadsheet' });
    }
};

exports.uploadSpreadsheet = async (req, res) => {
    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet);

        const formattedData = jsonData.map(row => ({ data: row }));

        const createdSheets = await Spreadsheet.bulkCreate(formattedData);

        res.status(201).json(createdSheets);
    } catch (error) {
        console.error('Error uploading spreadsheet:', error);
        res.status(500).json({ error: 'Failed to upload spreadsheet' });
    }
};
