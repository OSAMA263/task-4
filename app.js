const linkTo = document.querySelectorAll(".link");
const login = document.getElementById("login");
const rejister = document.getElementById("rejister");
const showPassword = document.querySelectorAll(".toggle-password");
const submitBtn = document.querySelectorAll("button[type='submit']");
const forms = document.querySelectorAll("form");
const userPage = document.getElementById("user-page");
const tbody = document.querySelector("tbody");
const toast = document.getElementById("toast");

// auth
let user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  localStorage.setItem("user", JSON.stringify({}));
  user = JSON.parse(localStorage.getItem("user"));
}

// get the accounts array
let accounts = JSON.parse(localStorage.getItem("accounts"));
if (!accounts) {
  localStorage.setItem(
    "accounts",
    JSON.stringify([{ name: "osama", email: "osama@gmail", password: "13542" }])
  );
  accounts = JSON.parse(localStorage.getItem("accounts"));
}

// the active page
let page = "rejister";
// show password
showPassword.forEach((btn) => {
  btn.onclick = () => {
    const passwordInputs = document.querySelectorAll('input[name="password"]');
    passwordInputs.forEach((passwordInput) => {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        btn.innerHTML = `<i class="fa-regular fa-eye"></i>`;
      } else {
        passwordInput.type = "password";
        btn.innerHTML = `<i class="fa-regular fa-eye-slash"></i>`;
      }
    });
  };
});

// changing the page
linkTo.forEach((link, i) => {
  link.onclick = () => {
    page = link.value;
    if (page === "login") {
      login.style.transform = "translate(0,-50%)";
      rejister.style.transform = "translate(-100%,-50%)";
    } else if (page === "rejister") {
      login.style.transform = "translate(150%,-50%)";
      rejister.style.transform = "translate(0,-50%)";
      // tried tailwind classes but i was getting mad so ..yeah
    }
  };
});

// collet form data inputs
function collectData(form) {
  const formData = new FormData(form);
  let data = {};
  formData.forEach((val, key) => {
    data = { ...data, [key]: val };
  });
  return data;
}

// onsubmit handler
forms.forEach((form) => {
  form.onsubmit = (e) => {
    e.preventDefault();
    const data = collectData(form);
    validation(data, form);
  };
});

// validation handler
function validation(data, form) {
  const loginEmail = document.getElementById("login-email");
  const loginPassword = document.getElementById("login-password");
  const rejisterEmail = document.getElementById("rejister-email");
  // check if acocunt already exists
  const existingAcount = accounts.find((acc) => acc.email === data.email);

  if (existingAcount) {
    // if the accounts does exist
    if (page === "login") {
      if (existingAcount.password === data.password) {
        user = { ...data };
        localStorage.user = JSON.stringify(user);
        userPage.style.display = "flex";
        getUsers(user);
      } else {
        loginPassword.innerHTML = "Password isnt correct!";
        loginEmail.innerHTML = "";
      }
    } else {
      rejisterEmail.innerHTML = "Account is already used.";
    }
  } else {
    // if the accounts does not exist
    if (page === "login") {
      loginEmail.innerHTML = "make sure the email you entered is correct!";
    } else {
      rejisterEmail.innerHTML = "";
      form.reset();
      accounts = [...accounts, data];
      localStorage.accounts = JSON.stringify(accounts);
      toast.style.transform = "translate(-50%,80px)";
      setTimeout(() => {
        toast.style.transform = "translate(-50%,-100%)";
      }, 2500);
    }
  }
}

// display user data
function getUsers(user) {
  // accounts
  accounts.map(({ name, email, password }, i) => {
    tbody.innerHTML += `
    <tr style="background-color: ${
      user.email === email ? "gray" : "transparent"
    };">
      <td>${i + 1}</td>
      <td>${name}</td>
      <td>${email}</td>
      <td>${password}</td>
      ${
        user.email === email
          ? `<td><button id="logout" onclick="logout()">logout</button></td>`
          : `<td></td>`
      }
    </tr>`;
  });
}

// logout handler
function logout() {
  localStorage.user = JSON.stringify({});
  userPage.style.display = "none";
  tbody.innerHTML = "";
}

// check if user is loged in
userPage.style.display = user.email ? "flex" : "none";
user.email && getUsers(user);
