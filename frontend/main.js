import { createEl } from "./helper/helper.js";
const selectApp = document.querySelector("#memberships_app");
const addServiceBtn = document.querySelector(".buttonContainer--btn");
addServiceBtn.addEventListener("click", () => {
  window.location.href = "/frontend/addMemberships.html";
});
window.onload = function () {
  document.querySelector(".memberships").classList.add("changeColor");
};
async function getServices() {
  const response = await fetch("http://localhost:3000/memberships");
  const json = await response.json();
  return json;
}
async function fetchAndRenderServices() {
  const services = await getServices();
  await renderServices(services);
}
async function deleteService(id) {
  const deleteService = await fetch(
    "http://localhost:3000/memberships/" + id.toString(),
    {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
    }
  );
  const json = await deleteService.json();
  return json;
}
async function renderServices(services) {
  services.forEach((service) => {
    const serviceDiv = createEl("div", "service");
    const serviceName = createEl("h2", "service--name");
    const serviceDesc = createEl("p", "service--description");
    const serviceBtn = createEl("button", "service--btn_del");
    const serviceBtnContainer = createEl("div", "service--btn_Container");
    const serviceNameContainer = createEl("div", "service--name__Container");
    serviceBtn.innerHTML = "<i class='fad fa-trash'></i>";
    serviceName.textContent = `$${service.price} ${service.name}`;
    serviceDesc.textContent = service.description;

    serviceBtn.addEventListener("click", async () => {
      await deleteService(service.id);
      selectApp.innerHTML = "";
      fetchAndRenderServices();
    });

    serviceBtnContainer.append(serviceBtn);
    serviceNameContainer.append(serviceName, serviceDesc);
    serviceDiv.append(serviceNameContainer, serviceBtnContainer);
    selectApp.append(serviceDiv);
  });
}
fetchAndRenderServices();
