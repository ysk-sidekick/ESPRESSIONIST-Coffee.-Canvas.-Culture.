/**
 * Utility functions for Espressionist e-commerce site
 * Contains shared helper functions used across multiple pages
 */

/**
 * URL utilities
 */
export const url = {
  /**
   * Get URL parameter by name
   * @param {string} name - Parameter name
   * @returns {string|null} - Parameter value or null if not found
   */
  getParameter: (name) => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(name)
  },
}

/**
 * Formatting utilities
 */
export const formatting = {
  /**
   * Format currency to Philippine Peso
   * @param {number} amount - Amount to format
   * @returns {string} - Formatted currency string
   */
  currency: (amount) => `₱${amount.toFixed(2)}`,

  /**
   * Format date to a readable string
   * @param {Date} date - Date object
   * @param {boolean} includeTime - Whether to include time in the formatted string
   * @returns {string} - Formatted date string
   */
  date: (date, includeTime = false) => {
    if (!(date instanceof Date)) {
      date = new Date(date)
    }

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    }

    if (includeTime) {
      options.hour = "2-digit"
      options.minute = "2-digit"
    }

    return date.toLocaleDateString("en-US", options)
  },
}

/**
 * Cart utilities
 */
export const cart = {
  /**
   * Calculate cart totals
   * @param {Array} cartItems - Array of cart items
   * @returns {Object} - Object with subtotal, tax, and total
   */
  calculateTotals: (cartItems) => {
    const subtotal = cartItems.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)

    const tax = subtotal * 0.12 // 12% VAT
    const total = subtotal + tax

    return {
      subtotal,
      tax,
      total,
    }
  },

  /**
   * Get cart count (total number of items)
   * @returns {number} - Total number of items in cart
   */
  getCount: () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || []
    return cart.reduce((total, item) => total + item.quantity, 0)
  },
}

/**
 * Notification utilities
 */
export const notifications = {
  /**
   * Show a toast message
   * @param {string} message - Message to display
   * @param {string} linkText - Text for the link (optional)
   * @param {string} linkHref - URL for the link (optional)
   * @param {number} duration - Duration in ms to show the message (optional)
   */
  showToast: (message, linkText = null, linkHref = null, duration = 3000) => {
    // Check if a message already exists
    let messageElement = document.querySelector(".toast-message")

    if (!messageElement) {
      // Create message element if it doesn't exist
      messageElement = document.createElement("div")
      messageElement.className = "toast-message"

      // Create HTML content
      let htmlContent = `<i class="fas fa-check-circle"></i>${message}`

      // Add link if provided
      if (linkText && linkHref) {
        htmlContent += `<a href="${linkHref}">${linkText}</a>`
      }

      messageElement.innerHTML = htmlContent

      // Add styles
      Object.assign(messageElement.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        backgroundColor: "#4caf50",
        color: "white",
        padding: "15px 20px",
        borderRadius: "5px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        zIndex: "1000",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      })

      // Style the link if it exists
      if (linkText && linkHref) {
        const link = messageElement.querySelector("a")
        Object.assign(link.style, {
          color: "white",
          fontWeight: "bold",
          marginLeft: "10px",
          textDecoration: "underline",
        })
      }

      // Add to body
      document.body.appendChild(messageElement)

      // Remove after duration
      setTimeout(() => {
        messageElement.style.opacity = "0"
        messageElement.style.transition = "opacity 0.5s ease"
        setTimeout(() => {
          if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement)
          }
        }, 500)
      }, duration)
    }
  },

  /**
   * Show a message when product is added to cart
   * @param {Object} product - Product that was added
   * @param {number} quantity - Quantity added
   */
  showAddToCartMessage: (product, quantity = 1) => {
    // Check if a message already exists
    let messageElement = document.querySelector(".add-to-cart-message")

    if (!messageElement) {
      // Create message element if it doesn't exist
      messageElement = document.createElement("div")
      messageElement.className = "add-to-cart-message"

      // Use innerHTML only once for better performance
      messageElement.innerHTML = `
        <i class="fas fa-check-circle"></i>
        Added ${quantity} ${quantity === 1 ? "item" : "items"} of ${product.name} to your cart!
        <a href="cart.html">View Cart</a>
      `

      // Add styles
      Object.assign(messageElement.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        backgroundColor: "#4caf50",
        color: "white",
        padding: "15px 20px",
        borderRadius: "5px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        zIndex: "1000",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      })

      // Style the link
      const link = messageElement.querySelector("a")
      Object.assign(link.style, {
        color: "white",
        fontWeight: "bold",
        marginLeft: "10px",
        textDecoration: "underline",
      })

      // Add to body
      document.body.appendChild(messageElement)

      // Remove after 3 seconds
      setTimeout(() => {
        messageElement.style.opacity = "0"
        messageElement.style.transition = "opacity 0.5s ease"
        setTimeout(() => {
          if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement)
          }
        }, 500)
      }, 3000)
    }
  },
}

/**
 * Form validation utilities
 */
export const validation = {
  /**
   * Show error message for a specific field
   * @param {string} elementId - ID of the error element
   * @param {string} message - Error message to display
   */
  showError: (elementId, message) => {
    const errorEl = document.getElementById(elementId)
    if (!errorEl) return

    errorEl.textContent = message
    errorEl.style.display = "block"
    errorEl.classList.add("visible")
  },

  /**
   * Clear error message for a specific field
   * @param {string} elementId - ID of the error element
   */
  clearError: (elementId) => {
    const errorEl = document.getElementById(elementId)
    if (!errorEl) return

    errorEl.textContent = ""
    errorEl.style.display = "none"
    errorEl.classList.remove("visible")
  },

  /**
   * Clear all error messages
   */
  clearErrors: () => {
    document.querySelectorAll(".error-message").forEach((el) => {
      el.textContent = ""
      el.style.display = "none"
      el.classList.remove("visible")
    })
  },
}

/**
 * Order utilities
 */
export const orders = {
  /**
   * Find order in localStorage by tracking code or order ID
   * @param {string} orderId - Order ID or tracking code to search for
   * @returns {Object|null} - Order object or null if not found
   */
  findOrder: (orderId) => {
    const orders = JSON.parse(localStorage.getItem("orders")) || []
    return orders.find((order) => order.orderId === orderId) || null
  },

  /**
   * Generate a random tracking code
   * @param {number} length - Length of the tracking code
   * @param {string} prefix - Optional prefix for the tracking code
   * @returns {string} - Random tracking code
   */
  generateTrackingCode: (length = 6, prefix = "") => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let trackingCode = prefix

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      trackingCode += characters.charAt(randomIndex)
    }

    return trackingCode
  },
}

// For backward compatibility, also export these functions directly
export function getUrlParameter(name) {
  return url.getParameter(name)
}

export function findOrder(orderId) {
  return orders.findOrder(orderId)
}

export function formatCurrency(amount) {
  return formatting.currency(amount)
}

export function formatDate(date, includeTime = false) {
  return formatting.date(date, includeTime)
}

export function showError(elementId, message) {
  return validation.showError(elementId, message)
}

export function clearError(elementId) {
  return validation.clearError(elementId)
}

export function clearErrors() {
  return validation.clearErrors()
}

export function showToastMessage(message, linkText, linkHref, duration) {
  return notifications.showToast(message, linkText, linkHref, duration)
}

export function showAddToCartMessage(product, quantity) {
  return notifications.showAddToCartMessage(product, quantity)
}

export function generateTrackingCode(length, prefix) {
  return orders.generateTrackingCode(length, prefix)
}

export function calculateCartTotals(cartItems) {
  return cart.calculateTotals(cartItems)
}
