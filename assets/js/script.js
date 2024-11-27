


function addRow(button) {
  const row = button.parentElement.parentElement.cloneNode(true);
            document.querySelector('#tourTable tbody').appendChild(row);
            calculateTotal();
}


function removeRow(button) {
  const row = button.parentElement.parentElement;
  if (document.querySelectorAll('#tourTable tbody tr').length > 1) {
      row.remove();
      calculateTotal();
  }
}

function calculateTotal() {
  let total = 0;
  const rows = document.querySelectorAll('#tourTable tbody tr');
  rows.forEach(row => {
      const price = row.querySelector('td:nth-child(4) input').value*row.querySelector('td:nth-child(3) input').value;
      total += parseFloat(price) || 0;
  });

  const exchangeRate = parseFloat(document.getElementById('exchangeRate').value) || 1;
  const totalConverted = total * exchangeRate;
  
  const currencySelect = document.getElementById('currencySelect');
  const currency = currencySelect.options[currencySelect.selectedIndex].value;

  //(currency==="RUB")?document.querySelector('#total').remove():null;

  document.getElementById('totalPrice').innerText = `${total} ${currency}`
  document.getElementById('totalConvertedPrice').innerText = `${totalConverted.toFixed(2)} руб.`;
}

document.addEventListener('input', calculateTotal);

function save() {
  const tourName = document.getElementById('tourName').value.trim();

  if (!tourName) {
      alert("Please enter a valid tour name.");
      return;
  }

  const rows = document.querySelectorAll('#tourTable tbody tr');
  const services = [];

  const exchangeRate = parseFloat(document.getElementById('exchangeRate').value) || 1;
  const currencySelect = document.getElementById('currencySelect');
  const currency = currencySelect.options[currencySelect.selectedIndex].value;

  rows.forEach(row => {
      const date = row.querySelector('.date').value || "";
      const service = row.querySelector('.accomodation').value || "";
      const quantity = row.querySelector('.quantity').value || "";
      const price = row.querySelector('.price').value || "";

      if (service || quantity || price) {
          services.push({ date, service, quantity, price, currency, exchangeRate });
      }
  });

  const dataToSave = { tourName, services };
  
  // Retrieve existing tours and update
  const existingTours = JSON.parse(localStorage.getItem('toursData')) || [];
  existingTours.push(dataToSave);
  localStorage.setItem('toursData', JSON.stringify(existingTours));

  alert(`${tourName} has been saved successfully!`);
}



function showModal() {
  const toursList = document.getElementById('toursList');
  toursList.innerHTML = ''; // Clear previous entries
  const savedData = localStorage.getItem('tourData');
  
  if (savedData) {
      const data = JSON.parse(savedData);
      const tourItem = document.createElement('li');
      tourItem.innerText = data.tourName; // Assuming there's one tour for this example
      tourItem.onclick = function() {
          loadData(data); // Pass the data to loadData function
          closeModal();
      };
      toursList.appendChild(tourItem);
  }
  document.getElementById('toursModal').style.display = 'block';
}

document.getElementById('closeModalButton').onclick = function() {
  closeModal();
};

function closeModal() {
  document.getElementById('toursModal').style.display = 'none';
}

function showModal() {
  const toursList = document.getElementById('toursList');
  toursList.innerHTML = '';

  const savedData = JSON.parse(localStorage.getItem('toursData')) || [];
  
  savedData.forEach(data => {
      const tourItem = document.createElement('li');
      tourItem.innerText = data.tourName;
      tourItem.onclick = function() {
          loadData(data);
          closeModal();
      };
      toursList.appendChild(tourItem);
  });

  document.getElementById('toursModal').style.display = 'block';
}


function loadData(savedData) {
  const { tourName, services } = savedData;
  document.getElementById('tourName').value = tourName;

  const tbody = document.querySelector('#tourTable tbody');
  tbody.innerHTML = ''; // Clear all rows

  services.forEach(service => {
    document.getElementById('exchangeRate').value = service.exchangeRate;
    document.getElementById('currencySelect').value = service.currency;

      const newRow = document.createElement('tr');
      newRow.innerHTML = `
          <td scope="row"><input class="date" type="text" value="${service.date}" style="border:none"></td>
          <td><textarea rows="1" class="accomodation" style="border:none; width:100%">${service.service}</textarea></td>
          <td><input type="text" class="quantity" value="${service.quantity}" style="border:none;"></td>
          <td><input type="text" class="price" value="${service.price}" style="border:none" onchange="calculateTotal()"></td>
          <td>
              <button type="button" class="btn btn-primary" onclick="addRow(this)">+</button>
              <button type="button" class="btn btn-success" onclick="removeRow(this)">-</button>
          </td>
      `;
      tbody.appendChild(newRow);
  });

  calculateTotal();
}
