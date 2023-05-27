


async function fetchData(){
    try{
        const res = await fetch('https://hplussport.com/api/products/order/price')
        const data = await res.json()
        console.log(data)


        displayData(data)
    } catch (error) {
        console.error('Error:', error);
      }
}

function displayData(data){
    const itemDiv = document.getElementById('items')
    itemDiv.innerHTML = data
    .map((item) => `
    <div class="itemCard">
        <img src="${item.image}">
        <p class="title">${item.name}</p>
        <div>
        <p>#${item.id}</p>
        </div>
        <p class="price px-2">${item.price}$</p>
    </div>
  </div>
    `).join("")
}

fetchData()