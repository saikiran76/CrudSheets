const express = require('express');
const router = express.Router();
const sheetController = require('../controllers/sheetController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.send('Hello Backend!');
});
router.get('/spreadsheet', sheetController.getSpreadsheets);
router.get('/spreadsheet/dates', sheetController.getDates);
router.post('/spreadsheet', sheetController.createSpreadsheet);
router.put('/spreadsheet/:id', sheetController.updateSpreadsheet);
router.delete('/spreadsheet/:id', sheetController.deleteSpreadsheet);
router.post('/spreadsheet/upload', upload.single('file'), sheetController.uploadSpreadsheet);

module.exports = router;
