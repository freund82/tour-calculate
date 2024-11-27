


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
  // Get the tour name
  const tourName = document.getElementById('tourName').value;

  // Get all rows from the table
  const rows = document.querySelectorAll('#tourTable tbody tr');
  const services = [];

  rows.forEach(row => {
      const date = row.querySelector('.date') ? row.querySelector('.date').value : "";
      const service = row.querySelector('.accomodation') ? row.querySelector('.accomodation').value : "";
      const quantity = row.querySelector('.quantity') ? row.querySelector('.quantity').value : "";
      const price = row.querySelector('.price') ? row.querySelector('.price').value : "";

      // Only push non-empty rows
      if (service || quantity || price) {
          services.push({ date, service, quantity, price });
      }
  });

  // Prepare the data to be saved
  const dataToSave = {
      tourName,
      services
  };

  // Save to local storage as a JSON string
  localStorage.setItem('tourData', JSON.stringify(dataToSave));
}

function loadData() {
  const savedData = localStorage.getItem('tourData');
  if (savedData) {
      const { tourName, services } = JSON.parse(savedData);
      // Populate the tour name input
      document.getElementById('tourName').value = tourName;

      // Clear existing rows in the table except the first one
      const tbody = document.querySelector('#tourTable tbody');
      tbody.innerHTML = ''; // Clear all rows

      // Populate the table with saved services
      services.forEach(service => {
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
  }
  calculateTotal();
}