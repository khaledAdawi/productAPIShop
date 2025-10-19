const loader = document.querySelector(".delete-loader");

const getProducts = async (page) => {
  const skip = (page - 1) * 8;

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

            <tr>
              <td>${product.title}</td>
              <td>${product.price}</td>
              <td><img src=${product.thumbnail} width='200px'/></td>
              <td>
              <a href='./details.html?productId=${product.id}' class='btn btn-outline-info '>details</a>
              <button class='btn btn-outline-danger' onclick=deleteProduct(event,'${product.id}')>delete</button>
              </td>

            </tr>

            `
      )
      .join(" ");

    document.querySelector(".product-data").innerHTML = result;

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

const deleteProduct = (event ,productId) => {
  Swal.fire({
    title: "Are you sure you want to delete this product?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `https://dummyjson.com/products/${productId}`
        );

        if (response.status === 200) {
          Swal.fire({
            title: "Deleted!",
            text: "Product has been deleted.",
            icon: "success",
            confirmButtonColor: "#064232",
          });

          event.target.closest("tr").remove();
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while deleting!",
          footer: `<span style="color:#888;">${err.message}</span>`,
        });
      }
    }
  });
};

displayProducts();
