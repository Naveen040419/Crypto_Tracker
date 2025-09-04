document.addEventListener("DOMContentLoaded", async () => {

    const urlParams = new URLSearchParams(window.location.search);
    const coinId = urlParams.get("id");
    console.log("Coin ID from URL:", coinId);

    const coinContainer = document.getElementById("coin-container");
    const coinImage = document.getElementById("coin-image");
    const coinName = document.getElementById("coin-name");
    const coinDesc = document.getElementById("coin-desc");
    const coinRank = document.getElementById("coin-rank");
    const coinPrice = document.getElementById("coin-price");
    const coinCap = document.getElementById("coin-cap");

    async function fetchCoinData() {
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
            const data = await response.json();

            displayData(data);
            return data; 

        } catch (err) {
            console.error("Error fetching coin data:", err);
            coinContainer.innerHTML = `<p>Failed to load coin data. Try again later.</p>`;
        }
    }


    function displayData(coin) {
        if (!coin) {
            coinContainer.innerHTML = `<p>No data found</p>`;
            return; 
        }

        coinImage.src = coin.image.large;
        coinName.textContent = coin.name;
        coinDesc.innerHTML = coin.description.en.split(". ")[0] + "." ?? "No Description available";
        coinRank.textContent = coin.market_cap_rank || "NA";
        coinPrice.textContent = `$${coin.market_data.current_price.usd.toLocaleString()}`;
        coinCap.textContent = `$${coin.market_data.market_cap.usd.toLocaleString()}`;
    }


    let coinData = await fetchCoinData();
    console.log("Fetched Coin Data:", coinData);

    const ctx = document.getElementById('coin-chart');

    new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: 'Price(USD)',
        data: [],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
   });


});
