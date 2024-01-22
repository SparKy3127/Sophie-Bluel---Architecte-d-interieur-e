const modal = document.querySelector("#menu-projets");

const openModal = (e) => {
  e.preventDefault();
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("mousedown", closeModal);
  modal.querySelector("#close-modal").addEventListener("mousedown", closeModal);
  modal
    .querySelector(".modal-stop")
    .addEventListener("mousedown", stopPropagation);
};

const closeModal = (e) => {
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("mousedown", closeModal);
};

const stopPropagation = (e) => {
  e.stopPropagation();
};

const bonton = document.querySelector(".modifier");
if (bonton) {
  bonton.addEventListener("click", openModal);
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
});

// suppression des figcaption dans la modal
function styleimg() {
  const figcaptions = document.querySelectorAll(".modal figcaption");
  figcaptions.forEach((figcaption) => {
    figcaption.remove();
  });
  // ajout icon poubelle sur chaque image dans la modal
  const figure = document.querySelectorAll(".modal figure");
  figure.forEach((figure) => {
    const poubelle = document.createElement("img");
    poubelle.dataset.id = figure.getAttribute("data-id");
    poubelle.src = "assets/icons/trash-can-solid.png";
    poubelle.classList.add("poubelle");
    figure.appendChild(poubelle);
  });
}
styleimg();

import { GenererProjet, recupererProjet } from "./projet.js";

const poubelle = document.querySelectorAll(".poubelle");
console.log(poubelle);

document.querySelector("#contenue").addEventListener("click", async (e) => {
  if (e.target.classList.contains("poubelle")) {
    console.log("click");
    e.preventDefault();
    const id = e.target.dataset.id;
    const token = window.sessionStorage.getItem("token");
    try {
      const reponse = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (reponse.ok) {
        const suppression = reponse.ok;
        window.sessionStorage.setItem(
          "suppression",
          JSON.stringify(suppression)
        );
        window.sessionStorage.removeItem("projet");
        const projet = await recupererProjet();
        document.querySelector(".galerie").innerHTML = "";
        document.querySelector("#contenue").innerHTML = "";
        GenererProjet(projet, ".galerie");
        GenererProjet(projet, "#contenue");
        styleimg();
      }
    } catch (error) {
      console.error(error);
    }
  }
});
