//import

import { getProducts } from "../script/ApiServices/apiService.js";

//fetching by using axios

async function fetchData() {
  try {
    const res = await getProducts();
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
      `,
    )
    .join("");
    const itemCards = itemDiv.getElementsByClassName("itemCard");
  Array.from(itemCards).forEach((itemCard, index) => {
    itemCard.addEventListener("click", () => {
      const selectedItem = data[index];

      let selectedItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const isItemInCart = selectedItems.some(
        (item) => item.id === selectedItem.id
      );
      if (isItemInCart) {
        alert("Item is already added to the cart.");
        return;
      }
      selectedItems.push(selectedItem);
      localStorage.setItem("cartItems", JSON.stringify(selectedItems));
      displayCartItems();
    });
  });
    
    

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

//cart func

function displayCartItems() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems"));
  if (cartItems && cartItems.length > 0) {
    const cartItemsDiv = document.getElementById("cartItems");
    cartItemsDiv.innerHTML =  `
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
            <button id="resetBtn"><i class="fa-solid fa-power-off"></i>  Reset</button>
            <button><i class="fa-solid fa-file-invoice-dollar fa-sm"></i>  Invoice</button>
            </div>
        </footer>
      </div>
        `
        const resetBtn = document.getElementById('resetBtn')
        resetBtn.addEventListener('click',()=>{
          localStorage.removeItem("cartItems");
          displayCartItems()
        })
     let index = 1
      ChoosedItems.innerHTML += cartItems.map((item)=> `
      <header class="d-flex gap-3 justify-content-start">
    <div class="col-2"> 
          <p>${item.name} #${item.id}</p>
    </div>
    <div class="col-1"> 
          <p>${item.price}$</p>
    </div>
    <div class="col-4 d-flex gap-2"> 
        <button class="decrement-btn">-</button>
        <div><span>${index}</span></div>
        <button class="increment-btn">+</button>
    </div>
    <div class="col-1"> 
        <p id="subtotal"></p>
    </div>
    <div class="col-2">
          <button id="deleteBtn"><i class="fa-solid fa-trash"></i></button>
    </div>
</header>
      `
      ).join('')
      const decrementBtns = document.querySelectorAll('.decrement-btn')
      const incrementBtns = document.querySelectorAll('.increment-btn')
      const deleteBts = document.querySelectorAll("#deleteBtn");
      console.log(index)

      deleteBts.forEach((deleteButton, index) => {
        deleteButton.addEventListener("click", () => {
          const selectedItem = cartItems[index];
          const updatedCartItems = cartItems.filter(
            (item) => item.id !== selectedItem.id
          );
          localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    
          // Re-display the cart items
          displayCartItems();
        });
      });
  } else{
    const cartItemsDiv = document.getElementById("cartItems");
    cartItemsDiv.innerHTML=`
    <h1>No items in cart!</h1>`
  }
}

displayCartItems()

document.addEventListener('DOMContentLoaded', () => {
  displayCartItems()
})





