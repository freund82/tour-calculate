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
  rows.forEach((row) => {
    const price =
      row.querySelector('td:nth-child(4) input').value *
      row.querySelector('td:nth-child(3) input').value;
    total += parseFloat(price) || 0;
  });

  const exchangeRate = parseFloat(document.getElementById('exchangeRate').value) || 1;
  const totalConverted = total * exchangeRate;

  const currencySelect = document.getElementById('currencySelect');
  const currency = currencySelect.options[currencySelect.selectedIndex].value;

  //(currency==="RUB")?document.querySelector('#total').remove():null;

  document.getElementById('totalPrice').innerText = `${total} ${currency}`;
  document.getElementById('totalConvertedPrice').innerText = `${totalConverted.toFixed(2)} руб.`;
}

document.addEventListener('input', calculateTotal);

function save() {
  const tourName = document.getElementById('tourName').value.trim();

  if (!tourName) {
    alert('Введите название тура.');
    return;
  }

  const rows = document.querySelectorAll('#tourTable tbody tr');
  const services = [];

  const exchangeRate = parseFloat(document.getElementById('exchangeRate').value) || 1;
  const currencySelect = document.getElementById('currencySelect');
  const currency = currencySelect.options[currencySelect.selectedIndex].value;

  rows.forEach((row) => {
    const date = row.querySelector('.date').value || '';
    const service = row.querySelector('.accomodation').value || '';
    const quantity = row.querySelector('.quantity').value || '';
    const price = row.querySelector('.price').value || '';

    if (service || quantity || price) {
      services.push({ date, service, quantity, price, currency, exchangeRate });
    }
  });

  const dataToSave = { tourName, services };

  // Retrieve existing tours
  const existingTours = JSON.parse(localStorage.getItem('toursData')) || [];

  // Check if a tour with the same name already exists
  const existingTourIndex = existingTours.findIndex((tour) => tour.tourName === tourName);

  if (existingTourIndex !== -1) {
    // Update existing tour
    existingTours[existingTourIndex] = dataToSave; // Replace with new data
    alert(`${tourName} успешно изменен и сохранен!`);
  } else {
    // Add new tour
    existingTours.push(dataToSave);
    alert(`${tourName} успешно сохранен!`);
  }

  // Save the updated tours list back to localStorage
  localStorage.setItem('toursData', JSON.stringify(existingTours));
}

function showModal() {
  const toursList = document.getElementById('toursList');
  toursList.innerHTML = ''; // Clear previous entries
  const savedData = localStorage.getItem('tourData');

  if (savedData) {
    const data = JSON.parse(savedData);
    const tourItem = document.createElement('li');
    tourItem.innerText = data.tourName; // Assuming there's one tour for this example
    tourItem.onclick = function () {
      loadData(data); // Pass the data to loadData function
      closeModal();
    };
    toursList.appendChild(tourItem);
  }
  document.getElementById('toursModal').style.display = 'block';
}

document.getElementById('closeModalButton').onclick = function () {
  closeModal();
};

function closeModal() {
  document.getElementById('toursModal').style.display = 'none';
}

function showModal() {
  const toursList = document.getElementById('toursList');
  toursList.innerHTML = '';

  const savedData = JSON.parse(localStorage.getItem('toursData')) || [];

  savedData.forEach((data) => {
    const tourItem = document.createElement('li');
    tourItem.innerText = data.tourName;
    tourItem.onclick = function () {
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

  services.forEach((service) => {
    document.getElementById('exchangeRate').value = service.exchangeRate;
    document.getElementById('currencySelect').value = service.currency;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
          <td scope="row" style="border: 1px solid #0d6efd; border-collapse: collapse;"><input class="date" type="text" value="${service.date}" style="border:none"></td>
          <td style="border: 1px solid #0d6efd; border-collapse: collapse; width:20rem"><textarea rows="1" class="accomodation" style="border:none; width: 20rem;">${service.service}</textarea></td>
          <td style="border: 1px solid #0d6efd; border-collapse: collapse;"><input type="text" class="quantity" value="${service.quantity}" style="border:none;"></td>
          <td style="border: 1px solid #0d6efd; border-collapse: collapse;"><input type="text" class="price" value="${service.price}" style="border:none" onchange="calculateTotal()"></td>
          <td style="border: 1px solid #0d6efd; border-collapse: collapse;">
              <button type="button" class="btn btn-primary" onclick="addRow(this)">+</button>
              <button type="button" class="btn btn-success" onclick="removeRow(this)">-</button>
          </td>
      `;
    tbody.appendChild(newRow);
  });

  calculateTotal();
}

/*function copyTableToEmail() {
  // Get the table element
  const table = document.getElementById('tourTable');
  
  // Create a copy of the inner HTML of the table
  const tableHTML = table.outerHTML;

  // Create a temporary element to hold the HTML
  const tempElement = document.createElement('div');
  tempElement.innerHTML = tableHTML;

  // You can now use the tableHTML in an email, or
  // here is an example of how you could display it in an alert or console
 console.log(tableHTML); // Just to verify the output
  
  // Now let's open the default email client (this is an example)
  window.open('mailto:?subject=Тур &body=' + encodeURIComponent(tempElement.innerHTML));
}*/

/*function copyTableToEmail() {
  // Get the table element
  const table = document.getElementById('tourTable');
  
  // Create a copy of the inner HTML of the table
  const tableHTML = table.outerHTML;

  // Copy tableHTML to clipboard
  navigator.clipboard.writeText(tableHTML).then(() => {
   alert('Таблица успешно скопирована! Откройте почтовый клиент, создайте письмо, и вставьте код HTML (меню Вставить-HTML');
    
  }).catch(err => {
    alert.error('Не получилось скопировать таблицу: ', err);
  });
}*/

javascript;
function copyTableToEmail() {
  // Получаем таблицу и значения input элементов
  const table = document.getElementById('tourTable');
  const exchangeRate = document.getElementById('exchangeRate').value;
  const currencySelect = document.getElementById('currencySelect').value;

  // Клонируем таблицу для последующих изменений
  const clonedTable = table.cloneNode(true);

  // Обновляем значения в клонированной таблице
  clonedTable.querySelector('#exchangeRate').setAttribute('value', exchangeRate);
  const currencyOptions = clonedTable.querySelector('#currencySelect').options;
  for (let i = 0; i < currencyOptions.length; i++) {
    if (currencyOptions[i].value === currencySelect) {
      currencyOptions[i].setAttribute('selected', 'selected');
    } else {
      currencyOptions[i].removeAttribute('selected');
    }
  }

  // Преобразуем таблицу в HTML
  const tableHtml = clonedTable.outerHTML;

  // Подготавливаем email
  const emailBody = `Таблица: <br><br>${tableHtml}`;

  // Copy tableHTML to clipboard
  navigator.clipboard
    .writeText(emailBody)
    .then(() => {
      alert(
        'Таблица успешно скопирована! Откройте почтовый клиент, создайте письмо, и вставьте код HTML (меню Вставить-HTML',
      );
    })
    .catch((err) => {
      alert.error('Не получилось скопировать таблицу: ', err);
    });
}
