import { createEl } from "./helper/helper.js";
const selectApp = document.querySelector("#app-users");
const addnewUserBtn = document.querySelector(".buttonContainer--btn");
const sortdiv = document.querySelector(".sort i");
const sortBtn = document.querySelector(".sort--btn");
addnewUserBtn.addEventListener("click", () => {
  window.location.href = "/frontend/addUser.html";
});
window.onload = function () {
  document.querySelector(".users").classList.add("changeColor");
};
let sort = "ASC";
sortdiv.addEventListener("click", () => {
  if (sort == "ASC") {
    sort = "DSC";
    sortBtn.textContent = `Sorting By Name: ${sort}`;
    selectApp.innerHTML = "";
    fetchAndRenderusers();
  } else {
    sort = "ASC";
    sortBtn.textContent = `Sorting By Name: ${sort}`;
    selectApp.innerHTML = "";
    fetchAndRenderusers();
  }
});
async function getUsers(sort) {
  const query = new URLSearchParams();
  query.set("order", sort);
  const response = await fetch(
    "http://localhost:3000/users?" + query.toString()
  );
  const json = await response.json();
  return json;
}
const fetchAndRenderusers = async () => {
  const users = await getUsers(sort);
  renderusers(users);
};
async function renderusers(users) {
  users.forEach((user) => {
    const emailP = createEl("p", "user_email--paragraph");
    const serviceP = createEl("p", "user_membership--paragraph");
    const userDiv = createEl("div", "user");
    const userName = createEl("h2", "user__name");
    const userEmail = createEl("a", "user__email");
    const userIP = createEl("p", "user__IP");
    const userMembership = createEl("a", "user__membership");
    const userNameContainer = createEl("div", "user--name__Container");

    let email = document.createTextNode(user.email);
    let membership = document.createTextNode(user.service);

    userName.textContent = `${user.name} ${user.surname}`;
    emailP.textContent = "Email Address: ";
    serviceP.textContent = "Membership: ";
    userEmail.href = user.email;
    userMembership.href = user.service;
    userIP.textContent = `ip: ${user.ip}`;

    userMembership.append(membership);
    serviceP.append(userMembership);
    userEmail.append(email);
    emailP.append(userEmail);
    userNameContainer.append(userName);
    userDiv.append(userNameContainer, emailP, serviceP, userIP);
    selectApp.append(userDiv);
  });
}
fetchAndRenderusers();
