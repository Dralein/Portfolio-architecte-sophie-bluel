const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
const form = document.querySelector("form");
const messageErreur = document.getElementById("messageErreur");

async function login() {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userEmail = email.value;
    const userPwd = password.value;

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          password: userPwd,
        }),
      });

      if (response.ok) {
        const user = await response.json();

        if (user.token) {
          window.sessionStorage.setItem("token", user.token);
          window.sessionStorage.logged = true;
          window.location.href = "index.html";
        } else {
          email.classList.add("inputErrorLogin");
          password.classList.add("inputErrorLogin");
          messageErreur.textContent =
            "Votre email ou votre mot de passe est incorrect";
        }
      } else {
        throw new Error("Erreur de connexion");
      }
    } catch (error) {
      console.error("Erreur :", error);
      email.classList.add("inputErrorLogin");
      password.classList.add("inputErrorLogin");
      messageErreur.textContent =
        "Une erreur s'est produite lors de la connexion.";
    }
  });
}

login();
