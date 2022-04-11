function loginAjax(event) {
  let username = document.getElementById("username").value; // Get the username from the form
  let password = document.getElementById("password").value; // Get the password from the form

  // Make a URL-encoded string for passing POST data:
  let data = { 'username': username, 'password': password };

  fetch("login_ajax.php", {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then(response => response.json())

    .then(function (data) {

      console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`)
      if (data.success) {
        document.getElementById('register').style.display = "none"
        document.getElementById('Login').style.display = "none"
        document.getElementById('logout').style.display = "inline";
        sessionStorage.setItem("username", "logintrue");
      }
      else {
        alert("login failed");
      }
    });
}
document.getElementById("login_btn").addEventListener("click", loginAjax, false); // Bind the AJAX call to button click








function registerAjax(event) {
  let username = document.getElementById("regi_username").value; // Get the username from the form
  let password = document.getElementById("regi_password").value; // Get the password from the form

  // Make a URL-encoded string for passing POST data:
  let data = { 'username': username, 'password': password };

  fetch("register.php", {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'content-type': 'application/json' }
  })
    .then(response => response.json())
    .then(data => console.log(data.success ? "You've been registered!" : `failed to register ${data.message}`));
    alert ("registered");
}
document.getElementById("register_btn").addEventListener("click", registerAjax, false); // Bind the AJAX call to button click









function logoutAjax(event) {
  let username = document.getElementById("regi_username").value; // Get the username from the form
  let password = document.getElementById("regi_password").value; // Get the password from the form

  // Make a URL-encoded string for passing POST data:
  let data = { 'username': username, 'password': password };

  fetch("logout.php", {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'content-type': 'application/json' }
  })
    .then(response => response.json())
    .then(data => console.log(data.success ? "You've been registered!" : `failed to register ${data.message}`));
    alert ("logged out");
    document.getElementById('register').style.display = "inline" 
    document.getElementById('Login').style.display = "block"
    document.getElementById('logout').style.display = "none"
}
document.getElementById("logout_btn").addEventListener("click", logoutAjax, false); // Bind the AJAX call to button click




$(document).ready(function pageLoad() {
  fetch("refresh.php", {
         method: 'POST',
         headers: { 'content-type': 'application/json',
        'accept' :'application/json'  }
     })
     .then(response => response.json())
     .then(function(res){
         //console.log("fetched data", res);
         if(res.success){
             //console.log(res);
             token = res.token;
             showEvents();
             document.getElementById("box").display = "hidden";
             document.getElementById("logout_btn").display = "inline";
             document.getElementById("search").display = "inline";
         } 
     });
});