const express = require('express');
const router = express.Router();
const sheetController = require('../controllers/sheetController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.send('Hello Backend!');
});
router.get('/api/spreadsheet', sheetController.getSpreadsheets);
router.get('/api/spreadsheet/dates', sheetController.getDates);
router.post('/api/spreadsheet', sheetController.createSpreadsheet);
router.put('/api/spreadsheet/:id', sheetController.updateSpreadsheet);
router.delete('/api/spreadsheet/:id', sheetController.deleteSpreadsheet);
router.post('/api/spreadsheet/upload', upload.single('file'), sheetController.uploadSpreadsheet);

module.exports = router;
