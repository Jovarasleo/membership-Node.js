const formElement = document.querySelector("form");
const formButton = document.querySelector(".createMembership");
const cancelBtn = document.querySelector(".cancel");
window.onload = function () {
  document.querySelector(".memberships").classList.add("changeColor");
};
cancelBtn.addEventListener("click", () => {
  window.location.href = "/frontend/memberships.html";
});
formButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const formData = new FormData(formElement);

  const name = formData.get("name");
  const price = Number(formData.get("Price"));
  const description = formData.get("Text");

  const membership = {
    name,
    price,
    description,
  };

  await fetch("http://localhost:3000/memberships", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(membership),
  });
  location.reload();
});
