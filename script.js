const BASE_URL = "https://v6.exchangerate-api.com/v6/796af9a3b47470c78a7eff72/latest";

// DOM Elements
const amount = document.querySelector(".amount input");
const fromCurr = document.querySelector("#fromCurrency");
const toCurr = document.querySelector("#toCurrency");
const msg = document.querySelector("#exchangeRateMsg");
const convertBtn = document.querySelector("#convertBtn");
const swapBtn = document.querySelector(".fa-arrow-right-arrow-left");

// Initialize Currencies
const initializeCurrencies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/USD`);
    if (!response.ok) throw new Error("Failed to fetch currencies");
    
    const data = await response.json();
    if (data.result !== "success") throw new Error(data["error-type"]);
    
    const currencies = Object.keys(data.conversion_rates);
    
    [fromCurr, toCurr].forEach(select => {
      currencies.forEach(currency => {
        const option = document.createElement("option");
        option.value = currency;
        option.textContent = currency;
        select.appendChild(option);
      });
    });
    
    fromCurr.value = "USD";
    toCurr.value = "INR";
    updateFlags();
  } catch (error) {
    msg.textContent = `Error: ${error.message}`;
  }
};

// Update flags based on currency
const updateFlags = () => {
  document.querySelectorAll(".select-container img").forEach((img, index) => {
    const currency = index === 0 ? fromCurr.value : toCurr.value;
    img.src = `https://flagsapi.com/${currency.substring(0, 2)}/flat/64.png`;
    img.alt = `${currency} Flag`;
  });
};

// Currency conversion function
const updateExchangeRate = async () => {
  try {
    let amtVal = Math.abs(parseFloat(amount.value)) || 1;
    amount.value = amtVal;

    const response = await fetch(`${BASE_URL}/${fromCurr.value}`);
    if (!response.ok) throw new Error("Failed to fetch exchange rates");
    
    const data = await response.json();
    if (data.result !== "success") throw new Error(data["error-type"]);
    
    const rate = data.conversion_rates[toCurr.value];
    if (!rate) throw new Error("Invalid target currency");
    
    const convertedAmount = (amtVal * rate).toFixed(2);
    msg.textContent = `${amtVal} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`;
    
  } catch (error) {
    msg.textContent = `Error: ${error.message}`;
    console.error(error);
  }
};

// Event Listeners
swapBtn.addEventListener("click", () => {
  [fromCurr.value, toCurr.value] = [toCurr.value, fromCurr.value];
  updateFlags();
});

convertBtn.addEventListener("click", () => {
  updateExchangeRate();
});

fromCurr.addEventListener("change", updateFlags);
toCurr.addEventListener("change", updateFlags);

// Initialization
initializeCurrencies();
