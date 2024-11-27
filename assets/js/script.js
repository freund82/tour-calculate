


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