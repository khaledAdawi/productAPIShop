const loader = document.querySelector(".products-loader");
const searchInput = document.querySelector(".search-container");
const dropdownItems = Array.from(document.querySelectorAll(".dropdown-item"));

const getProducts = async (page) => {
  const skip = (page - 1) * 8;

  const response = await axios.get(
    `https://dummyjson.com/products?limit=8&skip=${skip}`
  );

  console.log(response);

  if (response.status == 200) return response;
};

const getSortingProducts = async (page) => {
  const skip = (page - 1) * 8;

  const priceAsc = dropdownItems[0];
  const priceDesc = dropdownItems[1];
  const titleAsc = dropdownItems[2];
  const titleDesc = dropdownItems[3];

  const response = await axios.get(
    `https://dummyjson.com/products?limit=8&skip=${skip}`
  );

  console.log(response);

  if (response.status == 200) return response;
};

const displayProducts = async (page = 1) => {
  try {
    loader.classList.remove("d-none");
    const response = await getProducts(page);
    const numberOfPages = Math.ceil(response.data.total / 8);

    const result = response.data.products
      .map(
        (product) => `



        <div class="col-md-4 col-lg-3">
            <div class="card h-100">
              <img src=${product.thumbnail} class="card-img-top "alt="Product">
              <div class="card-body">
                <h6>${product.title}</h6>
                <p>${product.price}</p>
                <div class="rating">
                   ${generateStars(product.rating)}
                </div>
                <a href='./details.html?productId=${
                  product.id
                }' class="btn btn-primary w-100 mt-2">Show Details</a>
              </div>
            </div>
         </div>

            `
      )
      .join(" ");

    document.querySelector(".products-container").innerHTML = result;

    let paginationlink = "";
    if (page > 1) {
      paginationlink += `<li class="page-item"><button class="page-link" onclick="displayProducts(${
        page - 1
      })">Previous</button></li>`;
    } else {
      paginationlink += `<li class="page-item"><button class="page-link disabled" >Previous</button></li>`;
    }

    for (let i = 1; i <= numberOfPages; i++) {
      if (i == 1 || i == numberOfPages || (i > page - 2 && i < page + 2)) {
        paginationlink += ` <li class="page-item"><button class="page-link ${
          i == page ? "active" : ""
        }" onclick="displayProducts(${i})">${i}</button></li>`;
      }
    }

    if (page < numberOfPages) {
      paginationlink += ` <li class="page-item"><button class="page-link" onclick="displayProducts(${
        parseInt(page) + 1
      })">Next</button></li>`;
    } else {
      paginationlink += ` <li class="page-item"><button class="page-link disabled">Next</button></li>`;
    }

    document.querySelector(".pagination").innerHTML = paginationlink;
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "We couldn’t load the data right now. Please try again later!",
      footer: `<span style="color:#888;font-size:0.9rem;">${err.message}</span>`,
      confirmButtonColor: "#064232",
    });

    const errorContainer = document.querySelector(".error");
    errorContainer.innerHTML = `
    <div class="error-box text-center p-4">
      <i class="bi bi-emoji-frown" style="font-size:3rem; color:#F5BABB;"></i>
      <h5 style="color:#064232; margin-top:10px;">Something went wrong</h5>
      <p style="color:#5C5C5C;">We couldn’t load the content : ${err}. Please check your connection or try again later.</p>
    </div>
  `;
  } finally {
    loader.classList.add("d-none");
  }
};

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  let starsHTML = "";

  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="bi bi-star-fill"></i>';
  }
  if (halfStar) {
    starsHTML += '<i class="bi bi-star-half"></i>';
  }
  for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) {
    starsHTML += '<i class="bi bi-star"></i>';
  }
  return starsHTML;
}

searchInput.addEventListener("input", async (e) => {
  const filterText = e.target.value.trim();

  if (filterText === "") {
    displayProducts();
    return;
  }

  try {
    loader.classList.remove("d-none");

    const response = await axios.get(
      `https://dummyjson.com/products/search?q=${filterText}`
    );

    console.log(response);

    if (response.data.products.length === 0) {
      document.querySelector(".products-container").innerHTML = `
        <div class="text-center mt-5">
          <h5 style="color:#064232;">No products found</h5>
          <p style="color:#888;">Try searching for something else.</p>
        </div>`;
      return;
    }

    const result = response.data.products
      .map(
        (product) => `
          <div class="col-md-4 col-lg-3">
            <div class="card h-100">
              <img src="${
                product.thumbnail
              }" class="card-img-top" alt="Product">
              <div class="card-body">
                <h6>${product.title}</h6>
                <p>$${product.price}</p>
                <div class="rating">${generateStars(product.rating)}</div>
                <a href='./details.html?productId=${product.id}'
                  class="btn btn-primary w-100 mt-2">Show Details</a>
              </div>
            </div>
          </div>
        `
      )
      .join("");

    document.querySelector(".products-container").innerHTML = result;
    document.querySelector(".pagination").innerHTML = "";
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "We couldn’t load the data right now. Please try again later!",
      footer: `<span style="color:#888;font-size:0.9rem;">${err.message}</span>`,
      confirmButtonColor: "#064232",
    });

    document.querySelector(".error").innerHTML = `
      <div class="error-box text-center p-4">
        <i class="bi bi-emoji-frown" style="font-size:3rem; color:#F5BABB;"></i>
        <h5 style="color:#064232; margin-top:10px;">Something went wrong</h5>
        <p style="color:#5C5C5C;">We couldn’t load the content : ${err}</p>
      </div>`;
  } finally {
    loader.classList.add("d-none");
  }
});

dropdownItems.forEach((item) => {
  item.addEventListener("click", async (e) => {
    try {
      const page = 1;
      loader.classList.remove("d-none");
      const skip = (page - 1) * 8;

      let sortBy = "title";
      let order = "asc";

      if (e.target.textContent.includes("Price: Low")) {
        sortBy = "price";
        order = "asc";
      } else if (e.target.textContent.includes("Price: High")) {
        sortBy = "price";
        order = "desc";
      } else if (e.target.textContent.includes("Title: A")) {
        sortBy = "title";
        order = "asc";
      } else if (e.target.textContent.includes("Title: Z")) {
        sortBy = "title";
        order = "desc";
      }

      const response = await axios.get(
        `https://dummyjson.com/products?sortBy=${sortBy}&order=${order}&limit=8&skip=${skip}`
      );

      console.log(response);
      const numberOfPages = Math.ceil(response.data.total / 8);

      const result = response.data.products
        .map(
          (product) => `



        <div class="col-md-4 col-lg-3">
            <div class="card h-100">
              <img src=${product.thumbnail} class="card-img-top "alt="Product">
              <div class="card-body">
                <h6>${product.title}</h6>
                <p>${product.price}</p>
                <div class="rating">
                   ${generateStars(product.rating)}
                </div>
                <a href='./details.html?productId=${
                  product.id
                }' class="btn btn-primary w-100 mt-2">Show Details</a>
              </div>
            </div>
         </div>

            `
        )
        .join(" ");

      document.querySelector(".products-container").innerHTML = result;

      let paginationlink = "";
      if (page > 1) {
        paginationlink += `<li class="page-item"><button class="page-link" onclick="displayProducts(${
          page - 1
        })">Previous</button></li>`;
      } else {
        paginationlink += `<li class="page-item"><button class="page-link disabled" >Previous</button></li>`;
      }

      for (let i = 1; i <= numberOfPages; i++) {
        if (i == 1 || i == numberOfPages || (i > page - 2 && i < page + 2)) {
          paginationlink += ` <li class="page-item"><button class="page-link ${
            i == page ? "active" : ""
          }" onclick="displayProducts(${i})">${i}</button></li>`;
        }
      }

      if (page < numberOfPages) {
        paginationlink += ` <li class="page-item"><button class="page-link" onclick="displayProducts(${
          parseInt(page) + 1
        })">Next</button></li>`;
      } else {
        paginationlink += ` <li class="page-item"><button class="page-link disabled">Next</button></li>`;
      }

      document.querySelector(".pagination").innerHTML = paginationlink;
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "We couldn’t load the data right now. Please try again later!",
        footer: `<span style="color:#888;font-size:0.9rem;">${err.message}</span>`,
        confirmButtonColor: "#064232",
      });

      const errorContainer = document.querySelector(".error");
      errorContainer.innerHTML = `
    <div class="error-box text-center p-4">
      <i class="bi bi-emoji-frown" style="font-size:3rem; color:#F5BABB;"></i>
      <h5 style="color:#064232; margin-top:10px;">Something went wrong</h5>
      <p style="color:#5C5C5C;">We couldn’t load the content : ${err}. Please check your connection or try again later.</p>
    </div>
  `;
    } finally {
      loader.classList.add("d-none");
    }
  });
});

displayProducts();
