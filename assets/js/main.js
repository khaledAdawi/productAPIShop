const productsLoader = document.querySelector(".products-loader");
const categoriesLoader = document.querySelector(".categories-loader")

const get12Products = async () => {
  const response = await axios.get(`https://dummyjson.com/products?limit=12`);

  if (response.status == 200) return response;
};

const displayProducts = async () => {
  try {
    productsLoader.classList.remove("d-none");
    const response = await get12Products();

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
    productsLoader.classList.add("d-none");
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

displayProducts();

const getCategories = async () => {
  const response = await axios.get(`https://dummyjson.com/products/categories`);
  if (response.status == 200) return response;
};

const displayCategories = async () => {
  try {
    categoriesLoader.classList.remove("d-none");

    const response = await getCategories();
    const categories = response.data;

    let visibleCount = 4;

    const renderCategories = () => {
      const visibleCategories = categories.slice(0, visibleCount);

      const result = visibleCategories
        .map(
          (category) => `
        <div class="col-md-4 col-lg-3">
          <div class="card h-100">
            <div class="card-body">
              <h6>${category.name}</h6>
              <a href="./category-products.html?categorySlug=${category.slug}"
                class="btn btn-primary w-100 mt-2">Explore</a>
            </div>
          </div>
        </div>
      `
        )
        .join("");

      document.querySelector(".categories-container").innerHTML = result;

      if (visibleCount >= categories.length) {
        document.querySelector(".show-more-btn").style.display = "none";
      }
    };

    renderCategories();

    document.querySelector(".show-more-btn").addEventListener("click", () => {
      visibleCount += 4;
      renderCategories();
    });
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
    categoriesLoader.classList.add("d-none");
  }
};

displayCategories();
