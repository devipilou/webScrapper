const express = require('express')
const axios = require('axios').default;
const cheerio = require('cheerio');

const path = require('path');

const PORT = 8000; //Port we wanna use

// creation of an anonymous async function
(async () => {
    // DEDICATED
    const dedicatedUrl = 'https://www.dedicatedbrand.com/en/women/sweats#page=2';
    // this object will contain:
    // an array of products
    // average price
    // the amount of products
    const dedicatedData = await scrapeData(dedicatedUrl, '.stickyLogo-text','.productList-container .productList', '.productList-details', '.productList-title', '.productList-price');
    // console.log(dedicatedData);

    // ORGANIC BASICS
    const organicBasicsUrl = 'https://organicbasics.com/collections/all-womens-products?filter=sweaters';
    const organicBasicsData = await scrapeData(organicBasicsUrl, '#Logo','.product-grid-item-container[data-tags*=Sweater]', '.product__grid--text-container', 'a', '.product-price')
    // console.log(organicBasicsData)
})();



function scrapeData(url, logoCssSelector, itemProductCssSelector, itemProductInfosCssSelector, itemProductTitleCssSelector, itemProductPriceCssSelector, itemProductImgCssSelector = 'img') {
    const obj = {};
    return axios(url)
        .then(response => {
            const html = response.data;

            const $ = cheerio.load(html);

            // Sum of all the prices for average price
            let sumOfPrices = 0;

            // get logo
            const logoTag = $(logoCssSelector, html);
            if(logoTag[0].name === 'img'){
                obj.logo = logoTag.attr('src');
            }else if (logoTag[0].name === 'svg'){
                obj.logo = logoTag.get().map(svg => $.html(svg))[0];
            }

            obj.products = [];
            


            $(itemProductCssSelector, html).each(function () {
                const infos = $(this).find(itemProductInfosCssSelector);

                const title = infos.find(itemProductTitleCssSelector).text();
                const price = infos.find(itemProductPriceCssSelector).text().trim();
                const img = $(this).find(itemProductImgCssSelector).attr('src');

                // add to the array
                obj.products.push({
                    title,
                    price,
                    img
                })

                // sum of the prices
                sumOfPrices += price.includes('€') ? parseInt(price.replace('€', '')) : parseInt(price.replace('EUR', ''));
            });

            const average = sumOfPrices / obj.products.length;
            obj.average = average;
            obj.count = obj.products.length
            obj.url = url;

            return obj;
        })
}

// init Express
const app = express();
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

app.get('/api/', async (req, res) => {
    // DEDICATED
    const dedicatedUrl = 'https://www.dedicatedbrand.com/en/women/sweats#page=2';
    // this object will contain:
    // an array of products
    // average price
    // the amount of products
    const dedicatedData = await scrapeData(dedicatedUrl, '.productList-container .productList', '.productList-details', '.productList-title', '.productList-price');

    // ORGANIC BASICS
    const organicBasicsUrl = 'https://organicbasics.com/collections/all-womens-products?filter=sweaters';
    const organicBasicsData = await scrapeData(organicBasicsUrl, '.product-grid-item-container[data-tags*=Sweater]', '.product__grid--text-container', 'a', '.product-price')
    return res.send({
        dedicatedData,
        organicBasicsData
    });
})

// Creating the client-side page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});