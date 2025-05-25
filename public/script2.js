let loginButton = document.getElementById("login-btn");

window.addEventListener("load", () => {
    let user = localStorage.getItem("user");
    if (user) {
       window.location.href = "/index.html"
    }
})

loginButton.addEventListener("click", function (e) {
  e.preventDefault();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let data = {username: username, password: password};
  
  $.post("/user",data, (response) => {
    if (response) {
        localStorage.setItem("user", response.data.userId);
        window.location.href = "/index.html";
    }
  })}
)