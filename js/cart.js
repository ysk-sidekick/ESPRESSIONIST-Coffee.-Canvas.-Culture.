/**
 * Cart functionality for Espressionist e-commerce site
 */

// Import utility functions
import { formatting, notifications, cart as cartUtils } from "./utils.js"
import { getCart, saveCart, removeFromCart } from "./storage.js"

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the cart
  loadCart()

  // Add event listener for quantity changes and remove buttons
  document.getElementById("cart-items").addEventListener("click", handleCartActions)
})

/**
 * Load cart data from localStorage and render it
 */
function loadCart() {
  // Show loading state
  showLoadingState()

  // Simulate network delay (remove in production)
  setTimeout(() => {
    // Get cart items from localStorage
    const cartItems = getCart()

    // Hide loading state
    hideLoadingState()

    // Show/hide empty cart message or cart items based on cart content
    const emptyCartElement = document.getElementById("empty-cart")
    const cartItemsContainer = document.getElementById("cart-items-container")

    if (cartItems.length === 0) {
      emptyCartElement.style.display = "block"
      cartItemsContainer.style.display = "none"
      return
    } else {
      emptyCartElement.style.display = "none"
      cartItemsContainer.style.display = "block"
    }

    // Render cart items
    renderCartItems(cartItems)

    // Calculate and update totals
    updateCartTotals(cartItems)
  }, 500) // Simulated delay of 500ms
}

/**
 * Show loading state for cart
 */
function showLoadingState() {
  const loadingElement = document.getElementById("cart-loading")
  if (loadingElement) {
    loadingElement.style.display = "flex"
  }
}

/**
 * Hide loading state for cart
 */
function hideLoadingState() {
  const loadingElement = document.getElementById("cart-loading")
  if (loadingElement) {
    loadingElement.style.display = "none"
  }
}

/**
 * Render cart items in the cart table
 * @param {Array} cartItems - Array of cart items
 */
function renderCartItems(cartItems) {
  const cartItemsElement = document.getElementById("cart-items")
  // Clear previous content except loading element
  const loadingElement = document.getElementById("cart-loading")
  cartItemsElement.innerHTML = ""
  if (loadingElement) {
    cartItemsElement.appendChild(loadingElement)
  }

  // Create document fragment for better performance
  const fragment = document.createDocumentFragment()

  cartItems.forEach((item) => {
    const itemTotal = item.price * item.quantity

    // Create cart row element
    const cartRow = document.createElement("div")
    cartRow.className = "cart-row"
    cartRow.dataset.id = item.id

    cartRow.innerHTML = `
      <div class="cart-cell product-cell">
        <div class="cart-product-info">
          <div class="cart-product-details">
            <h3 class="cart-product-name">${item.name}</h3>
          </div>
        </div>
      </div>
      <div class="cart-cell quantity-cell">
        <div class="cart-quantity">
          <button class="quantity-btn decrease-quantity" data-id="${item.id}" aria-label="Decrease quantity">-</button>
          <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}" aria-label="Product quantity">
          <button class="quantity-btn increase-quantity" data-id="${item.id}" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div class="cart-cell price-cell" data-label="Price">${formatting.currency(item.price)}</div>
      <div class="cart-cell total-cell" data-label="Total">${formatting.currency(itemTotal)}</div>
      <div class="cart-cell action-cell">
        <button class="remove-btn" data-id="${item.id}" aria-label="Remove ${item.name} from cart">
          <i class="fas fa-trash-alt"></i>
          <span class="remove-text">Remove</span>
        </button>
      </div>
    `

    fragment.appendChild(cartRow)
  })

  cartItemsElement.appendChild(fragment)

  // Add event listeners for quantity inputs
  const quantityInputs = document.querySelectorAll(".quantity-input")
  quantityInputs.forEach((input) => {
    input.addEventListener("change", handleQuantityChange)
  })
}

/**
 * Handle cart actions (increase/decrease quantity, remove item)
 * @param {Event} event - The click event
 */
function handleCartActions(event) {
  const target = event.target

  // Handle increase quantity button
  if (target.classList.contains("increase-quantity") || target.closest(".increase-quantity")) {
    const button = target.classList.contains("increase-quantity") ? target : target.closest(".increase-quantity")
    const itemId = button.getAttribute("data-id")
    updateItemQuantity(itemId, 1)
  }

  // Handle decrease quantity button
  if (target.classList.contains("decrease-quantity") || target.closest(".decrease-quantity")) {
    const button = target.classList.contains("decrease-quantity") ? target : target.closest(".decrease-quantity")
    const itemId = button.getAttribute("data-id")
    updateItemQuantity(itemId, -1)
  }

  // Handle remove button
  if (target.classList.contains("remove-btn") || target.closest(".remove-btn")) {
    const removeBtn = target.classList.contains("remove-btn") ? target : target.closest(".remove-btn")
    const itemId = removeBtn.getAttribute("data-id")

    // Add loading state to the button
    removeBtn.classList.add("btn-loading")

    // Simulate network delay (remove in production)
    setTimeout(() => {
      removeCartItem(itemId)
    }, 300)
  }
}

/**
 * Handle quantity input change
 * @param {Event} event - The change event
 */
function handleQuantityChange(event) {
  const input = event.target
  const itemId = input.getAttribute("data-id")
  const newQuantity = Number.parseInt(input.value, 10)

  if (newQuantity < 1) {
    input.value = 1
    updateCartItemQuantity(itemId, 1)
  } else {
    // Show loading state
    const cartRow = input.closest(".cart-row")
    if (cartRow) {
      cartRow.classList.add("updating")
    }

    // Simulate network delay (remove in production)
    setTimeout(() => {
      updateCartItemQuantity(itemId, newQuantity)

      // Update the row total immediately for better UX
      const priceCell = cartRow.querySelector(".price-cell")
      const totalCell = cartRow.querySelector(".total-cell")
      if (priceCell && totalCell) {
        const price = Number.parseFloat(priceCell.textContent.replace("₱", ""))
        const newTotal = price * newQuantity
        totalCell.textContent = formatting.currency(newTotal)
      }

      // Remove loading state
      if (cartRow) {
        cartRow.classList.remove("updating")
      }
    }, 300)
  }
}

/**
 * Update item quantity in localStorage and reload the cart
 * @param {string} itemId - The item ID
 * @param {number} newQuantity - The new quantity
 */
function updateCartItemQuantity(itemId, newQuantity) {
  const cartItems = getCart()
  const itemIndex = cartItems.findIndex((item) => item.id === itemId)

  if (itemIndex !== -1) {
    cartItems[itemIndex].quantity = newQuantity

    // Update localStorage
    saveCart(cartItems)

    // Reload cart to reflect changes
    loadCart()
  }
}

/**
 * Update item quantity by increment/decrement
 * @param {string} itemId - The item ID
 * @param {number} change - The quantity change (1 or -1)
 */
function updateItemQuantity(itemId, change) {
  // Find the quantity button that was clicked
  const button = document.querySelector(
    `.quantity-btn[data-id="${itemId}"]${change > 0 ? ".increase-quantity" : ".decrease-quantity"}`,
  )

  // Add loading state to the button
  if (button) {
    button.classList.add("btn-loading")
  }

  // Simulate network delay (remove in production)
  setTimeout(() => {
    const cartItems = getCart()
    const itemIndex = cartItems.findIndex((item) => item.id === itemId)

    if (itemIndex !== -1) {
      cartItems[itemIndex].quantity += change

      // Ensure quantity is at least 1
      if (cartItems[itemIndex].quantity < 1) {
        cartItems[itemIndex].quantity = 1
      }

      // Update localStorage
      saveCart(cartItems)

      // Reload cart to reflect changes
      loadCart()
    }
  }, 300)
}

/**
 * Remove an item from the cart
 * @param {string} itemId - The item ID to remove
 */
function removeCartItem(itemId) {
  const cartItems = getCart()
  const itemToRemove = cartItems.find((item) => item.id === itemId)
  const itemName = itemToRemove ? itemToRemove.name : "Item"

  // Remove item from cart
  if (removeFromCart(itemId)) {
    // Show toast notification
    notifications.showToast(`${itemName} has been removed from your cart.`, "View Cart", "cart.html")
  }

  // Reload cart to reflect changes
  loadCart()
}

/**
 * Calculate and update cart totals
 * @param {Array} cartItems - Array of cart items
 */
function updateCartTotals(cartItems) {
  // Calculate totals using the utility function
  const { subtotal, tax, total } = cartUtils.calculateTotals(cartItems)

  // Update the DOM
  document.getElementById("cart-subtotal").textContent = formatting.currency(subtotal)
  document.getElementById("cart-tax").textContent = formatting.currency(tax)
  document.getElementById("cart-total").textContent = formatting.currency(total)
}
