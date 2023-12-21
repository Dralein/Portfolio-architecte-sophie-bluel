/* Affichage de la gallery en JS */
async function getWorks() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des travaux :', error);
    return [];
  }
}

async function displayWorks() {
  try {
    const works = await getWorks();

    const gallery = document.querySelector("#js-gallery");
    works.forEach((work) => {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      const figcaption = document.createElement('figcaption');

      img.src = work.imageUrl;
      img.alt = work.title;
      figcaption.textContent = work.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    });
  } catch (error) {
    console.error('Erreur lors de l\'affichage des travaux :', error);
  }
}

displayWorks();

/* Filtre */

async function displayCategorysButtons() {
  try {
    const response = await fetch('http://localhost:5678/api/categories');
    const categorys = await response.json();

    const filters = document.querySelector(".filters");
    categorys.forEach(({ id, name }) => {
      const btn = document.createElement("button");
      btn.textContent = name;
      btn.id = id;
      filters.appendChild(btn);
    });
  } catch (error) {
    console.error('Erreur :', error);
  }
}

displayCategorysButtons();


async function filterCategory() {
  const works = await getWorks();
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const btnId = e.target.id;
      const gallery = document.querySelector("#js-gallery");
      gallery.innerHTML = "";

      if (btnId !== "0") {
        const projectsFiltered = works.filter((work) => {
          return work.categoryId == btnId;
        });
        displayFilteredProjects(projectsFiltered);
      } else {
        displayWorks();
      }
    });
  });
}

function displayFilteredProjects(filteredWorks) {
  const gallery = document.querySelector("#js-gallery");
  filteredWorks.forEach((work) => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');

    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}
filterCategory();

document.addEventListener("DOMContentLoaded", () => {
  const logged = window.sessionStorage.logged;
  const admin = document.querySelector("header nav .admin");
  const logout = document.querySelector("header nav .logout");
  const modalContent = document.querySelector(".modal");
  const galleryModal = document.querySelector(".modal2");
  const xmark = document.querySelector(".modal .fa-xmark");

  if (logged === "true") {
    admin.textContent = "admin";
    logout.textContent = "logout";
    logout.addEventListener("click", () => {
      window.sessionStorage.logged = false;
    });
  }

  admin.addEventListener("click", () => {
    modalContent.style.display = "flex";
  });

  xmark.addEventListener("click", () => {
    modalContent.style.display = "none";
  });

  modalContent.addEventListener("click", (e) => {
    if (e.target === modalContent) {
      modalContent.style.display = "none";
    }
  });

  async function displayGalleryModal() {
    galleryModal.innerHTML = "";
    const gallery = await getWorks();
    gallery.forEach((galleryItem) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const span = document.createElement("span");
      const trash = document.createElement("i");
      trash.classList.add("fa-solid", "fa-trash-can");
      trash.id = galleryItem.id;
      img.src = galleryItem.imageUrl;
      span.appendChild(trash);
      figure.appendChild(span);
      figure.appendChild(img);
      galleryModal.appendChild(figure);
    });

    function deleteGallery() {
      const deleteTrash = document.querySelectorAll(".fa-trash-can");
      deleteTrash.forEach((trash) => {
        trash.addEventListener("click", (e) => {
          const id = trash.id;
          const init = {
            method: "DELETE",
            headers: { "content-Type": "application/json" },
          };
          fetch('http://localhost:5678/api/works/${id}', init)
            .then((response) => {
              if (!response.ok) {
                console.log("Le delete n'a pas marché !");
              }
              return response.json();
            })
            .then((data) => {
              console.log("Le delete a réussi voici la data :", data);
            });
        });
      });
    }
    deleteGallery();
  }

  displayGalleryModal();
});
