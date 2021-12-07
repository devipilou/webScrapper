const express = require('express')
const axios = require('axios').default;
const cheerio = require('cheerio');

const PORT = 8000; //Port we wanna use

// creation of an anonymous async function
(async () => {
    // dedicated
    const dedicatedUrl = 'https://www.dedicatedbrand.com/en/women/sweats#page=2';
    // this object will contain:
    // an array of products
    // average price
    // the amount of products
    const dedicatedData = await scrapeData(dedicatedUrl, '.productList-container .productList','.productList-details', '.productList-title','.productList-price');
    console.log(dedicatedData);

    // organic basics
    const organicBasicsUrl = 'https://organicbasics.com/collections/all-womens-products?filter=sweaters';
    const organicBasicsData = await scrapeData(organicBasicsUrl, '.product-grid-item-container[data-tags*=Sweater]', '.product__grid--text-container', 'a', '.product-price')
    console.log(organicBasicsData)
})();



function scrapeData(url, itemProductCssSelector, itemProductInfosCssSelector, itemProductTitleCssSelector, itemProductPriceCssSelector, itemProductImgCssSelector = 'img'){
    const obj = {};
    return axios(url)
    .then(response => {
        const html = response.data;

        const $ = cheerio.load(html);

        // Sum of all the prices for average price
        let sumOfPrices = 0;

        obj.products = [];
        

        $(itemProductCssSelector, html).each(function() {
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

        return obj;
    })
}

// init Express
const app = express();
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));