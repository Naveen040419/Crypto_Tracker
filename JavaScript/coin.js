document.addEventListener("DOMContentLoaded", async()=>{

    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams, "");
    const coinId = urlParams.get("id");

    const coinContainer = document.getElementById("coin-container");
    const coinImage = document.getElementById("coin-container");
    const coinName = document.getElementById("coin-container");
    const coinDesc = document.getElementById("coin-container");
    const coinRank = document.getElementById("coin-container");
    const coinPrice = document.getElementById("coin-container");
    const coinCap = document.getElementById("coin-container");

    async function fetchCoinData(){

        try{

            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
            const data = await response.json();

            displayData(data);
        }
        catch(err){
            
        }
    }

    function displayData( data ){
        if( !data ){
            coinContainer.innerHTML=`<p> No data found </p>`;
        }
        
    }

    let coinData = await fetchCoinData()
});