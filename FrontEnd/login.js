const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
const form = document.querySelector("form");
const messageErreur = document.querySelector(".login p");

async function login() {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userEmail = email.value;
    const userPwd = password.value;

    try {
      const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userEmail,
          password: userPwd
        })
      });

      if (response.ok) {
        const user = await response.json();

        if (user && user.admin === true) {
          window.sessionStorage.loged = true;
          window.location.href = "index.html";
        } else {
          email.classList.add("inputErrorLogin");
          password.classList.add("inputErrorLogin");
          messageErreur.textContent = "Votre email ou votre mot de passe est incorrect";
        }
      } else {
        throw new Error('Erreur de connexion');
      }
    } catch (error) {
      console.error('Erreur :', error);
      email.classList.add("inputErrorLogin");
      password.classList.add("inputErrorLogin");
      messageErreur.textContent = "Une erreur s'est produite lors de la connexion.";
    }
  });
}

login();  