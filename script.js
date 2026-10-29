document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const navItems = document.querySelectorAll(".nav-link");
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const submittedData = document.getElementById("submittedData");

  // Tahun otomatis di footer.
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  // Fitur kreativitas 1: dark mode.
  themeToggle.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark-mode");
    themeToggle.textContent = isDark ? "☀" : "☾";
    themeToggle.setAttribute("aria-label", isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap");
  });

  // Navigasi mobile.
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Tutup menu navigasi" : "Buka menu navigasi");
  });

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Fitur kreativitas 2: progress bar skill dengan animasi.
  const progressObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = `${fill.dataset.progress}%`;
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll(".progress-fill").forEach((bar) => progressObserver.observe(bar));

  // Membantu menunjukkan bagian navigasi yang sedang dilihat.
  const sections = document.querySelectorAll("main section[id]");
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItems.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach((section) => sectionObserver.observe(section));

  // Fungsi untuk menampilkan atau menghapus pesan kesalahan.
  function setError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    field.classList.toggle("invalid", Boolean(message));
    field.setAttribute("aria-invalid", String(Boolean(message)));
    error.textContent = message;
  }

  // Validasi form: input wajib, format email, notifikasi, dan ringkasan data.
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    let valid = true;
    setError("name", "nameError", "");
    setError("email", "emailError", "");
    setError("message", "messageError", "");
    formStatus.textContent = "";
    formStatus.className = "form-status";

    if (!name) {
      setError("name", "nameError", "Nama wajib diisi.");
      valid = false;
    }
    if (!email) {
      setError("email", "emailError", "Email wajib diisi.");
      valid = false;
    } else if (!emailPattern.test(email)) {
      setError("email", "emailError", "Format email belum benar. Contoh: nama@email.com");
      valid = false;
    }
    if (!message) {
      setError("message", "messageError", "Pesan wajib diisi.");
      valid = false;
    }

    if (!valid) {
      formStatus.textContent = "Periksa kembali kolom yang ditandai sebelum mengirim.";
      formStatus.classList.add("error");
      const firstInvalid = form.querySelector(".invalid");
      if (firstInvalid) firstInvalid.focus();
      submittedData.hidden = true;
      return;
    }

    formStatus.textContent = "Berhasil! Formulir lolos validasi JavaScript.";
    formStatus.classList.add("success");

    // Menampilkan data yang dikirim ke halaman dengan textContent agar aman.
    submittedData.replaceChildren();
    const heading = document.createElement("h4");
    heading.textContent = "Ringkasan pesan";
    submittedData.appendChild(heading);

    [
      ["Nama", name],
      ["Email", email],
      ["Pesan", message]
    ].forEach(([label, value]) => {
      const paragraph = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = `${label}: `;
      paragraph.appendChild(strong);
      paragraph.appendChild(document.createTextNode(value));
      submittedData.appendChild(paragraph);
    });
    submittedData.hidden = false;
    submittedData.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  // Bersihkan pesan error saat pengguna mulai memperbaiki isian.
  ["name", "email", "message"].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => {
      const errorId = `${id}Error`;
      if (document.getElementById(id).value.trim()) {
        setError(id, errorId, "");
      }
    });
  });
});
