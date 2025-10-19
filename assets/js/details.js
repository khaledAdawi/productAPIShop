const imgLoader = document.querySelector(".product-image-loader");
const detailsLoader = document.querySelector(".details-loader");
const reviewLoader = document.querySelector(".reviews-loader");

const getUser = async () => {
  try {
    imgLoader.classList.remove("d-none");
    detailsLoader.classList.remove("d-none");
    reviewLoader.classList.remove("d-none");
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("productId");
    const response = await axios.get(
      `https://dummyjson.com/products/${productId}`
    );
    console.log(response);

    document.querySelector("#main-image").src = response.data.images[0];

    document.querySelector('.product-title').textContent = response.data.title;

    document.querySelector("#product-rating").innerHTML = generateStars(
      response.data.rating
    );
    document.querySelector(
      ".price"
    ).textContent = `Price:${response.data.price}`;
    document.querySelector("#product-description").textContent =
      response.data.description;
    document.querySelector("#product-category").textContent =
      response.data.category;
    document.querySelector("#product-brand").textContent = response.data.brand;
    document.querySelector("#product-stock").textContent = response.data.stock;
    document.querySelector("#product-warranty").textContent =
      response.data.warrantyInformation;

    document.querySelector("#product-shipping").textContent =
      response.data.shippingInformation;
    document.querySelector("#product-return").textContent =
      response.data.returnPolicy;
    document.querySelector("#product-stock").textContent = response.data.stock;

    const custReview = document.querySelector("#reviews-container");
    custReview.innerHTML = response.data.reviews.map(
      (review) =>
        `

    <div class="review-card p-3 shadow-sm rounded-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h6 class="m-0 reviewer-name">${review.reviewerName}</h6>
          <div class="review-rating">
            ${generateStars(review.rating)}
         </div>
        </div>
         <p class="review-comment text-muted mb-1">
           ${review.comment}
        </p>
        <small class="text-secondary">${new Date(
          review.date
        ).toLocaleDateString()}</small>
    </div>
  `
    );
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
  }finally{
    imgLoader.classList.add("d-none");
    detailsLoader.classList.add("d-none");
    reviewLoader.classList.add("d-none");

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

getUser();
