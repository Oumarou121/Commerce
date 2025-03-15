document.addEventListener("DOMContentLoaded", () => {
  const statusTranslations = {
    pending: "En attente d'expédition",
    shipping: "En cours d'expédition",
    progress: "En cours de livraison",
    delivered: "Livré",
    checking: "En vérification",
    cancelled: "Annulé",
    returned: "Retourné",
    "report-returned": "Retour reporté",
    "dismiss-delivered": "Livraison rejetée",
    "report-delivered": "Livraison reportée",
    "dismiss-returned": "Retour rejeté",
    postponed: "Commande reportée",
  };

  const statusColors = {
    pending: "txt-yellow",
    shipping: "txt-light-blue",
    progress: "txt-blue",
    delivered: "txt-green",
    checking: "txt-purple",
    cancelled: "txt-red",
    returned: "txt-orange",
    "report-returned": "txt-dark-red",
    "dismiss-delivered": "txt-gray",
    "report-delivered": "txt-dark-green",
    "dismiss-returned": "txt-light-gray",
    postponed: "txt-brown",
  };

  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id") || "";
  const order = orders.getOrderById(Number(orderId))[0];
  const items = order.getItems();
  document.getElementById(
    "title1"
  ).innerHTML = `Order #${order.id} - Niger.net`;
  document.getElementById("title2").innerHTML = `Order #${order.id}`;
  const productsContent = document.getElementById("products-content");
  document.getElementById("sub-total").innerHTML =
    order.totalPrice.toLocaleString("de-DE") + " FCFA";
  document.getElementById("shipping-total").innerHTML =
    order.deliveryPrice.toLocaleString("de-DE") + " FCFA";
  document.getElementById("total").innerHTML =
    (order.totalPrice + order.deliveryPrice).toLocaleString("de-DE") + " FCFA";
  const orderSummary = document.querySelector(".order-summary");
  var nbrItem = 0;

  items.forEach((item, index) => {
    var date1 = null;
    var date2 = null;
    const date = item.history.at(-1).updateAt;
    const status = item.history.at(-1).status;
    const translatedStatus = statusTranslations[status] || status;
    const txtColor = statusColors[status] || "txt-default";
    const product = document.createElement("div");
    product.classList.add("products-section");

    if (
      ["progress", "checking", "report-returned", "report-delivered"].includes(
        status
      )
    ) {
      date1 = date;
      date2 = item.history.at(-1).endingAt;
    } else {
      date1 = date;
    }

    let prevPriceHtml = "";
    if (item.priceReduction > 0) {
      prevPriceHtml = `
            <span class="prev-price">
                <span id="previewPrice">-${item.priceReduction.toLocaleString()} FCFA</span>
            </span>
        `;
    }

    product.innerHTML = `
      <div class="product">
        <div class="product-image">
          <img src="${item.image}" alt="${item.productName}" />
          ${prevPriceHtml}
        </div>
        <div class="product-content">
          <div class="content">
            <div class="name-content">
              <a href="product.html?id=${item.productId}" class="text-red">${
      item.productName
    }</a>
              <p class="text-gray">Couleur : ${
                item.color ? item.color : "Non spécifiée"
              }</p>
              <p>Statut : <span class="status ${txtColor}">${translatedStatus}</span></p>
            </div>
            <div class="price-content">
              <span class="text-red">${item.price.toLocaleString(
                "de-DE"
              )} FCFA</span>
              ${
                item.quantity > 1
                  ? `<span class="text-red"> x ${item.quantity}</span>`
                  : ""
              }
            </div>
          </div>
          <div class="order-info">
            <p><span class="delivery-date">${formatDateOrder(
              date1,
              date2
            )}</span></p>
            <button class="track-btn">Suivre la commande</button>
          </div>
        </div>
      </div>
    `;

    product.querySelector(".track-btn").addEventListener("click", () => {
      window.location.href = `track.html?id=${orderId}&index=${index}`;
    });

    productsContent.appendChild(product);
    nbrItem += item.quantity;
  });

  const paymentStatus = document.createElement("div");
  if (order.payment === "cash") {
    paymentStatus.innerHTML = `
      <div class="payment-status pending">
        ⚠️ Payment Pending - Pay on Delivery
      </div>
    `;
  } else if (order.payment.includes("virtual-wallet")) {
    paymentStatus.innerHTML = `
      <div class="payment-status paid">
        ✅ Payment Confirmed - Paid by Virtual Wallet
        <a href="https://virtual-wallet.web.app/receipt.html?id=${order.payment}" class="receipt-link" target="_blank">Receipt</a>
      </div>
    `;
  } else {
    paymentStatus.innerHTML = `
      <div class="payment-status delivered">
        Payment Confirmed - Received
      </div>
    `;
  }
  orderSummary.appendChild(paymentStatus);
  document.getElementById("user-name").innerHTML =
    order.shippingAddress.firstName + " " + order.shippingAddress.lastName;
  document.getElementById("nbr-articles").innerHTML = `${nbrItem} article(s)`;
  document.getElementById("user-email").innerHTML = user.email;
  document.getElementById("user-phone-number").innerHTML =
    order.shippingAddress.phoneNumber1;
  document.getElementById("user-address").innerHTML = `
    <h2>Shipping Address</h2>
    <address>
      ${order.shippingAddress.district} / ${order.shippingAddress.street}
      <br />${order.shippingAddress.phoneNumber1} / ${order.shippingAddress.phoneNumber2}
      <br />${order.shippingAddress.region} / Niger
    </address>
  `;
});
