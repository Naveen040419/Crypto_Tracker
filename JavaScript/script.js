document.addEventListener("DOMContentLoaded", async () => {
    await fetchCoins();
    renderCoins(coins);
});

let coins = [];
let favouriteList = [];

async function fetchCoins(){
    try{
        const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false");
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
            <td>${coin.current_price}</td>
            <td>${coin.total_volume}</td>
            <td>${coin.market_cap}</td>

            <td><i class="fa-solid fa-star
            ${isFavourite ? "favourite" : ""}" 
            style="color: #b197fc"></i></td>
        
        `;
        tbody.appendChild(row);
    });
}

let stars = document
.getElementsByClassName("fa-star")
.map((star)=> star.addEventListener)
