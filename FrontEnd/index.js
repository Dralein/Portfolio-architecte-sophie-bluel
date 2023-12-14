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

