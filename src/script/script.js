import instance from "../script/ApiServices/apiService.js"

async function fetchData() {
  try {
    const data = await instance();
      displayData(data);
  } catch (error) {
    console.error('Error:', error);
  }
  }
  
  function displayData(data) {
    const itemDiv = document.getElementById('items');
    itemDiv.innerHTML = data
      .map((item) => `
        <div class="p-3 itemCard pb-4 d-flex flex-column gap-2">
          <img src="${item.image}">
          <p class="title">${item.name}</p>
          <div class="id">
            <p>#${item.id}</p>
          </div>
          <p class="price px-2">${item.price}$</p>
        </div>
      `)
      .join('');
  }
  
  function searchItems() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase(); 
    if (searchInput) {
      fetch('https://hplussport.com/api/products/order/price')
        .then((res) => res.json())
        .then((data) => {
          const searchItem = data.filter(item => item.name.toLowerCase().includes(searchInput)); 
  
          const itemDiv = document.getElementById('items');
          if (searchItem.length > 0) {
            itemDiv.innerHTML = searchItem
              .map((item) => `
                <div class="p-3 itemCard pb-4 d-flex flex-column gap-2">
                  <img src="${item.image}">
                  <p class="title">${item.name}</p>
                  <div class="id">
                    <p>#${item.id}</p>
                  </div>
                  <p class="price px-2">${item.price}$</p>
                </div>
              `)
              .join('');
          }else if(searchInput.length === 0){
            displayData(data)
          } 
          else {
            itemDiv.innerHTML = `
            <p>There are no item with that name</p>
            `
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }
  document.getElementById('searchInput').addEventListener('input', searchItems);
  
  fetchData();
  