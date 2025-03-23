// ========== USSD/SMS System ========== //
let currentMenu = "main";

function handleDial() {
  const input = document.getElementById('ussdInput').value;
  let response = "";

  // USSD Workflow
  if (input === '*123#') {
    response = `FarmConnect Menu:
1. List Crop
2. Check Messages
3. Price Alerts
4. Weather`;
    currentMenu = "main";
  } else if (currentMenu === "main") {
    switch(input) {
      case '1':
        response = "Enter crop name:\n(e.g., MAIZE)";
        currentMenu = "list_crop";
        break;
      case '2':
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        response = messages.join('\n') || "No messages.";
        break;
      case '3':
        response = `Price Alerts:
1. Subscribe
2. Unsubscribe`;
        currentMenu = "price_alerts";
        break;
      case '4':
        response = "Weather: Sunny, 28°C.";
        break;
    }
  } else if (currentMenu === "list_crop") {
    saveCrop(input.toUpperCase());
    response = "Crop listed! Dial *123# to exit.";
    currentMenu = "main";
  } else if (currentMenu === "price_alerts") {
    response = "Alerts updated!";
    currentMenu = "main";
  }

  document.getElementById('screen').innerHTML = `<pre>${response}</pre>`;
  document.getElementById('ussdInput').value = '';
}

// ========== Buyer SMS Search ========== //
function sendBuyerSMS() {
  const sms = document.getElementById('buyerSMS').value.toUpperCase();
  const [crop, location] = sms.split(' ');
  const matches = JSON.parse(localStorage.getItem('crops')) || [];
  
  const results = matches.filter(item => 
    item.crop === crop && 
    item.location === location
  );
  
  const buyerResults = document.getElementById('buyerResults');
  buyerResults.innerHTML = results.map(farmer => `
    <div class="result">
      <p>${farmer.crop} at ${farmer.location}</p>
      <button onclick="mockCall('${farmer.phone}')">Call ${farmer.phone}</button>
    </div>
  `).join('');
}

// ========== Mock Map & Table ========== //
function loadFarmers() {
  const farmers = JSON.parse(localStorage.getItem('crops')) || [];
  const table = document.getElementById('farmerTable');
  table.innerHTML = `
    <tr>
      <th>Crop</th>
      <th>Location</th>
      <th>Contact</th>
    </tr>
    ${farmers.map(farmer => `
      <tr>
        <td>${farmer.crop}</td>
        <td>${farmer.location}</td>
        <td><button onclick="mockCall('${farmer.phone}')">Call</button></td>
      </tr>
    `).join('')}
  `;
}

// ========== Voice Call Simulation ========== //
function mockCall(phone) {
  alert(`Connecting to ${phone}... (Simulated call)`);
}

// ========== Initialize ========== //
localStorage.setItem('crops', JSON.stringify([
  { crop: "MAIZE", location: "VILLAGE_X", phone: "0712345678" }
]));
loadFarmers();