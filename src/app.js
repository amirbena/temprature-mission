const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const router = require('./routes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/", router)


const PORT = process.env.PORT || 80;

const server = app.listen(PORT, () => {
    console.log(`Listenes to ${PORT}`);
})

module.exports = server;
