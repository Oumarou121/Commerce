document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".bar-nav li span");
  const cartContent1 = document.querySelector("#livres ul");

  const empty = `<div class="cart-empty">
      <i class="uil uil-box"></i>
      <p>Your Orders Is Empty</p>
    </div>`;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));

      tab.classList.add("active");
    });
  });

  if (orders.getOrders().length > 0) {
    orders.getOrders().forEach((order) => {
      order.getItems().forEach((item) => {
        cartContent1.innerHTML += `
        <li class="cart-item">
          <div class="image">
            <img src="${item.image}" alt="${item.productName}">
            </div>
            <div class="div-name">
                <div class="name text-black">
                    ${item.productName}
                </div>
                <div class="Num-comd">Commande #${order.id}</div>
                <div class="qty">Quantité: ${item.quantity}</div>
                <div class="state text-white bg-green">${
                  item.history.at(-1).status
                }</div>
                <div class="time">${new Date(
                  item.history.at(-1).updateAt
                )}</div>
            </div>
            <div class="div-btn">
                <div class="Add text-black">
                    <i class="uil uil-shopping-cart-alt"></i>
                    DÉTAILS
                </div>
                <div></div>
          </div>
        </li>  
      `;
      });
    });
  } else {
    cartContent1.innerHTML = empty;
  }
});
