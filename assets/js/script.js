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

//var cost=[...document.querySelectorAll(".price")];
var cost=document.querySelectorAll(".price");
var total=document.querySelector("#total");


function calculateTotal() {
  var sum=0;
  for (let index = 0; index < cost.length; index++) {
    sum+=Number(cost[index].value);
  }
  total.value=sum;
}



function addRow() {
  row.insertAdjacentHTML( "afterbegin", newRow.innerHTML );
  console.log(row.children.length-1)
  console.log(y)
}
var y=[]

function removeRow() {
    (row.children.length-1>1)?row.removeChild(row.firstChild):null;
  for(var i=0; i<row.children.length-1; i++){
    y.push(cost[i].value)
    console.log(y)
  }
}

