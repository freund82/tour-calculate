let db;
let SQL;

// Инициализация базы данных
async function initDatabase() {
  try {
    // Указываем, откуда подгружать wasm-файл
    SQL = await initSqlJs({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/sql.js@1.8.0/dist/${file}`,
    });

    db = new SQL.Database();

    // Создаем таблицу расчет инд.тура
    db.run(`
            CREATE TABLE IF NOT EXISTS tourCalculate (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tourName TEXT NOT NULL,
                date TEXT NOT NULL,
                accomodation TEXT NOT NULL,
                quantity INTEGER,
                price INTEGER,
                exchangeRate INTEGER,
                currencySelect TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

    console.log('База данных инициализирована');
    /*loadTourCalculate();*/
  } catch (error) {
    console.error('Ошибка инициализации БД:', error);
  }
}

// Сохранение данных (вызывается по кнопке)
document.getElementById('saveBtn').addEventListener('click', function () {
  const rows = document.querySelectorAll('#tourTable tbody tr');
  const tourName = document.getElementById('tourName').value.trim();

  if (!tourName) {
    alert('Введите название тура!');
    return;
  }

  let success = true;
  rows.forEach((row) => {
    const tourCalculate = {
      tourName: tourName,
      date: row.querySelector('.date').value,
      accomodation: row.querySelector('.accomodation').value,
      quantity: parseInt(row.querySelector('.quantity').value) || 0,
      price: parseFloat(row.querySelector('.price').value) || 0,
      exchangeRate: parseFloat(document.getElementById('exchangeRate').value) || 1,
      currencySelect: document.getElementById('currencySelect').value,
    };

    if (!addTourCalculateData(tourCalculate)) {
      success = false;
    }
  });

  if (success) {
    exportDatabase(); // Автоматически скачиваем обновленный файл
    alert('Данные успешно сохранены и файл скачан!');
  } else {
    alert('Произошли ошибки при сохранении некоторых данных');
  }
});

// Добавление данных в базу
function addTourCalculateData(tourCalculate) {
  console.log(tourCalculate);
  try {
    // Вставляем данные в базу
    const stmt = db.prepare(`
            INSERT INTO tourCalculate (tourName, date, accomodation, quantity, price, exchangeRate, currencySelect) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

    stmt.bind([
      tourCalculate.tourName,
      tourCalculate.date,
      tourCalculate.accomodation,
      tourCalculate.quantity,
      tourCalculate.price,
      tourCalculate.exchangeRate,
      tourCalculate.currencySelect,
    ]);
    stmt.step();
    stmt.free();

    alert('Данные успешно сохранены!', 'success');
    closeModal();
    return true;
  } catch (error) {
    alert('Произошла ошибка при сохранении данных.');
    console.error('Ошибка при сохранении данных', error);
    return false;
  }
}

// Скачивание базы как файла
function exportDatabase() {
  if (!db) {
    alert('Нет данных для экспорта');
    return;
  }

  const data = db.export();
  const blob = new Blob([data], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'tours_database.sqlite';
  a.click();

  URL.revokeObjectURL(url);
}

initDatabase();

//Выгрузка данных из файла
// Загрузка базы из файла
function importDatabase(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const arrayBuffer = e.target.result;
      const uint8Array = new Uint8Array(arrayBuffer);

      // Заменяем текущую БД на загруженную
      db = new SQL.Database(uint8Array);

      console.log('✅ База загружена из файла');
      alert('Данные успешно загружены из файла!');
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      alert('Ошибка при загрузке файла. Возможно, файл поврежден.');
    }
  };
  reader.readAsArrayBuffer(file);
}

function addRow(button) {
  // Clone the row containing the button
  const row = button.parentElement.parentElement.cloneNode(true);

  // Get the row that contains the button
  const currentRow = button.parentElement.parentElement;

  // Insert the new row after the current row
  const tbody = document.querySelector('#tourTable tbody');
  tbody.insertBefore(row, currentRow.nextSibling);

  // Optionally, clear any input fields in the cloned row
  Array.from(row.querySelectorAll('input')).forEach((input) => {
    input.value = '';
  });
  Array.from(row.querySelectorAll('textarea')).forEach((textarea) => {
    textarea.value = '';
  });
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

/*function save() {
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
}*/

/*function showModal() {
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
}*/

document.getElementById('closeModalButton').onclick = function () {
  closeModal();
};

function closeModal() {
  document.getElementById('toursModal').style.display = 'none';
}

function showModal() {
  const toursList = document.getElementById('toursList');
  toursList.innerHTML = '';

  try {
    const result = db.exec(`
      SELECT DISTINCT tourName 
      FROM tourCalculate 
      ORDER BY created_at DESC
    `);

    if (result.length > 0 && result[0].values.length > 0) {
      result[0].values.forEach(([tourName]) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.style.cursor = 'pointer';
        li.textContent = tourName;
        li.onclick = () => loadTourData(tourName);
        toursList.appendChild(li);
      });
    } else {
      toursList.innerHTML = '<li class="list-group-item">Нет сохраненных туров</li>';
    }
  } catch (error) {
    console.error('Ошибка загрузки списка туров:', error);
  }

  document.getElementById('toursModal').style.display = 'block';
}
// Загрузка данных тура
function loadTourData(tourName) {
  try {
    const result = db.exec(
      `
      SELECT * FROM tourCalculate 
      WHERE tourName = ? 
      ORDER BY id
    `,
      [tourName],
    );

    if (result.length > 0) {
      displayTourData(result[0].values);
      closeModal();
    }
  } catch (error) {
    console.error('Ошибка загрузки тура:', error);
  }
}

// Отображение данных тура в таблице
function displayTourData(data) {
  const tbody = document.querySelector('#tourTable tbody');
  tbody.innerHTML = '';

  // Устанавливаем общие значения из первой записи
  if (data.length > 0) {
    document.getElementById('tourName').value = data[0][1];
    document.getElementById('exchangeRate').value = data[0][6];
    document.getElementById('currencySelect').value = data[0][7];
  }

  // Создаем строки для каждой записи
  data.forEach((rowData) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td><input class="date" type="text" value="${rowData[2]}" style="border:none"></td>
      <td><textarea class="accomodation" style="border:none; width: 20rem;">${rowData[3]}</textarea></td>
      <td><input type="number" class="quantity" value="${rowData[4]}" style="border:none;"></td>
      <td><input type="number" class="price" value="${rowData[5]}" style="border:none"></td>
      <td>
        <button type="button" class="btn btn-primary" onclick="addRow(this)">+</button>
        <button type="button" class="btn btn-success" onclick="removeRow(this)">-</button>
      </td>
    `;
    tbody.appendChild(newRow);
  });

  calculateTotal();
}

function closeModal() {
  document.getElementById('toursModal').style.display = 'none';
}

calculateTotal();

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
