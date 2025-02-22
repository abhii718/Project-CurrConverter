const BASE_URL = "https://v6.exchangerate-api.com/v6/796af9a3b47470c78a7eff72/latest";

const amount = document.querySelector(".amount input");
const fromCurr = document.querySelector("#fromCurrency");
const toCurr = document.querySelector("#toCurrency");
const msg = document.querySelector("#exchangeRateMsg");

const updateExchangeRate = async () => {
    try {
        let amtVal = parseFloat(amount.value) || 1; // Ensure a valid number
        amount.value = amtVal; // Set default value if input is empty or invalid
        
        const URL = `${BASE_URL}/${fromCurr.value}`;
        let response = await fetch(URL);
        if (!response.ok) throw new Error("Failed to fetch exchange rate");

        let data = await response.json();
        let rate = data.conversion_rates[toCurr.value];

        if (!rate) throw new Error("Invalid currency selection");

        let finalAmount = amtVal * rate;
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Error fetching exchange rate!";
        console.error(error);
    }
};

// Example: Attach to a button click
document.querySelector("#convertBtn").addEventListener("click", updateExchangeRate);
