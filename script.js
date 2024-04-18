function getSelectedText() {
  var text = "";
  if (typeof window.getSelection != "undefined") {
    text = window.getSelection().toString();
  } else if (
    typeof document.selection != "undefined" &&
    document.selection.type == "Text"
  ) {
    text = document.selection.createRange().text;
  }
  return text;
}

async function doSomethingWithSelectedText(e) {
  var selectedText = getSelectedText();
  if (!selectedText.toString().trim().length) {
    removePopup();
    return;
  }

  if (selectedText && isNumeric(selectedText)) {
    const x = e.clientX;
    const y = e.clientY;
    try {
      var calculatedCurrency = await getCurrency(selectedText);
      placePopup(x, y, calculatedCurrency.toFixed(2));
    } catch (error) {
      console.error("Error calculating currency:", error);
    }
  }
}

async function getINRExchangeRate() {
  const url = "https://latest.currency-api.pages.dev/v1/currencies/usd.json";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();
  // console.log(data);
  return data.usd.inr;
}

async function getCurrency(selectedText) {
  try {
    const exchangeRate = await getINRExchangeRate();
    if (exchangeRate !== null) {
      const amountInINR = selectedText * exchangeRate;
      // console.log(`Amount in INR for USD: ${amountInINR}`);
      return amountInINR;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function placePopup(x_pos, y_pos, calculatedCurrency) {
  // Remove any existing popup
  removePopup();

  // Create the popup element
  const popup = document.createElement("div");
  popup.id = "popup_converter";
  popup.style.position = "absolute";
  popup.style.left = x_pos + window.scrollX +"px";
  popup.style.top = y_pos + window.scrollY + "px";
  popup.style.background = "#fff";
  popup.style.border = "1px solid #ccc";
  popup.style.borderRadius = "5px";
  popup.style.padding = "10px";
  popup.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
  popup.style.zIndex = "9999";

  const content = document.createElement("div");
  content.id = "content_popup";
  content.innerText = calculatedCurrency + " INR";
  content.style.border = "2px solid #007bff";
  content.style.padding = "5px";
  popup.appendChild(content);

  document.body.appendChild(popup);

  document.addEventListener("click", removePopup);
}

function removePopup(event) {
  const popup = document.getElementById("popup_converter");
  if (popup) {
    popup.remove();
    document.removeEventListener("click", removePopup);
  }
}

function createPopupElement() {
  const popup8255 = document.createElement("div");
  if (popup8255.length < 0) {
    return;
  }
  popup8255.setAttribute("id", "popup_converter");
  document.body.appendChild(popup8255);
}

setTimeout(createPopupElement, 1000);

document.onmouseup = doSomethingWithSelectedText;
