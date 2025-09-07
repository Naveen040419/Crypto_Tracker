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

      showShimmerEffect();

      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
      const data = await response.json();

      displayData(data);
      return data;
    } catch (err) {
      console.error("Error fetching coin data:", err);
      coinContainer.innerHTML = `<p>Failed to load coin data. Try again later.</p>`;
    }
    finally{
      hideShimmerEffect();
    }
  }

  function displayData(coin) {
    if (!coin) {
      coinContainer.innerHTML = `<p>No data found</p>`;
      return;
    }

    coinImage.src = coin.image.large;
    coinName.textContent = coin.name;

  
    coinDesc.innerHTML = coin.description?.en
      ? coin.description.en.split(". ")[0] + "."
      : "No Description available";

    coinRank.textContent = coin.market_cap_rank || "NA";
    coinPrice.textContent = `$${coin.market_data.current_price.usd.toLocaleString()}`;
    coinCap.textContent = `$${coin.market_data.market_cap.usd.toLocaleString()}`;
  }

  let coinData = await fetchCoinData();
  console.log("Fetched Coin Data:", coinData);

  
  const ctx = document.getElementById("coinChart").getContext("2d");

  let coinChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label: "Price (USD)",
        data: [],
        borderWidth: 1,
        borderColor: "brown",
        backgroundColor: "rgba(255, 215, 0, 0.3)",
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "#333"
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          title: {
            display: true,
            text: "Date"
          }
        },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: "Price (USD)"
          },
          ticks: {
            callback: function (value) {
              return "$" + value.toLocaleString();
            }
          }
        }
      }
    }
  });



async function fetchChartData(days) {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    const data = await response.json();

    updateChart(data);
  } 
  
  catch (err) {
    console.error("Error fetching chart data:", err);
  }
}


function updateChart(data) {
  console.log("Chart Data:", data);

  const labels = data.prices.map(price => {
    let date = new Date(price[0]);
    return date.toLocaleTimeString(); 
  });

  const priceData = data.prices.map(price => price[1]);

  coinChart.data.labels = labels;
  coinChart.data.datasets[0].data = priceData;
  coinChart.update();
}

const buttons = document.querySelectorAll("#btn-container button");
console.log(buttons);

buttons.forEach( (button) =>{
   
  button.addEventListener( "click", (event) =>{

    buttons.forEach( btn => btn.classList.remove("active"));
    event.currentTarget.classList.add("active");

    const days = event.currentTarget.id == '24h'? 1 : event.currentTarget.id == '30d' ? 30 : 90;
    fetchChartData(days);
  });
});


await fetchChartData(1);

});


document.querySelector("#add-fav-btn").addEventListener("click", () => {

  let addToFavButton = document.querySelector("#add-fav-btn");

  let urlParams = new URLSearchParams(window.location.search);
  let coinId = urlParams.get("id");


  let favCoins = JSON.parse(localStorage.getItem("favourites")) || [];

  if (favCoins.includes(coinId)) {

    favCoins = favCoins.filter(id => id !== coinId);
    addToFavButton.textContent = "Add to Favourites";
  } else {
  
    favCoins.push(coinId);
    addToFavButton.textContent = "Remove from Favourites";
  }

  localStorage.setItem("favourites", JSON.stringify(favCoins));
});


 

