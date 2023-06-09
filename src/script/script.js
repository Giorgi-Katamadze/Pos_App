//import

import { getProducts } from "../script/ApiServices/apiService.js";

//fetching by using axios

async function fetchData() {
  try {
    const data = await getProducts();
    displayData(data.data);
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
}

//allow user search for items

function searchItems(event) {
  // event.preventDefault()
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  if (searchInput) {
    fetch("https://hplussport.com/api/products/order/price")
      .then((res) => res.json())
      .then((data) => {
        const searchItem = data.filter((item) =>
          item.name.toLowerCase().includes(searchInput)
        );

        const itemDiv = document.getElementById("items");
        if (searchItem.length > 0) {
          itemDiv.innerHTML = searchItem
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
        } else {
          itemDiv.innerHTML = `
            <p>There are no item with that name</p>
            `;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
document.getElementById("searchInput").addEventListener("input", searchItems);

fetchData();

//add to cart func

const selectedItems = [];

function addToCart() {
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
      const cartItems = document.getElementById('cartItems')
      cartItems.innerHTML = `
      <div>
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
      `
      const ChoosedItems = cartItems.querySelector("#ChoosedItems")
      ChoosedItems.innerHTML += selectedItems.map((item) =>`
      <header class="d-flex gap-3 justify-content-around">
            <div> 
                  <h6>Product</h6>
                  <p>${item.name}</p>
            </div>
            <div> 
                  <h6>Price</h6>
                  <p>${item.price}</p>
            </div>
            <div> 
                  <h6>Qty</h6>
            </div>
            <div> 
                  <h6>Subtotal</h6>
            </div>
            <div>
                  <h6>Action</h6>
                  <button><i class="fa-solid fa-trash"></i></button>
            </div>
      </header>
      `)
      .join('')
    }
  });
}
addToCart()