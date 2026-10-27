/* ===== Data lagu ===== */
const tracks = [
  { judul: "Senja di Kota",     artis: "Laras Mahendra",   genre: "Pop",        durasi: 215, warna: "url(image/1.jpg) center/cover" },
  { judul: "Hujan Pertama",     artis: "Naya & Kelana",    genre: "Akustik",    durasi: 188, warna: "url(image/2.jpg) center/cover" },
  { judul: "Lampu Merah",       artis: "Trio Sarasvati",   genre: "Jazz",       durasi: 242, warna: "url(image/3.jpg) center/cover" },
  { judul: "Frekuensi Malam",   artis: "DJ Arunika",       genre: "Elektronik", durasi: 201, warna: "url(image/4.jpg) center/cover" },
  { judul: "Pulang Lebih Awal", artis: "Bima Prakasa",     genre: "Pop",        durasi: 197, warna: "url(image/5.jpg) center/cover" },
  { judul: "Kopi dan Gitar",    artis: "Sendu Senja",      genre: "Akustik",    durasi: 176, warna: "url(image/6.jpg) center/cover" },
  { judul: "Blue Monsoon",      artis: "Dewangga Quartet", genre: "Jazz",       durasi: 259, warna: "url(image/7.jpg) center/cover" },
  { judul: "Pulse 128",         artis: "Kaisa",            genre: "Elektronik", durasi: 223, warna: "url(image/8.jpg) center/cover" }
];

/* ===== Elemen DOM ===== */
const $ = (id) => document.getElementById(id);
const player = $("player"), cover = $("cover"), judulEl = $("title"), artisEl = $("artist");
const seek = $("seek"), cur = $("cur"), dur = $("dur"), playBtn = $("play");
const grid = $("grid");

let index = 0, waktu = 0, sedangPutar = false, timer = null;

const format = (d) => `${Math.floor(d / 60)}:${String(Math.floor(d % 60)).padStart(2, "0")}`;

/* ===== Pemutar ===== */
function muatLagu(i, putar = false) {
  index = (i + tracks.length) % tracks.length;
  const t = tracks[index];
  waktu = 0;
  cover.style.background = t.warna;
  judulEl.textContent = t.judul;
  artisEl.textContent = `${t.artis} · ${t.genre}`;
  dur.textContent = format(t.durasi);
  seek.max = t.durasi;
  perbaruiProgres();
  tandaiKartu();
  atur(putar);
}

function atur(putar) {
  sedangPutar = putar;
  player.classList.toggle("on", putar);
  playBtn.textContent = putar ? "⏸" : "▶";
  playBtn.setAttribute("aria-label", putar ? "Jeda" : "Putar");
  clearInterval(timer);
  if (putar) {
    timer = setInterval(() => {
      waktu += 1;
      if (waktu >= tracks[index].durasi) return muatLagu(index + 1, true);
      perbaruiProgres();
    }, 1000);
  }
}

function perbaruiProgres() {
  seek.value = waktu;
  cur.textContent = format(waktu);
}

playBtn.addEventListener("click", () => atur(!sedangPutar));
$("next").addEventListener("click", () => muatLagu(index + 1, sedangPutar));
$("prev").addEventListener("click", () => muatLagu(waktu > 3 ? index : index - 1, sedangPutar));
seek.addEventListener("input", () => { waktu = Number(seek.value); perbaruiProgres(); });

/* ===== Daftar lagu & filter genre ===== */
function tampilkanKartu(genre = "Semua") {
  grid.innerHTML = "";
  tracks.forEach((t, i) => {
    if (genre !== "Semua" && t.genre !== genre) return;
    const kartu = document.createElement("button");
    kartu.className = "song";
    kartu.dataset.i = i;
    kartu.innerHTML = `<div class="art" style="background:${t.warna}"></div><strong>${t.judul}</strong><span>${t.artis}</span>`;
    kartu.addEventListener("click", () => {
      muatLagu(i, true);
      player.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    grid.appendChild(kartu);
  });
  tandaiKartu();
}

function tandaiKartu() {
  grid.querySelectorAll(".song").forEach((k) =>
    k.classList.toggle("current", Number(k.dataset.i) === index));
}

$("tabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (!tab) return;
  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
  tab.classList.add("active");
  tampilkanKartu(tab.dataset.g);
});

/* ===== Sakelar harga bulanan / tahunan ===== */
$("billing").addEventListener("change", (e) => {
  ["p1", "p2"].forEach((id) => {
    const el = $(id);
    el.textContent = e.target.checked ? el.dataset.y : el.dataset.m;
  });
});

/* ===== FAQ akordeon ===== */
$("faq").addEventListener("click", (e) => {
  const q = e.target.closest(".q");
  if (!q) return;
  const buka = q.getAttribute("aria-expanded") === "true";
  document.querySelectorAll(".q").forEach((b) => {
    b.setAttribute("aria-expanded", "false");
    b.nextElementSibling.style.maxHeight = null;
  });
  if (!buka) {
    q.setAttribute("aria-expanded", "true");
    q.nextElementSibling.style.maxHeight = q.nextElementSibling.scrollHeight + "px";
  }
});

/* ===== Validasi formulir (Bootstrap) ===== */
const form = $("form"), hasil = $("hasil");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  hasil.innerHTML = "";
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }
  const data = new FormData(form);
  const alert = document.createElement("div");
  alert.className = "alert alert-success";
  const judul = document.createElement("strong");
  judul.textContent = "Pendaftaran berhasil. Data yang Anda isi:";
  const daftar = document.createElement("ul");
  daftar.className = "mb-0 mt-2";
  data.forEach((nilai, kunci) => {
    const li = document.createElement("li");
    li.textContent = `${kunci}: ${nilai}`;
    daftar.appendChild(li);
  });
  alert.append(judul, daftar);
  hasil.appendChild(alert);
  form.reset();
  form.classList.remove("was-validated");
});

/* ===== Menu mobile & bayangan navbar ===== */
const burger = $("burger"), menu = $("menu");
burger.addEventListener("click", () => {
  const buka = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", buka);
});
menu.addEventListener("click", (e) => {
  if (e.target.tagName === "A") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
});
window.addEventListener("scroll", () => $("nav").classList.toggle("scrolled", window.scrollY > 10));

/* ===== Inisialisasi ===== */
tampilkanKartu();
muatLagu(0, false);