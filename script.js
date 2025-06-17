const BASE_URL = "https://v6.exchangerate-api.com/v6/174ba7b87e5ea01bf0eece67/latest"; // just base, will append /<FROM_CURR>

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

const countryList = {
  USD: "US", INR: "IN", EUR: "FR", GBP: "GB", AUD: "AU", CAD: "CA", SGD: "SG", JPY: "JP", CNY: "CN",
 
};

// Populate currency dropdowns
dropdowns.forEach((select) => {
  for (let currCode in countryList) {
    const option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    // Default selection
    if (select.name === "from" && currCode === "USD") option.selected = true;
    if (select.name === "to" && currCode === "INR") option.selected = true;

    select.appendChild(option);
  }

  select.addEventListener("change", (e) => updateFlag(e.target));
});

// Update country flag
function updateFlag(element) {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const img = element.parentElement.querySelector("img");

  if (img && countryCode) {
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    img.alt = countryCode;
  }
}

// Fetch exchange rate and update UI
async function updateExchangeRate() {
  const amountInput = document.querySelector(".amount input");
  let amtVal = parseFloat(amountInput.value);

  if (isNaN(amtVal) || amtVal <= 0) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const from = fromCurr.value;
  const to = toCurr.value;

  const url = `${BASE_URL}/${from}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.conversion_rates || !data.conversion_rates[to]) {
      throw new Error("Invalid conversion rate");
    }

    const rate = data.conversion_rates[to];
    const finalAmount = (amtVal * rate).toFixed(2);

    msg.innerText = `${amtVal} ${from} = ${finalAmount} ${to}`;
  } catch (err) {
    msg.innerText = "Error fetching exchange rate.";
    console.error(err);
  }
}

// Event listener for conversion
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

// Fetch default conversion on page load
window.addEventListener("load", () => {
  updateExchangeRate();
});
