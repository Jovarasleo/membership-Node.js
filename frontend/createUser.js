import { createEl } from "./helper/helper.js";
const formElement = document.querySelector("form");
const formButton = document.querySelector(".createUser");
const cancelBtn = document.querySelector(".cancel");
const select = document.querySelector(".selectMembership");
window.onload = function () {
  document.querySelector(".users").classList.add("changeColor");
};
cancelBtn.addEventListener("click", () => {
  window.location.href = "/frontend/users.html";
});
formButton.addEventListener("click", async (event) => {
  const formData = new FormData(formElement);
  const name = formData.get("firstname");
  const surname = formData.get("lastname");
  const email = formData.get("email");
  const service_id = formData.get("membership");
  console.log(service_id);
  const user = {
    name,
    surname,
    email,
    service_id,
  };

  await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  location.reload();
});
async function getServices() {
  const response = await fetch("http://localhost:3000/memberships");
  const json = await response.json();
  return json;
}
const fetchAndRenderServices = async () => {
  const services = await getServices();
  renderServices(services);
};
async function renderServices(services) {
  console.log(services);
  services.forEach((service) => {
    console.log(service.name);
    const newOption = createEl("option", "option");
    newOption.textContent = service.name;
    newOption.value = service.id;
    select.append(newOption);
  });
}
fetchAndRenderServices();
