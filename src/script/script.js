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
        <div class="p-3 itemCard pb-4 d-flex col-5 col-md-3 flex-column gap-2">
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
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Item is added to the cart',
        showConfirmButton: false,
        timer: 1500
      })
      const selectedItem = data[index];

      let selectedItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const isItemInCart = selectedItems.some(
        (item) => item.id === selectedItem.id
      );
      if (isItemInCart) {
        Swal.fire(
          'Item is already in the cart',
        )
        return;
      }
      selectedItem.quantity = 1; 
      selectedItems.push(selectedItem);
      localStorage.setItem("cartItems", JSON.stringify(selectedItems));
      displayCartItems(data); 
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
            <label>Shipping:</label>
            <input id="shippingInput" type="number" min="0" step="0.01" value="0">
          </div>
        </div>
        <footer class="my-3">
          <h1 class="col-8">Total price: <span id="totalPrice">0</span>$</h1>
          <div class="d-flex justify-content-around col-10 mx-auto">
            <button id="resetBtn"><i class="fa-solid fa-power-off"></i> Reset</button>
            <button id="invoice"><i class="fa-solid fa-file-invoice-dollar fa-sm"></i> Invoice</button>
          </div>
        </footer>
      </div>
    `;
    const resetBtn = document.getElementById("resetBtn");
    const taxInput = document.getElementById("taxInput");
    const discountInput = document.getElementById("discountInput");
    const shippingInput = document.getElementById("shippingInput");
    const totalPriceSpan = document.getElementById("totalPrice");
    const invoiceBTN = document.getElementById('invoice')

    resetBtn.addEventListener("click", () => {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
          localStorage.removeItem("cartItems");
        displayCartItems(data);
        }
      })
    });

    const ChoosedItems = document.getElementById("ChoosedItems");
    ChoosedItems.innerHTML = "";
    let subtotalsSum = 0;
    cartItems.forEach((item) => {
      const subtotal = item.price * item.quantity;
      subtotalsSum += subtotal;
      calculateTotalPrice();

      ChoosedItems.innerHTML += `
        <header class="d-flex gap-3 justify-content-start">
          <div class="col-2 col-sm-3 col-lg-3">
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
          <div class="col-2">
            <p class="subtotal">${subtotal}$</p>
          </div>
          <div class=" d-flex justify-content-center">
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
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
            cartItems.splice(index, 1);
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            displayCartItems(data);
          }
        })
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
      localStorage.setItem('tax', tax)
      const discount = parseFloat(discountInput.value);
      localStorage.setItem('discount', discount)
      const shipping = parseFloat(shippingInput.value);
      localStorage.setItem('shipping', shipping)
      const subtotalsSum = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const total =
        subtotalsSum * (1 + tax / 100) * (1 - discount / 100) + shipping;
        totalPriceSpan.innerText = total.toFixed(1);
        localStorage.setItem('sum',  total.toFixed(1))
      if (isNaN(tax) || isNaN(discount) || isNaN(shipping)) {
        totalPriceSpan.innerText = subtotalsSum.toFixed(1); 
      }
      invoiceBTN.addEventListener('click', () => {
        const sum = localStorage.getItem('sum');
        const tax = localStorage.getItem('tax');
        const discount = localStorage.getItem('discount');
        const shipping = localStorage.getItem('shipping');
      
        Swal.fire({
          title: 'Invoice',
          html: `
            <p>Total: ${sum}$</p>
            <p>Tax: ${tax}%</p>
            <p>Discount: ${discount}%</p>
            <p>Shipping: ${shipping}$</p>
          `,
          icon: 'info',
          confirmButtonText: 'PURCHASE'
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire('Purchase has been complited!', '', 'success')
          }
        });
      });
      
    }
  } else {
    const cartItemsDiv = document.getElementById("cartItems");
    cartItemsDiv.innerHTML = `<h1>No items in cart!</h1>`;
  }
}
