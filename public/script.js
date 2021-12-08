(async () => {
    // fetch data from our api
    const response = await fetch('/api');
    const data = await response.json();
    
    const containers = document.querySelectorAll('.container');
    containers.forEach(container => {
        fillData(container, data[container.dataset.brand]);
    })

    // hide the loader
    const loader = document.querySelector('#loading');
    loader.classList.add('opacity-0');
    loader.addEventListener('transitionend', () => {
        loader.classList.add('invisible');
    })
})();

function fillData(node, data){
    // Get all the area to fill
    const logo = node.querySelector('.logo');
    const average = node.querySelector('.average');
    const count = node.querySelector('.count');
    const productList = node.querySelector('.product-list');

    // fill the logo
    if(!data.logo.includes('<svg')){
        logo.innerHTML = `<img src="${data.logo}" alt="logo d'une marque de vetements />"`
    }else{
        logo.innerHTML = data.logo;
    }

    // fill the numbers
    average.innerHTML = data.average;
    count.innerHTML = data.count;

    // fill the product list
    productList.innerHTML = "";
    data.products.forEach(product => {
        // li
        const li = document.createElement('li');
        li.className = "w-25 flex flex-col items-center";

        // img
        const img = document.createElement('img');
        img.className = "rounded-full w-20 h-20 object-cover";
        img.src = product.img;

        // title
        const title = document.createElement('p');
        title.className = "text-center text-sm mt-2";
        title.innerHTML = product.title;
        
        // price
        const price = document.createElement('p');
        price.className = "text-xs font-bold text-center m-0"
        price.innerHTML = product.price;

        li.appendChild(img);
        li.appendChild(title);
        li.appendChild(price);

        productList.appendChild(li);
    })
}