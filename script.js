// ── Gallery data — add your own entries here ──
const gallery = [
  {
    src: "afrofashionfest.jpeg",
    title: "AfroFashion Fest Infusion",
    tag: "Event Poster",
  },

  {
    src: "Brand.png",
    title: "Ina's Atelier ",
    tag: "Brand Identity",
  },

  {
    src: "Christmas wishes.jpg",
    title: "Merry Christmas",
    tag: "Event Poster",
  },

  {
    src: "Frost vortex.jpg",
    title: "Frost Vortex",
    tag: "Event Poster",
  },
];

// ── Navigation ──
function show(id) {
  document
    .querySelectorAll("section")
    .forEach((s) => s.classList.remove("active"));
  document
    .querySelectorAll(".nav-links a")
    .forEach((a) => a.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelectorAll(".nav-links a").forEach((a) => {
    if (
      a.getAttribute("onclick") &&
      a.getAttribute("onclick").includes("'" + id + "'")
    ) {
      a.classList.add("active");
    }
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById("navLinks").classList.remove("open");
}

// ── Hamburger ──
document.getElementById("hamburger").addEventListener("click", function () {
  document.getElementById("navLinks").classList.toggle("open");
});

// ── Project count ──
function updateCount() {
  const n = gallery.length;
  document.getElementById("workCount").textContent =
    n + " Project" + (n !== 1 ? "s" : "");
}

// ── Bulk upload ──
function addImages(input) {
  Array.from(input.files).forEach((file) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const title = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      gallery.push({ src: e.target.result, title: title, tag: "Design" });
      renderGallery();
    };
    reader.readAsDataURL(file);
  });
  input.value = "";
}

// ── Single slot upload ──
function addSingleImage(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const title = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    gallery.push({ src: e.target.result, title: title, tag: "Design" });
    renderGallery();
  };
  reader.readAsDataURL(file);
  input.value = "";
}

// ── Render gallery grid ──
function renderGallery() {
  const grid = document.getElementById("worksGrid");
  grid.innerHTML = "";
  gallery.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "work-card";
    card.onclick = () => openLightbox(i);
    card.innerHTML = `<img src="${item.src}" alt="${item.title}"><div class="work-overlay"><p class="work-title">${item.title}</p><span class="work-tag">${item.tag}</span></div>`;
    grid.appendChild(card);
  });
  for (let j = 0; j < 2; j++) {
    const empty = document.createElement("div");
    empty.className = "work-card-empty";
    empty.innerHTML = `<div class="plus">+</div><span>Add project</span><input type="file" accept="image/*" onchange="addSingleImage(this)">`;
    grid.appendChild(empty);
  }
  updateCount();
}

// ── Lightbox ──
let lbIndex = 0;

function openLightbox(i) {
  lbIndex = i;
  const item = gallery[i];
  document.getElementById("lbImg").src = item.src;
  document.getElementById("lbTitle").textContent = item.title;
  document.getElementById("lbTag").textContent = item.tag;
  document.getElementById("lightbox").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
  document.body.style.overflow = "";
}

function closeLightboxOutside(e) {
  if (e.target === document.getElementById("lightbox")) closeLightbox();
}

function lbNav(dir) {
  lbIndex = (lbIndex + dir + gallery.length) % gallery.length;
  openLightbox(lbIndex);
}

// ── Contact form ──
function submitForm() {
  const name = document.getElementById("fname").value.trim();
  const email = document.getElementById("femail").value.trim();
  const message = document.getElementById("fmessage").value.trim();
  if (!name || !email || !message) {
    alert("Please fill in your name, email, and message.");
    return;
  }
  if (!email.includes("@") || !email.includes(".")) {
    alert("Please enter a valid email address.");
    return;
  }
  document.getElementById("formSuccess").style.display = "block";
  document.querySelector(".form-submit").style.display = "none";
  setTimeout(() => {
    ["fname", "femail", "ftype", "fbudget", "fmessage"].forEach(
      (id) => (document.getElementById(id).value = ""),
    );
    document.getElementById("formSuccess").style.display = "none";
    document.querySelector(".form-submit").style.display = "inline-block";
  }, 4000);
}

// ── Keyboard shortcuts ──
document.addEventListener("keydown", function (e) {
  if (document.getElementById("lightbox").classList.contains("open")) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") lbNav(1);
    if (e.key === "ArrowLeft") lbNav(-1);
    return;
  }
  const sections = ["home", "work", "about", "services", "contact"];
  const current = sections.find((s) =>
    document.getElementById(s).classList.contains("active"),
  );
  const idx = sections.indexOf(current);
  if (e.key === "ArrowRight" && idx < sections.length - 1)
    show(sections[idx + 1]);
  if (e.key === "ArrowLeft" && idx > 0) show(sections[idx - 1]);
});

// ── Init ──
renderGallery();
