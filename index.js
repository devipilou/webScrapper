const express = require('express')
const axios = require('axios').default;
const cheerio = require('cheerio');

const PORT = 8000; //Port we wanna use



// init Express
const app = express();
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));