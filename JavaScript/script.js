document.addEventListener("DOMContentLoaded", async () => {
    await fetchCoins();
    renderCoins(coins);
});

let coins = [];

let currentPage = 1;
let itemsPerPage = 25;

async function fetchCoins(){
    try{
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${itemsPerPage}&page=${currentPage}&sparkline=false`);
        coins = await response.json();
        console.log(coins);
    }
    catch(err){
        console.error("Error fetching coins:", err);
    }
}

function renderCoins(coins){
    const tbody = document.getElementsByTagName("tbody")[0];
    tbody.innerHTML = ""; // Clear existing rows

    coins.forEach((coin, index) => {
        const row = document.createElement("tr");
        let isFavourite = favouriteList.includes(coin.id);

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="${coin.image}" alt="${coin.name}" width="16px"
            height="16px" /></td>
            <td>${coin.name}</td>
            <td>$${coin.current_price.toLocaleString()}</td>
            <td>$${coin.total_volume.toLocaleString()}</td>
            <td>$${coin.market_cap.toLocaleString()}</td>

            <td><i class="fa-solid fa-star
            ${isFavourite ? "favourite" : ""}" 
            style="color: #b197fc" data-id="${coin.id}"></i></td>

        `;
        tbody.appendChild(row);
    });
}

// Removed invalid code: HTMLCollection does not have .map()
// Star click handling is managed by the document click event below.


// Get functionality of prev and nextButtons ... 

const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");

prevButton.addEventListener("click", async () => {
    if (currentPage > 1) {
        currentPage--;
        await fetchCoins();
        renderCoins(coins);
    }
});

nextButton.addEventListener("click", async () => {
    currentPage++;
    await fetchCoins();
    renderCoins(coins);
});

