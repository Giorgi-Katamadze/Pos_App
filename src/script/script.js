// import
import { getProducts } from "../script/ApiServices/apiService.js";

// fetching by using axios
async function fetchData() {
  try {
    const res = await getProducts();
    const data = res.data;
    console.log(data);
    displayData(data);
    displayCartItems(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// display data items
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
      selectedItem.quantity = 1; // Set initial quantity
      selectedItems.push(selectedItem);
      localStorage.setItem("cartItems", JSON.stringify(selectedItems));
      displayCartItems(data); // Pass 'data' as a parameter
    });
  });

  // allow user to search for items
  function searchItems(data) {
    const dataArray = Array.from(data);
    const searchInput = document
      .getElementById("searchInput")
      .value.toLowerCase();
    const filteredData = dataArray.filter((item) =>
      item.name.toLowerCase().includes(searchInput)
    );
    const itemDiv = document.getElementById("items");

    if (searchInput.length > 0) {
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
    } else if (filteredData.length === 0) {
      itemDiv.innerHTML = `
        <p>There are no items with that name</p>
        `;
    }
  }
  document.getElementById("searchInput").addEventListener("input", () => {
    searchItems(data);
  });
}

fetchData();

// display cart items
function displayCartItems(data) {
  const cartItems = JSON.parse(localStorage.getItem("cartItems"));
  if (cartItems && cartItems.length > 0) {
    const cartItemsDiv = document.getElementById("cartItems");
    cartItemsDiv.innerHTML = `
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
            <input id="taxInput" type="number" min="0" step="0.01" value="0">
          </div>
          <div class="d-flex flex-column col-4">
            <label>Discount %</label>
            <input id="discountInput" type="number" min="0" step="0.01" value="0">
          </div>
          <div class="d-flex flex-column col-4">
            <label>Shipping %</label>
            <input id="shippingInput" type="number" min="0" step="0.01" value="0">
          </div>
        </div>
        <footer class="my-3">
          <h1 class="col-8">Total price: <span id="totalPrice">0</span>$</h1>
          <div class="d-flex justify-content-around col-10 mx-auto">
            <button id="resetBtn"><i class="fa-solid fa-power-off"></i> Reset</button>
            <button><i class="fa-solid fa-file-invoice-dollar fa-sm"></i> Invoice</button>
          </div>
        </footer>
      </div>
    `;
    const resetBtn = document.getElementById("resetBtn");
    const taxInput = document.getElementById("taxInput");
    const discountInput = document.getElementById("discountInput");
    const shippingInput = document.getElementById("shippingInput");
    const totalPriceSpan = document.getElementById("totalPrice");

    resetBtn.addEventListener("click", () => {
      localStorage.removeItem("cartItems");
      displayCartItems(data);
    });

    const ChoosedItems = document.getElementById("ChoosedItems");
    ChoosedItems.innerHTML = "";
    let subtotalsSum = 0;
    cartItems.forEach((item) => {
      const subtotal = item.price * item.quantity;
      subtotalsSum += subtotal;
      calculateTotalPrice()

      ChoosedItems.innerHTML += `
        <header class="d-flex gap-3 justify-content-start">
          <div class="col-2">
            <p>${item.name} #${item.id}</p>
          </div>
          <div class="col-1">
            <p>${item.price}$</p>
          </div>
          <div class="col-3 d-flex gap-2">
            <button class="decrement-btn">-</button>
            <div class="qty">${item.quantity}</div>
            <button class="increment-btn">+</button>
          </div>
          <div class="col-1">
            <p class="subtotal">${subtotal}$</p>
          </div>
          <div class="col-3 d-flex justify-content-center">
            <button class="deleteBtn"><i class="fa-solid fa-trash"></i></button>
          </div>
        </header>
      `;
    });

    const deleteBtns = document.querySelectorAll(".deleteBtn");
    const decrementBtns = document.querySelectorAll(".decrement-btn");
    const incrementBtns = document.querySelectorAll(".increment-btn");
    const qtyDivs = document.querySelectorAll(".qty");
    const subtotalDivs = document.querySelectorAll(".subtotal");

    deleteBtns.forEach((deleteButton, index) => {
      deleteButton.addEventListener("click", () => {
        cartItems.splice(index, 1);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        displayCartItems(data);
      });
    });

    decrementBtns.forEach((decrementBtn, index) => {
      decrementBtn.addEventListener("click", () => {
        if (cartItems[index].quantity > 1) {
          cartItems[index].quantity--;
          const subtotal = cartItems[index].price * cartItems[index].quantity;
          qtyDivs[index].innerText = cartItems[index].quantity;
          subtotalDivs[index].innerText = `${subtotal}$`;
          localStorage.setItem("cartItems", JSON.stringify(cartItems));
          calculateTotalPrice();
        }
      });
    });

    incrementBtns.forEach((incrementBtn, index) => {
      incrementBtn.addEventListener("click", () => {
        cartItems[index].quantity++;
        const subtotal = cartItems[index].price * cartItems[index].quantity;
        qtyDivs[index].innerText = cartItems[index].quantity;
        subtotalDivs[index].innerText = `${subtotal}$`;
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        calculateTotalPrice();
      });
    });

    taxInput.addEventListener("input", calculateTotalPrice);
    discountInput.addEventListener("input", calculateTotalPrice);
    shippingInput.addEventListener("input", calculateTotalPrice);

    function calculateTotalPrice() {
      const tax = parseFloat(taxInput.value);
      const discount = parseFloat(discountInput.value);
      const shipping = parseFloat(shippingInput.value);
      const subtotalsSum = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const total = subtotalsSum * (1 + tax / 100) * (1 - discount / 100) + shipping;
      totalPriceSpan.innerText = total.toFixed(1);
    
      if (tax.length === 0 || discount.length === 0 || shipping.length === 0) {
        totalPriceSpan.innerText = subtotalsSum.toFixed(1);
      } 

    }
  } else {
    const cartItemsDiv = document.getElementById("cartItems");
    cartItemsDiv.innerHTML = `<p>Your cart is empty.</p>`;
  }
}
