var newRow = document.createElement("tr");
newRow.innerHTML = `
<tr class="data">
    <td scope="row"><input class="date" type="text" style="border:none"></td>
    <td><input type="text" class="accomodation" style="border:none"></td>
    <td><input type="text" class="quantity" style="border:none"></td>
    <td><input type="text" class="price" style="border:none"></td>
    <td>
        <button type="button" class="btn btn-primary">+</button>
        <button type="button" class="btn btn-success" >-</button>
    </td>
</tr>
`;

var row=document.querySelector(".data").parentNode;


function addRow() {
  row.insertAdjacentHTML( "afterbegin", newRow.innerHTML );
  console.log(row.children.length-1)
}

function removeRow() {
    (row.children.length-1>1)?row.removeChild(row.firstChild):null;
}

