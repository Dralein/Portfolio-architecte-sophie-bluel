/* Affichage de la gallery en JS */
async function getWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des travaux :", error);
    return [];
  }
}

async function displayWorks() {
  try {
    const works = await getWorks();

    const gallery = document.querySelector("#js-gallery");
    gallery.innerHTML = "";
    works.forEach((work) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const figcaption = document.createElement("figcaption");

      img.src = work.imageUrl;
      img.alt = work.title;
      figcaption.textContent = work.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    });
  } catch (error) {
    console.error("Erreur lors de l'affichage des travaux :", error);
  }
}

displayWorks();

/* Filtre */

async function getCategorys() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}

async function displayCategorysButtons() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categorys = await response.json();

    const filters = document.querySelector(".filters");
    categorys.forEach(({ id, name }) => {
      const btn = document.createElement("button");
      btn.textContent = name;
      btn.id = id;
      filters.appendChild(btn);
    });
  } catch (error) {
    console.error("Erreur :", error);
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

async function displayFilteredProjects(filteredWorks) {
  const gallery = document.querySelector("#js-gallery");
  filteredWorks.forEach(async(work) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    img.src = work.imageUrl;
    img.alt = work.title;
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}
filterCategory();

const logged = window.sessionStorage.logged;
const admin = document.querySelector(".admin");
const edit = document.getElementById("edit1");
const logout = document.querySelector("header nav .logout");
const modalContent = document.querySelector(".modal");
const galleryModal = document.querySelector(".modalinterior");
const xmark = document.querySelector(".modal .fa-xmark");
const addImg = document.getElementById("addimg");
const leftmark = document.getElementById("leftarrow");
const modality2 = document.querySelector(".modal2");
const iconmark2 = document.getElementById("iconmark2");
const addImgButton = document.getElementById("addimg1");

if (logged === "true") {
  edit.style.display = "flex";
  const iconElement = document.createElement("i");
  iconElement.classList.add("fa-solid", "fa-pen-to-square");
  admin.appendChild(iconElement);
  admin.appendChild(document.createTextNode(" "));
  const textElement = document.createElement("span");
  textElement.textContent = "modifier";
  admin.appendChild(textElement);
  logout.textContent = "logout";
  logout.addEventListener("click", () => {
    window.sessionStorage.logged = false;
    window.sessionStorage.token = false;
    location.reload(true);
  });
}

admin.addEventListener("click", () => {
  modalContent.style.display = "flex";
});

iconmark2.addEventListener("click", () => {
  modality2.style.display = "none";
  modalContent.style.display = "none";
});

xmark.addEventListener("click", () => {
  modality2.style.display = "none";
  modalContent.style.display = "none";
});

modalContent.addEventListener("click", (e) => {
  if (e.target === modalContent) {
    modalContent.style.display = "none";
  }
});

modality2.addEventListener("click", (e) => {
  if (e.target === modality2) {
    modality2.style.display = "none";
    modalContent.style.display = "none";
  }
});

xmark.addEventListener("click", () => {
  modality2.style.display = "none";
});

async function displayGalleryModal() {
  galleryModal.innerHTML = "";
  const gallery = await getWorks();
  gallery.forEach((galleryItem) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const span = document.createElement("span");
    const trash = document.createElement("i");
    figure.classList.add("gallerymodalflex")
    trash.classList.add("fa-solid", "fa-trash-can");
    span.classList.add("trashicon");
    trash.id = galleryItem.id;
    img.src = galleryItem.imageUrl;
    span.appendChild(trash);
    figure.appendChild(span);
    figure.appendChild(img);
    galleryModal.appendChild(figure);
  });
  deleteGallery();
}

displayGalleryModal();
async function deleteGallery() {
  const deleteTrash = document.querySelectorAll(".fa-trash-can");
  deleteTrash.forEach((trash) => {
    trash.addEventListener("click", async (e) => {
      e.preventDefault();
      const id = trash.id;
      const token = sessionStorage.getItem("token");
      const init = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const response = await fetch(
          `http://localhost:5678/api/works/${id}`,
          init
        );
        if (response.ok) {
          console.log("Image supprimée avec succès !");
          const figure = trash.closest("figure");
          if (figure) {
            figure.remove();
          }
          await filterCategory();
          await displayGalleryModal();
          await displayWorks();
        } else {
          console.error("Erreur lors de la suppression de l'image.");
        }
      } catch (error) {
        console.error("Erreur :", error);
      }
    });
  });
}

addImg.addEventListener("click", () => {
  modality2.style.display = "flex";
  modalContent.style.display = "flex";
});

leftmark.addEventListener("click", () => {
  modalContent.style.display = "flex";
  modality2.style.display = "none";
});

function isFormValid() {
  const imageInput = document.getElementById("undisplayfile");
  const titleInput = document.getElementById("titleInput");
  const isFilled =
    imageInput.files &&
    imageInput.files.length > 0 &&
    titleInput.value.trim() !== "";
  return isFilled;
}

document.getElementById("undisplayfile").addEventListener("change", () => {
  updateFormState();
});

document.getElementById("titleInput").addEventListener("input", () => {
  updateFormState();
});

function updateFormState() {
  const isFormReady = isFormValid();
  updateButtonState();
}

function updateButtonState() {
  const isFormReady = isFormValid();
  addImgButton.style.backgroundColor = isFormReady ? "#FFFFFF" : "#A7A7A7";
  addImgButton.style.borderColor = isFormReady ? "#1D6154" : "#A7A7A7";
  addImgButton.style.color = isFormReady ? "#1D6154" : "#FFFFFF";
  addImgButton.disabled = !isFormReady;
  if (isFormReady) {
    addImgButton.style.cursor = "pointer";
    addImgButton.onmouseover = function() {
      addImgButton.style.backgroundColor = "#1D6154";
      addImgButton.style.color = "#FFFFFF";
  };
   addImgButton.onmouseout = function() {
      addImgButton.style.backgroundColor = ""; 
      addImgButton.style.color = ""; 
  };
  } else {
    addImgButton.onmouseover = null;
    addImgButton.onmouseout = null;
    addImgButton.style.cursor = "default";
  }
}

updateButtonState();

async function addGallery() {
  addImgButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append(
      "image",
      document.getElementById("undisplayfile").files[0]
    );
    formData.append("title", document.getElementById("titleInput").value);
    formData.append(
      "category",
      document.getElementById("categoryIdInput").value
    );
    const token = window.sessionStorage.getItem("token");
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    };
    try {
      const response = await fetch(
        "http://localhost:5678/api/works",
        options
      );
      if (response.ok) {
        console.log("Image envoyée avec succès !");
        const responseData = await response.json();
        const newImage = document.createElement("img");
        newImage.src = responseData.imageUrl;
        const gallery = document.querySelector("#js-gallery");
        const figure = document.createElement("figure");
        figure.appendChild(newImage);
        gallery.appendChild(figure);
        filterCategory();
        displayGalleryModal();
        displayWorks();
      } else {
        console.error("Erreur lors de l'envoi de l'image.");
      }
    } catch (error) {
      console.error("Erreur :", error);
    }
  });
}
addGallery();

const editDiv = document.getElementById("edit1");
if (logged === "false") {
  editDiv.parentNode.removeChild(editDiv);
}

function previewImage(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("preview").innerHTML =
        '<img src="' + e.target.result + '">';
      document.getElementById("modalPreview").style.display = "none";
    };
    reader.readAsDataURL(input.files[0]);
  }
}

async function displayCategoryModal() {
  const select = document.querySelector(".modal2 select");
  const categorys = await getCategorys();
  categorys.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}
displayCategoryModal();