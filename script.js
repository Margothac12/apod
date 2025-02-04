const apiKey = 'CPZuGZ8VWzgHspBsYW17uwAEVfcRXuhCpgdNCw2n';
var favoritos = [] 

// Función para obtener la fecha en formato YYYY-MM-DD
function getFormattedDate(daysAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0]; // Obtener solo la parte de la fecha
}

// Función para establecer las fechas por defecto (últimos 30 días)
function setDefaultDates() {
  document.getElementById("start-date").value = getFormattedDate(29); // Hace 29 días
  document.getElementById("end-date").value = getFormattedDate(); // Hoy
}

function manejarFavorito(item, i) {
  let boton = document.getElementById(`item-${i}`)
  if(favoritos.includes(item)){
    favoritos = favoritos.filter((val) => val != item)
    boton.innerHTML = '<i class="bi bi-arrow-through-heart"></i>'
  }else{
    favoritos.push(item)
    boton.innerHTML = '<i class="bi bi-arrow-through-heart-fill"></i>'
  }
  const contenedor = document.getElementById("favs-gallery");
  contenedor.innerHTML = ""
  favoritos.forEach((item, i) =>{
    const card = document.createElement("div");
    card.classList.add("col-md-5", "mb-3");

    card.innerHTML = `
      <div class="card h-100">
        ${item.media_type === "image"
          ? `<img src="${item.url}" class="card-img-top" alt="${item.title}">`
          : `<iframe class="card-img-top" src="${item.url}" frameborder="0" allowfullscreen></iframe>`}
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  })
}

// Función para obtener imágenes de los últimos 30 días
function getApodGallery(startDate, endDate) {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("No se pudieron obtener las imágenes.");
      return response.json();
    })
    .then(data => {
      const mediaType = document.getElementById("media-type").value;
      const contenedor = document.getElementById("apod-gallery");
      contenedor.innerHTML = "";

      const ammount = document.getElementById("ammount").value || 30;

      data
        .filter(item => mediaType === "all" || item.media_type === mediaType) // Filtrar por tipo de contenido
        .slice(0, ammount) // Ahora muestra la cantidad seleccionbada
        .forEach((item, i) => {
          agregarItem(contenedor, item, i)
        });
    })
    .catch(error => console.error("Error obteniendo APOD:", error));
}

function agregarItem(contenedor, item, i){
  const card = document.createElement("div");
  card.classList.add("col-md-3", "mb-3");

  card.innerHTML = `
    <div class="card h-100">
      ${item.media_type === "image"
        ? `<img src="${item.url}" class="card-img-top" alt="${item.title}">`
        : `<iframe class="card-img-top" src="${item.url}" frameborder="0" allowfullscreen></iframe>`}
      <div class="card-body">
        <h5 id="item-title-${i}" class="card-title">${item.title}</h5>
        <p class="card-text">${item.explanation.substring(0, 100)}...</p>
        <p class="text-muted">${item.date}</p>
        <button class="btn btn-light" id="item-${i}"><i class="bi bi-arrow-through-heart"></i></button> 
      </div>
    </div>
  `;
  contenedor.appendChild(card);
  document.getElementById(`item-${i}`).addEventListener("click", () => {
    manejarFavorito(item, i);
  })
  document.getElementById(`item-title-${i}`).addEventListener("click", () => {
    document.getElementById("detalleModalLabel").innerText = item.title
    document.getElementById("detalleTexto").innerText = item.explanation
    document.getElementById("detalleFecha").innerText = item.date
    document.getElementById("detalleImagen").innerHTML = `${item.media_type === "image"
      ? `<img src="${item.url}" class="card-img-top" alt="${item.title}">`
      : `<iframe class="card-img-top" src="${item.url}" frameborder="0" allowfullscreen></iframe>`}`
    const modal = new bootstrap.Modal('#detalleModal', {})
    modal.show()
  })
}

// Evento para buscar imágenes con filtros
document.getElementById("buscar-apod").addEventListener("click", () => {
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;

  if (startDate && endDate) {
    getApodGallery(startDate, endDate);
  }
});

// Establecer fechas por defecto y cargar las últimas 30 imágenes al iniciar
document.addEventListener("DOMContentLoaded", () => {
  setDefaultDates();
  getApodGallery(getFormattedDate(29), getFormattedDate()); // Últimos 30 días
});
