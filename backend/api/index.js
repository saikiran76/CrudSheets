const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('../routes/routes');
const { sequelize } = require('../models');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
