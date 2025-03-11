const grid = document.getElementById("grid");
const list = document.getElementById("list");
const productsContent = document.getElementById("listProducts");
const productsPerPage = 1;
let currentPage = 1;
const paginationContainer = document.querySelector(".shop_pagi ul");

if (grid) {
  grid.addEventListener("click", () => {
    if (grid.classList.contains("active")) return;

    grid.classList.add("active");
    list.classList.remove("active");
    productsContent.classList.remove("list");
    productsContent.classList.add("grid");
  });
}

if (list) {
  list.addEventListener("click", () => {
    if (list.classList.contains("active")) return;

    grid.classList.remove("active");
    list.classList.add("active");
    productsContent.classList.remove("grid");
    productsContent.classList.add("list");
  });
}

function displayProducts(page, filteredProducts = null) {
  if (productsContent) {
    productsContent.classList.remove("show");
    setTimeout(() => {
      productsContent.innerHTML = "";

      let productsToDisplay = filteredProducts || products;

      let start = (page - 1) * productsPerPage;
      let end = start + productsPerPage;
      let paginatedItems = productsToDisplay.slice(start, end);

      if (paginatedItems.length === 0) {
        productsContent.innerHTML = `
        <div class="no-results-container">
        <i class="uil uil-search-alt"></i>
          <p>Aucun produit ne correspond aux critères recherchés.</p>
        </div>
      `;
      }

      paginatedItems.forEach((product) => {
        productsContent.innerHTML += creationProduct(product);
      });

      productsContent.classList.add("show");
      window.scrollTo({ top: 0, behavior: "smooth" });

      updatePagination(page, productsToDisplay);
    }, 300);
  }
}

function updatePagination(currentPage, productsToDisplay) {
  paginationContainer.innerHTML = "";

  let totalPages = Math.ceil(productsToDisplay.length / productsPerPage);

  if (totalPages > 0) {
    paginationContainer.innerHTML += `
      <li class="${currentPage === 1 ? "disabled" : "prev"}" data-page="${
      currentPage - 1
    }">
        <span><i class="uil uil-angle-double-left"></i></span>
      </li>
    `;

    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        paginationContainer.innerHTML += `
          <li class="page-item ${
            i === currentPage ? "active" : ""
          }" data-page="${i}">
            <span>${i}</span>
          </li>
        `;
      }
    } else {
      paginationContainer.innerHTML += `
        <li class="page-item ${
          currentPage === 1 ? "active" : ""
        }" data-page="1">
          <span>1</span>
        </li>
      `;

      if (currentPage > 3) {
        paginationContainer.innerHTML += `<li class="dots"><span>...</span></li>`;
      }

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(currentPage + 1, totalPages - 1);

      for (let i = start; i <= end; i++) {
        paginationContainer.innerHTML += `
          <li class="page-item ${
            i === currentPage ? "active" : ""
          }" data-page="${i}">
            <span>${i}</span>
          </li>
        `;
      }

      if (currentPage < totalPages - 2) {
        paginationContainer.innerHTML += `<li class="dots"><span>...</span></li>`;
      }

      paginationContainer.innerHTML += `
        <li class="page-item" data-page="${totalPages}">
          <span>${totalPages}</span>
        </li>
      `;
    }

    paginationContainer.innerHTML += `
      <li class="${
        currentPage === totalPages ? "disabled" : "next"
      }" data-page="${currentPage + 1}">
        <span><i class="uil uil-angle-double-right"></i></span>
      </li>
    `;

    document.getElementById("orther-result").innerText = `Showing ${Math.min(
      (currentPage - 1) * productsPerPage + 1,
      productsToDisplay.length
    )} - ${Math.min(
      currentPage * productsPerPage,
      productsToDisplay.length
    )} of ${productsToDisplay.length} results`;

    document.getElementById("desktop-result").innerText = `Showing ${Math.min(
      (currentPage - 1) * productsPerPage + 1,
      productsToDisplay.length
    )} - ${Math.min(
      currentPage * productsPerPage,
      productsToDisplay.length
    )} of ${productsToDisplay.length} results`;
  } else {
    document.getElementById("orther-result").innerText = "";
    document.getElementById("desktop-result").innerText = "";
  }

  document.querySelectorAll(".page-item, .prev, .next").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      let newPage = parseInt(item.getAttribute("data-page"));
      if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        displayProducts(currentPage);
      }
    });
  });
}

displayProducts(currentPage);

// ==========================================================

function applyFilter(filters, category, isInCategory = false) {
  if (isInCategory) {
    filteredProducts = products.filter((product) => {
      return product.category.trim().startsWith(category.trim());
    });
  } else {
    filteredProducts = products.filter((product) => {
      return Object.entries(filters).every(([key, value]) => {
        if (key === "Prix") {
          let [min, max] = value.map((v) => parseInt(v.replace(" FCFA", "")));
          return product.price >= min && product.price <= max;
        }

        return (
          product.specs[key] &&
          filters[key].some(
            (v) => product.specs[key].toLowerCase() === v.toLowerCase()
          )
        );
      });
    });
  }

  displayProducts(currentPage, filteredProducts);
}

const switchCategory = document.getElementById("switchCategory");
if (switchCategory) {
  switchCategory.addEventListener("click", () => {
    fondCategory.classList.toggle("show");
    category.classList.toggle("show");
  });
}

const sortBy = document.getElementById("SortBy");
if (sortBy) {
  sortBy.addEventListener("change", function () {
    let sortBy = this.value;
    sortProducts(sortBy);
  });
}

function sortProducts(sortBy) {
  // let sortedProducts = [...products];

  let sortedProducts =
    filteredProducts.length > 0 ? filteredProducts : products;

  switch (sortBy) {
    case "best-selling":
      sortedProducts.sort((a, b) => (b.sales || 0) - (a.sales || 0));
      break;

    case "title-ascending":
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case "title-descending":
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;

    case "price-ascending":
      sortedProducts.sort((a, b) => a.price - b.price);
      break;

    case "price-descending":
      sortedProducts.sort((a, b) => b.price - a.price);
      break;

    case "created-descending":
      sortedProducts.sort((a, b) => b.id - a.id);
      break;

    case "created-ascending":
      sortedProducts.sort((a, b) => a.id - b.id);
      break;

    default:
      // "manual" ou valeur non reconnue : ne pas trier
      break;
  }

  console.log("Produits triés :", sortedProducts);
  displayProducts(currentPage, sortedProducts); // Affiche les produits triés
}
