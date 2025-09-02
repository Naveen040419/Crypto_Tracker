document.addEventListener("DOMContentLoaded", async () => {
    await favCoins();
    renderCoins(coins);
});

let favcoins = JSON.parse(localStorage.getItem("favourites")) || [];
let coins = [];

async function favCoins() {
    let response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${favcoins.join(",")},tether&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    );
    coins = await response.json();
    console.log(coins);
}

function renderCoins(coins) {
    const tbody = document.getElementsByTagName("tbody")[0];
    tbody.innerHTML = "";

    coins.forEach((coin, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="${coin.image}" alt="${coin.name}" width="16px" height="16px" /></td>
            <td>${coin.name}</td>
            <td>$${coin.current_price.toLocaleString()}</td>
            <td>$${coin.total_volume.toLocaleString()}</td>
            <td>$${coin.market_cap.toLocaleString()}</td>
            <td>
                <i class="fa-solid fa-trash" data-id=${coin.id} style="color: #d30d21;"></i>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Another way to remove element from the table...

document.addEventListener("click", (e) => {

    if (e.target.classList.contains("fa-trash")) {
        let coinId = e.target.dataset.id;
        removeCoins(coinId, e.target); 
    }
});


function removeCoins(coinId, element) {
    // remove coin from favourites array
    favcoins = favcoins.filter(el => el !== coinId);

    // update localStorage
    localStorage.setItem("favourites", JSON.stringify(favcoins));

    // remove the row directly
    element.closest("tr").remove();

    console.log(`Removed ${coinId} from favourites`);
}
