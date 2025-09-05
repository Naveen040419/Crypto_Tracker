document.addEventListener("DOMContentLoaded", async () => {
    await fetchCoins();
    renderCoins(coins);
});

let coins = [];
let favouriteList = JSON.parse(localStorage.getItem("favourites")) || [];

let currentPage = 1;
let itemsPerPage = 25;

async function fetchCoins() {
    try {
        const response = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${itemsPerPage}&page=${currentPage}&sparkline=false`
        );
        coins = await response.json();
        console.log(coins);
    } catch (err) {
        console.error("Error fetching coins:", err);
    }
}

function renderCoins(coins) {
    const tbody = document.getElementsByTagName("tbody")[0];
    tbody.innerHTML = ""; 

    coins.forEach((coin, index) => {
        const row = document.createElement("tr");

        row.classList.add("coin-row");
        row.setAttribute("data-id", coin.id);  

        let isFavourite = favouriteList.includes(coin.id);

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="${coin.image}" alt="${coin.name}" width="16px" height="16px" /></td>
            <td>${coin.name}</td>
            <td>$${coin.current_price.toLocaleString()}</td>
            <td>$${coin.total_volume.toLocaleString()}</td>
            <td>$${coin.market_cap.toLocaleString()}</td>
            <td>
                <i class="fa-solid fa-star ${isFavourite ? "favourite" : ""}" 
                   data-id="${coin.id}"></i>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Pagination buttons
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

// Star click handling (with save to localStorage)
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-star")) {
        const coinId = e.target.dataset.id;

        if (favouriteList.includes(coinId)) {
            // Remove from favourites
            favouriteList = favouriteList.filter(id => id !== coinId);
        } else {
            // Add to favourites
            favouriteList.push(coinId);
        }

        // Save to localStorage
        localStorage.setItem("favourites", JSON.stringify(favouriteList));

        // Toggle UI color
        e.target.classList.toggle("favourite");
    }
});

document.addEventListener("click", (e) => {

    const row = e.target.closest(".coin-row");

    if (row && !e.target.classList.contains("fa-star")) {

        const coinId = row.getAttribute("data-id"); 
        window.location.href = `coin.html?id=${coinId}`;    
    }
});


// Search - Functionality...

const fetchSearchResult = async () => {
    let searchText = document.querySelector(".search-input").value.trim();

    if (searchText) {
        try {
            let result = await fetch(`https://api.coingecko.com/api/v3/search?query=${searchText}`);
            let data = await result.json();

            console.log( data );

            showSearchResults(data.coins); 
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    } else {
        console.log("No result found");
    }
};

const showSearchResults = (data) => {
    const searchDialog = document.querySelector(".dialog-box");
    const resultList = document.querySelector(".search-content ul"); 

    resultList.innerHTML = ""; 

    if (data.length) {
        data.slice(0, 10).forEach((coin) => {
            let listItem = document.createElement("li");

            listItem.innerHTML = `
                <img src="${coin.thumb}" alt="${coin.name}" width="16px" height="16px" />
                <span>${coin.name}</span>
            `;
            listItem.setAttribute("data-id", coin.id);

            resultList.appendChild(listItem);
        });
    } else {
        resultList.innerHTML = `<li>No Coins found</li>`;
    }

    searchDialog.style.display = "block";
};


document.querySelector(".search-input").addEventListener("input", () => {
    fetchSearchResult(); 
});


document.querySelector(".search-icon").addEventListener("click", () => {
    fetchSearchResult(); 
});

document.querySelector(".fa-xmark").addEventListener("click", () => {
    handleCloseSearchDialog(); 
});
