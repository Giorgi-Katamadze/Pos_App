//import

import { getProducts } from "../script/ApiServices/apiService.js";

//fetching by using axios

async function fetchData() {
  try {
    const res = await getProducts();
    console.log(res)
    const data = res.data
    console.log(data)
    displayData(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

//display data items

function displayData(data) {
  const itemDiv = document.getElementById("items");
  itemDiv.innerHTML = data
    .map(
      (item) => `
        <div class="p-3 itemCard pb-4 d-flex flex-column gap-2">
          <img src="${item.image}">
          <p class="title">${item.name}</p>
          <div class="id">
            <p>#${item.id}</p>
          </div>
          <p class="price px-2">${item.price}$</p>
        </div>
      `
    )
    .join("");

    //allow user search for items

function searchItems(data) {
  const dataArray = Array.from(data)
  const searchInput = document.getElementById("searchInput").value.toLowerCase();
  const filteredData = dataArray.filter(item => item.name.toLowerCase().includes(searchInput))
  const itemDiv = document.getElementById("items");

  if(searchInput.length > 0){
      itemDiv.innerHTML = filteredData
        .map(
          (item) => `
            <div class="p-3 itemCard pb-4 d-flex flex-column gap-2">
              <img src="${item.image}">
              <p class="title">${item.name}</p>
              <div class="id">
                <p>#${item.id}</p>
              </div>
              <p class="price px-2">${item.price}$</p>
            </div>
          `
        )
        .join("");
    } else if (searchInput.length === 0) {
      displayData(data);
    } else if(filteredData.length === 0){
      itemDiv.innerHTML = `
        <p>There are no item with that name</p>
        `;
    }
}
document.getElementById("searchInput").addEventListener("input", () => {
  searchItems(data);
});
}

fetchData();

//add to cart func

const selectedItems = [];

function addToCart(data) {
  const itemDiv = document.getElementById("items");
  itemDiv.addEventListener("click", (event) => {
    const clickedItem = event.target.closest(".itemCard");
    if (clickedItem) {
      // targer elements
      const itemName = clickedItem.querySelector(".title").textContent;
      const itemId = clickedItem.querySelector(".id").textContent;
      const itemPrice = clickedItem.querySelector(".price").textContent;
      const selectedItem = {
        name: itemName,
        id: itemId,
        price: itemPrice,
      };
      // Check if item is already in the cart
      const isItemInCart = selectedItems.some(
        (item) => item.id === selectedItem.id
      );
      if (isItemInCart) {
        alert("Item is already added to the cart.");
        return;
      }
      selectedItems.push(selectedItem);
      // import html element
      const cartItems = document.getElementById("cartItems");
      cartItems.innerHTML = `
      <div>
      <header class="d-flex gap-3 justify-content-around">
            <div> 
                  <h6>Product</h6>
            </div>
            <div> 
                  <h6>Price</h6>
            </div>
            <div> 
                  <h6>Qty</h6>
            </div>
            <div> 
                  <h6>Subtotal</h6>
            </div>
            <div>
                  <h6>Action</h6>
            </div>
      </header>
        <div id="ChoosedItems"></div>
        <div class="d-flex justify-content-around flex-wrap gap-3 col-10 mx-auto">
            <div class="d-flex flex-column col-4">
            <label>Tax %</label>
            <input>
            </div>
            <div class="d-flex flex-column col-4">
            <label>Discount %</label>
            <input>
            </div>
            <div class="d-flex flex-column col-4">
            <label>Shipping %</label>
            <input>
            </div>
        </div>
        <footer class="my-3">
            <h1 class="col-8">Total price:</h1>
            <div class="d-flex justify-content-around col-10 mx-auto">
            <button><i class="fa-solid fa-power-off"></i>  Reset</button>
            <button><i class="fa-solid fa-file-invoice-dollar fa-sm"></i>  Invoice</button>
            </div>
        </footer>
      </div>
      `;
      const ChoosedItems = cartItems.querySelector("#ChoosedItems");
      ChoosedItems.innerHTML += selectedItems
        .map(
          (item) => `
      <header class="d-flex gap-3 justify-content-around">
            <div> 
                  
                  <p>${item.name}</p>
            </div>
            <div> 
                  
                  <p>${item.price}</p>
            </div>
            <div> 
                  
            </div>
            <div> 
                  
            </div>
            <div>
                  <button><i class="fa-solid fa-trash"></i></button>
            </div>
      </header>
      `
        )
        .join("");
    }
  });
}
addToCart();
