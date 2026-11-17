/**
 * Konaseema Greens – Mobile Plant Gifting App Script
 * Implements Step 2 (Choose Plant Variety) & Step 3 (Add Big Label & Personal Message)
 * from Reference PDF, with 100% visible scrollable cart and direct WhatsApp enquiry.
 */

document.addEventListener('DOMContentLoaded', () => {

  // Current Selection State
  let selectedBox = {
    id: 'window-box',
    name: 'White Window Box',
    price: 150,
    img: 'designs/design3_window_box.png'
  };

  let selectedPlant = {
    id: 'rose',
    name: 'Red Rose Plant',
    price: 199,
    img: 'plants/rose.jpg'
  };

  let currentBigLabel = 'Happy New Year 2027';
  let currentPersonalMsg = 'Wishing you happiness, good health and prosperity!';
  let currentQty = 1;

  // Cart Data Array
  let cart = [];

  // DOM Elements - Preview
  const previewBoxImg = document.getElementById('previewBoxImg');
  const previewPlantThumb = document.getElementById('previewPlantThumb');
  const previewPlantName = document.getElementById('previewPlantName');
  const previewTagText = document.getElementById('previewTagText');
  const previewMsgText = document.getElementById('previewMsgText');
  const previewSummaryTitle = document.getElementById('previewSummaryTitle');
  const previewSummaryTag = document.getElementById('previewSummaryTag');
  const previewPriceBadge = document.getElementById('previewPriceBadge');

  // DOM Elements - Selection Grids
  const bucketsGrid = document.getElementById('bucketsGrid');
  const plantsGrid = document.getElementById('plantsGrid');

  // DOM Elements - Step 3: Big Label & Message (from PDF)
  const bigLabelInput = document.getElementById('bigLabelInput');
  const personalMessageInput = document.getElementById('personalMessageInput');
  const tagChips = document.querySelectorAll('.chip');

  // DOM Elements - Step 4: Quantity
  const orderQtyInput = document.getElementById('orderQtyInput');
  const qtyMinusBtn = document.getElementById('qtyMinusBtn');
  const qtyPlusBtn = document.getElementById('qtyPlusBtn');
  const itemSubtotalAmt = document.getElementById('itemSubtotalAmt');
  const qtyPresets = document.querySelectorAll('.qty-preset');

  // DOM Elements - Actions & Sticky Bar
  const addCurrentOrderBtn = document.getElementById('addCurrentOrderBtn');
  const addMoreOrdersBtn = document.getElementById('addMoreOrdersBtn');
  const stickyAddToCartBtn = document.getElementById('stickyAddToCartBtn');
  const stickyViewCartBtn = document.getElementById('stickyViewCartBtn');
  const barQtyCount = document.getElementById('barQtyCount');
  const barTotalPrice = document.getElementById('barTotalPrice');
  const bottomCartBadge = document.getElementById('bottomCartBadge');

  // DOM Elements - Cart Drawer Modal
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartItemsList = document.getElementById('cartItemsList');
  const emptyCartState = document.getElementById('emptyCartState');
  const cartAddMoreRow = document.getElementById('cartAddMoreRow');
  const cartAddMoreBtn = document.getElementById('cartAddMoreBtn');
  const cartAddressSection = document.getElementById('cartAddressSection');
  const cartFooter = document.getElementById('cartFooter');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartTotalItemsCount = document.getElementById('cartTotalItemsCount');
  const cartCount = document.getElementById('cartCount');
  const cartHeaderBadge = document.getElementById('cartHeaderBadge');
  const whatsappOrderBtn = document.getElementById('whatsappOrderBtn');

  // DOM Elements - Address Form
  const cartCustName = document.getElementById('cartCustName');
  const cartCustPhone = document.getElementById('cartCustPhone');
  const cartCustAddress = document.getElementById('cartCustAddress');
  const cartCustCity = document.getElementById('cartCustCity');
  const cartCustPincode = document.getElementById('cartCustPincode');

  // Toast Notification
  const toastNotification = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMsg');

  // --- Functions ---

  // 1. Update Live Preview & Calculated Prices
  function updatePreview() {
    // Packaging Box Image
    if (previewBoxImg) {
      previewBoxImg.src = selectedBox.img;
      previewBoxImg.alt = selectedBox.name;
    }

    // Plant Thumbnail & Name Badge
    if (previewPlantThumb) {
      previewPlantThumb.src = selectedPlant.img;
      previewPlantThumb.alt = selectedPlant.name;
    }
    if (previewPlantName) {
      previewPlantName.textContent = selectedPlant.name;
    }

    // Big Label Overlay (PDF Field 3)
    const displayLabel = currentBigLabel.trim() || 'Happy New Year 2027';
    if (previewTagText) {
      previewTagText.textContent = displayLabel;
    }

    // Personal Message Card (PDF Field 4)
    const displayMsg = currentPersonalMsg.trim() || 'Wishing you happiness, good health and prosperity!';
    if (previewMsgText) {
      previewMsgText.textContent = `"${displayMsg}"`;
    }

    // Preview Summary Bar
    if (previewSummaryTitle) {
      previewSummaryTitle.textContent = `${selectedBox.name} + ${selectedPlant.name}`;
    }
    if (previewSummaryTag) {
      previewSummaryTag.textContent = `Big Label: "${displayLabel}"`;
    }

    // Unit Price & Total Calculation
    const unitPrice = selectedBox.price + selectedPlant.price;
    if (previewPriceBadge) {
      previewPriceBadge.textContent = `₹${unitPrice}`;
    }

    const totalForQty = unitPrice * currentQty;
    if (itemSubtotalAmt) {
      itemSubtotalAmt.textContent = `₹${totalForQty}`;
    }
    if (barTotalPrice) {
      barTotalPrice.textContent = `₹${totalForQty}`;
    }
    if (barQtyCount) {
      barQtyCount.textContent = currentQty;
    }
  }

  // 2. Step 1: Packaging Box Selection
  if (bucketsGrid) {
    bucketsGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.option-card');
      if (!card) return;

      bucketsGrid.querySelectorAll('.option-card').forEach(c => {
        c.classList.remove('selected');
        const radio = c.querySelector('.card-radio i');
        if (radio) radio.className = 'fa-regular fa-circle';
      });

      card.classList.add('selected');
      const radio = card.querySelector('.card-radio i');
      if (radio) radio.className = 'fa-solid fa-circle-check';

      selectedBox = {
        id: card.dataset.id,
        name: card.dataset.name,
        price: parseInt(card.dataset.price, 10),
        img: card.dataset.img
      };

      updatePreview();
    });
  }

  // 3. Step 2: Plant Variety Selection (PDF Step 2)
  if (plantsGrid) {
    plantsGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.option-card');
      if (!card) return;

      plantsGrid.querySelectorAll('.option-card').forEach(c => {
        c.classList.remove('selected');
        const radio = c.querySelector('.card-radio i');
        if (radio) radio.className = 'fa-regular fa-circle';
      });

      card.classList.add('selected');
      const radio = card.querySelector('.card-radio i');
      if (radio) radio.className = 'fa-solid fa-circle-check';

      selectedPlant = {
        id: card.dataset.id,
        name: card.dataset.name,
        price: parseInt(card.dataset.price, 10),
        img: card.dataset.img
      };

      updatePreview();
    });
  }

  // 4. Step 3: Big Label & Personal Message Handling (PDF Step 3)
  if (bigLabelInput) {
    bigLabelInput.addEventListener('input', (e) => {
      currentBigLabel = e.target.value;
      updatePreview();
    });
  }

  tagChips.forEach(chip => {
    chip.addEventListener('click', () => {
      tagChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      if (bigLabelInput) bigLabelInput.value = chip.dataset.text;
      currentBigLabel = chip.dataset.text;
      updatePreview();
    });
  });

  if (personalMessageInput) {
    personalMessageInput.addEventListener('input', (e) => {
      currentPersonalMsg = e.target.value;
      updatePreview();
    });
  }

  // 5. Step 4: Quantity Stepper & Presets
  function setQuantity(val) {
    let q = parseInt(val, 10);
    if (isNaN(q) || q < 1) q = 1;
    if (q > 500) q = 500;
    currentQty = q;
    if (orderQtyInput) orderQtyInput.value = q;

    qtyPresets.forEach(chip => {
      if (parseInt(chip.dataset.qty, 10) === q) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    updatePreview();
  }

  if (qtyMinusBtn) {
    qtyMinusBtn.addEventListener('click', () => {
      if (currentQty > 1) setQuantity(currentQty - 1);
    });
  }

  if (qtyPlusBtn) {
    qtyPlusBtn.addEventListener('click', () => {
      setQuantity(currentQty + 1);
    });
  }

  if (orderQtyInput) {
    orderQtyInput.addEventListener('change', (e) => {
      setQuantity(e.target.value);
    });
  }

  qtyPresets.forEach(preset => {
    preset.addEventListener('click', () => {
      const q = parseInt(preset.dataset.qty, 10);
      setQuantity(q);
    });
  });

  // 6. Toast Notification
  let toastTimer = null;
  function showToast(message) {
    if (!toastNotification || !toastMsg) return;
    toastMsg.textContent = message;
    toastNotification.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2400);
  }

  // 7. Add Current Item to Cart
  function addToCart(openDrawer = false) {
    const unitPrice = selectedBox.price + selectedPlant.price;
    const finalLabel = currentBigLabel.trim() || 'Happy New Year 2027';
    const finalMsg = currentPersonalMsg.trim() || 'Wishing you happiness and prosperity!';

    // Find if identical combo exists in cart
    const existingIndex = cart.findIndex(item => 
      item.box.id === selectedBox.id && 
      item.plant.id === selectedPlant.id && 
      item.bigLabel === finalLabel &&
      item.personalMsg === finalMsg
    );

    if (existingIndex > -1) {
      cart[existingIndex].qty += currentQty;
    } else {
      cart.push({
        id: Date.now(),
        box: { ...selectedBox },
        plant: { ...selectedPlant },
        bigLabel: finalLabel,
        personalMsg: finalMsg,
        unitPrice: unitPrice,
        qty: currentQty
      });
    }

    updateCartBadge();
    showToast(`Added ${currentQty}x ${selectedPlant.name} to cart!`);

    if (openDrawer) {
      setTimeout(openCart, 300);
    }
  }

  if (addCurrentOrderBtn) {
    addCurrentOrderBtn.addEventListener('click', () => addToCart(false));
  }
  if (stickyAddToCartBtn) {
    stickyAddToCartBtn.addEventListener('click', () => addToCart(false));
  }
  if (stickyViewCartBtn) {
    stickyViewCartBtn.addEventListener('click', openCart);
  }

  if (addMoreOrdersBtn) {
    addMoreOrdersBtn.addEventListener('click', () => {
      addToCart(false);
      showToast('Added! Choose your next plant combo below.');
      document.querySelector('.app-content').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 8. Cart Drawer Controls (Full visibility)
  function openCart() {
    renderCart();
    if (cartDrawer && cartBackdrop) {
      cartDrawer.classList.add('active');
      cartBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCart() {
    if (cartDrawer && cartBackdrop) {
      cartDrawer.classList.remove('active');
      cartBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (openCartBtn) openCartBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

  if (cartAddMoreBtn) {
    cartAddMoreBtn.addEventListener('click', () => {
      closeCart();
      document.querySelector('.app-content').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 9. Update Cart Badge Count
  function updateCartBadge() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCount) cartCount.textContent = totalCount;
    if (bottomCartBadge) bottomCartBadge.textContent = totalCount;
    if (cartHeaderBadge) cartHeaderBadge.textContent = `${totalCount} pcs`;

    if (totalCount > 0) {
      if (cartCount) {
        cartCount.style.transform = 'scale(1.25)';
        setTimeout(() => cartCount.style.transform = 'scale(1)', 200);
      }
      if (bottomCartBadge) {
        bottomCartBadge.style.transform = 'scale(1.25)';
        setTimeout(() => bottomCartBadge.style.transform = 'scale(1)', 200);
      }
    }
  }

  // 10. Render Cart Items (Rich Layout with Big Label & Personal Message)
  function renderCart() {
    if (cart.length === 0) {
      if (emptyCartState) emptyCartState.style.display = 'block';
      if (cartFooter) cartFooter.style.display = 'none';
      if (cartAddMoreRow) cartAddMoreRow.style.display = 'none';
      if (cartAddressSection) cartAddressSection.style.display = 'none';
      if (cartItemsList) {
        cartItemsList.innerHTML = '';
        cartItemsList.appendChild(emptyCartState);
      }
      updateCartBadge();
      return;
    }

    if (emptyCartState) emptyCartState.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'block';
    if (cartAddMoreRow) cartAddMoreRow.style.display = 'block';
    if (cartAddressSection) cartAddressSection.style.display = 'block';

    let html = '';
    let grandTotal = 0;
    let totalItems = 0;

    cart.forEach((item, index) => {
      const itemSubtotal = item.unitPrice * item.qty;
      grandTotal += itemSubtotal;
      totalItems += item.qty;

      html += `
        <div class="cart-item-card rich-cart-card" data-index="${index}">
          <!-- Top Row: Thumbnails + Title + Actions + Total -->
          <div class="cart-card-top">
            <div class="cart-item-thumbs">
              <img src="${item.box.img}" alt="${item.box.name}" class="cart-item-box-img">
              <img src="${item.plant.img}" alt="${item.plant.name}" class="cart-item-plant-tag" title="${item.plant.name}">
            </div>
            <div class="cart-item-main-info">
              <div class="cart-item-title">${item.plant.name}</div>
              <div class="cart-item-box-name"><i class="fa-solid fa-gift"></i> ${item.box.name}</div>
              <div class="cart-item-unit-rate">₹${item.unitPrice} per gift</div>
            </div>
            <div class="cart-item-right-col">
              <div class="cart-item-actions">
                <button class="qty-btn dec-btn" data-index="${index}" aria-label="Decrease quantity">-</button>
                <span class="qty-val">${item.qty}</span>
                <button class="qty-btn inc-btn" data-index="${index}" aria-label="Increase quantity">+</button>
              </div>
              <div class="cart-item-total-amt">₹${itemSubtotal}</div>
            </div>
          </div>

          <!-- Bottom Row: Big Label & Personal Message (from PDF Step 3) -->
          <div class="cart-card-bottom-details">
            <div class="rich-tag-plaque">
              <div class="plaque-pin"><i class="fa-solid fa-tag"></i> Big Label:</div>
              <div class="plaque-text">"${escapeHtml(item.bigLabel)}"</div>
            </div>
            <div class="rich-msg-note">
              <i class="fa-solid fa-envelope"></i> "${escapeHtml(item.personalMsg)}"
            </div>
            <div class="rich-gift-meta">
              <span><i class="fa-solid fa-seedling"></i> Fresh Potted Plant</span>
              <span><i class="fa-solid fa-ribbon"></i> Handcrafted Eco Box</span>
            </div>
          </div>
        </div>
      `;
    });

    if (cartItemsList) cartItemsList.innerHTML = html;
    if (cartSubtotal) cartSubtotal.textContent = `₹${grandTotal}`;
    if (cartTotalItemsCount) cartTotalItemsCount.textContent = `${totalItems} pcs`;
    updateCartBadge();

    // Quantity buttons
    if (cartItemsList) {
      cartItemsList.querySelectorAll('.inc-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.index, 10);
          cart[idx].qty += 1;
          renderCart();
        });
      });

      cartItemsList.querySelectorAll('.dec-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.index, 10);
          if (cart[idx].qty > 1) {
            cart[idx].qty -= 1;
          } else {
            cart.splice(idx, 1);
          }
          renderCart();
        });
      });
    }
  }

  // Clear address error styling on user typing
  [cartCustName, cartCustPhone, cartCustAddress, cartCustCity, cartCustPincode].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        const parent = input.closest('.address-field');
        if (parent) parent.classList.remove('input-error');
      });
    }
  });

  // 11. WhatsApp Direct Enquiry (Matching Reference PDF Section 3 Format)
  if (whatsappOrderBtn) {
    whatsappOrderBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your cart is empty! Add a plant first.');
        return;
      }

      // Read Delivery Address Fields
      const custName = cartCustName ? cartCustName.value.trim() : '';
      const custPhone = cartCustPhone ? cartCustPhone.value.trim() : '';
      const custAddress = cartCustAddress ? cartCustAddress.value.trim() : '';
      const custCity = cartCustCity ? cartCustCity.value.trim() : 'Amalapuram, Konaseema';
      const custPincode = cartCustPincode ? cartCustPincode.value.trim() : '';

      // Form Validation
      let hasError = false;

      if (!custName) {
        if (cartCustName) cartCustName.closest('.address-field').classList.add('input-error');
        hasError = true;
      }
      if (!custPhone || custPhone.length < 10) {
        if (cartCustPhone) cartCustPhone.closest('.address-field').classList.add('input-error');
        hasError = true;
      }
      if (!custAddress) {
        if (cartCustAddress) cartCustAddress.closest('.address-field').classList.add('input-error');
        hasError = true;
      }

      if (hasError) {
        showToast('⚠️ Please fill in your delivery name, phone & address!');
        if (cartAddressSection) {
          cartAddressSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }

      let grandTotal = 0;
      let totalPcs = 0;

      // Build WhatsApp Message matching PDF Reference Section 3
      let message = `🌿 *New Plant Gift Enquiry – Konaseema Greens* 🌿\n`;
      message += `Hello! I'm interested in ordering plant gifts.\n\n`;

      cart.forEach((item, idx) => {
        const itemSubtotal = item.unitPrice * item.qty;
        grandTotal += itemSubtotal;
        totalPcs += item.qty;

        message += `*Gift #${idx + 1}:*\n`;
        message += `  📦 *Packaging:* ${item.box.name}\n`;
        message += `  🌱 *Plant:* ${item.plant.name}\n`;
        message += `  🏷️ *Big Label:* ${item.bigLabel}\n`;
        message += `  💌 *Personal Message:* ${item.personalMsg}\n`;
        message += `  🔢 *Quantity:* ${item.qty} pcs (₹${item.unitPrice} each)\n`;
        message += `  💵 *Subtotal:* ₹${itemSubtotal}\n\n`;
      });

      message += `------------------------------------\n`;
      message += `📦 *Total Gifts:* ${totalPcs} pcs\n`;
      message += `💰 *Grand Total Amount:* ₹${grandTotal}\n`;
      message += `🚚 *Delivery Charge:* FREE (Konaseema)\n\n`;
      message += `📍 *Delivery Address:*\n`;
      message += `${custName} (Phone: ${custPhone})\n`;
      message += `${custAddress}, ${custCity}`;
      if (custPincode) {
        message += ` - ${custPincode}`;
      }
      message += `\n------------------------------------\n`;
      message += `Please share the pricing and availability. Thank you! 🌱✨`;

      const encodedMsg = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/917794022444?text=${encodedMsg}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // HTML sanitization helper
  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // Initial render
  updatePreview();
});
