const BASE_URL = "https://v6.exchangerate-api.com/v6/796af9a3b47470c78a7eff72/latest";

const amount = document.querySelector(".amount input");
const fromCurr = document.querySelector("#fromCurrency");
const toCurr = document.querySelector("#toCurrency");
const msg = document.querySelector("#exchangeRateMsg");

const updateExchangeRate = async () => {
    try {
        let amtVal = parseFloat(amount.value) || 1;
        amount.value = amtVal; 

        const URL = `${BASE_URL}/${fromCurr.value}`;
        let response = await fetch(URL);
        if (!response.ok) throw new Error("Failed to fetch");
        
        let data = await response.json();
        if (data.result !== "success") throw new Error(data["error-type"]);

        let rate = data.conversion_rates[toCurr.value];
        if (!rate) throw new Error("Invalid currency");

        let finalAmount = amtVal * rate;
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Error: " + error.message;
        console.error(error);
    }
};

// Event Listeners
document.querySelector("#convertBtn").addEventListener("click", updateExchangeRate);
[fromCurr, toCurr, amount].forEach(element => {
    element.addEventListener("change", updateExchangeRate);
    element.addEventListener("input", updateExchangeRate); 
});

// Initial load
updateExchangeRate();
