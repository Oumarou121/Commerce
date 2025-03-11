document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password");
  const toggleButton = document.querySelector(".login__eye");
  const eyeOff = document.querySelector(".eye-off");
  const eyeOn = document.querySelector(".eye-on");
  const loginContent = document.querySelector(".login-content");
  const forgotContent = document.querySelector(".forgot-content");
  const forgotLink = document.querySelector(".forgot-password-link");
  const cancelLink = document.querySelector(".forgot-box-sub span");

  forgotLink.addEventListener("click", function (event) {
    event.preventDefault();
    loginContent.classList.add("hidden");
    setTimeout(() => {
      loginContent.style.display = "none";
      forgotContent.style.display = "block";
      setTimeout(() => forgotContent.classList.add("active"), 10);
    }, 300);
  });

  cancelLink.addEventListener("click", function () {
    forgotContent.classList.remove("active");
    setTimeout(() => {
      forgotContent.style.display = "none";
      loginContent.style.display = "block";
      setTimeout(() => loginContent.classList.remove("hidden"), 10);
    }, 300);
  });

  toggleButton.addEventListener("click", function () {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";

    eyeOff.classList.toggle("hidden", !isPassword);
    eyeOn.classList.toggle("hidden", isPassword);
  });

  document.getElementById("sub-btn").addEventListener("click", function () {
    let errors = [];

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    document
      .querySelectorAll(".form-input")
      .forEach((input) => input.classList.remove("error"));

    const user = {
      email: email.value,
      password: password.value,
    };

    if (!emailPattern.test(user.email)) {
      errors.push("Please enter a valid email");
      email.classList.add("error");
    }
    if (user.password.length <= 6) {
      errors.push("Password must be more than 6 characters long");
      password.classList.add("error");
    }

    const errorContainer = document.querySelector(".error-content");
    const listError = document.createElement("ul");
    errorContainer.innerHTML = "";
    if (errors.length > 0) {
      errors.forEach((msg) => {
        const li = document.createElement("li");
        li.classList.add("error-message");
        li.textContent = msg;
        listError.appendChild(li);
      });
      errorContainer.appendChild(listError);
      errorContainer.classList.remove("hidden");
    } else {
      errorContainer.classList.add("hidden");
      console.log(user);
    }
  });

  document
    .getElementById("sub-btn-forgot")
    .addEventListener("click", function () {
      const email = document.getElementById("email-forgot");
      const errorContainer = document.querySelector(
        ".forgot-content .error-content"
      );

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      email.classList.remove("error");
      errorContainer.innerHTML = "";
      errorContainer.classList.add("hidden");

      if (!emailPattern.test(email.value.trim())) {
        email.classList.add("error");
        errorContainer.innerHTML =
          "<li class='error-message'>Please enter a valid email</li>";
        errorContainer.classList.remove("hidden");
      } else {
        console.log("Email entered:", email.value);
      }
    });
});
