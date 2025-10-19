const creatForm = document.forms["creatForm"];
const preview = document.querySelector("#preview");

creatForm.image.addEventListener("change", () => {
  const file = creatForm.image.files[0];
  const reader = new FileReader();

  reader.readAsDataURL(file);

  reader.addEventListener("load", (e) => {
    preview.setAttribute("src", e.target.result);
  });
});

creatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const productData = {
    title: creatForm.title.value,
    description: creatForm.description.value,
    price: parseFloat(creatForm.price.value),
  };

  try {
    const response = await axios.post(
      "https://dummyjson.com/products/add",
      productData
    );

    if (response.status === 200 || response.status === 201) {
      await Swal.fire({
        title: "Added successfully!",
        icon: "success",
        confirmButtonColor: "#064232",
      });

      location.href = "index.html";
    }
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
      footer: `<span style="color:#888;">${err.message}</span>`,
    });
  }
});
