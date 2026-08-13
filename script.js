document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const menuSections = document.querySelectorAll(".menu-section");

  // Toggle sidebar (mobile)
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", (e) => {
      const isActive = sidebar.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", isActive ? "true" : "false");
      e.stopPropagation();
    });
  }

  // Click outside to close sidebar on mobile
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(e.target) && e.target !== menuToggle) {
        sidebar.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    }
  });

  // Accordion behavior for top-level sections on mobile
  function setupSectionToggle() {
    menuSections.forEach(section => {
      const toggle = section.querySelector(".menu-link");
      if (!toggle) return;

      toggle.addEventListener("click", (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const isOpen = section.classList.toggle("open");
          toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");

          // Close others
          menuSections.forEach(s => {
            if (s !== section) {
              s.classList.remove("open");
              const t = s.querySelector(".menu-link");
              if (t) t.setAttribute("aria-expanded", "false");
            }
          });
        }
      });
    });
  }

  setupSectionToggle();
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      sidebar.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      menuSections.forEach(s => s.classList.remove("open"));
    }
  });

  // Load menu from JSON and render items
  async function loadMenu() {
    try {
      const res = await fetch("data.json", { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();

      const render = (id, items) => {
        const ul = document.getElementById(id);
        if (!ul) return;
        ul.innerHTML = ""; // clear

        // Lọc bỏ các item bị trống tên hoặc link
        const validItems = items.filter(item => item.name && item.name.trim() !== "");

        validItems.forEach((item) => {
          const li = document.createElement("li");
          li.className = "tablinks";
          li.setAttribute("role", "none");

          const a = document.createElement("a");
          a.setAttribute("role", "menuitem");
          a.setAttribute("tabindex", "0");
          a.href = item.link || "#";
          if (item.link && item.link !== "#") {
            a.target = "_blank";
          }
          a.rel = "noopener noreferrer";

          const iconSpan = document.createElement("span");
          iconSpan.className = "menu-icon";
          const i = document.createElement("i");
          i.className = item.icon || "fas fa-angle-right";
          iconSpan.appendChild(i);

          const textSpan = document.createElement("span");
          textSpan.className = "menu-text";
          textSpan.textContent = item.name;

          a.appendChild(iconSpan);
          a.appendChild(textSpan);

          // Click handler
          a.addEventListener("click", (e) => {
            ul.querySelectorAll(".tablinks").forEach(n => n.classList.remove("active"));
            li.classList.add("active");

            if (window.innerWidth <= 768) {
              sidebar.classList.remove("active");
              menuToggle.setAttribute("aria-expanded", "false");
            }

            if (a.target !== "_blank") {
              e.preventDefault();
              const newsBox = document.querySelector(".news-box");
              if (newsBox) {
                newsBox.innerHTML = `<h1>${item.name}</h1><p><a href="${item.link}" target="_blank">Xem liên kết tại đây</a></p>`;
              }
            }
          });

          li.appendChild(a);
          ul.appendChild(li);
        });
      };

      // Đổ dữ liệu tương ứng với cấu trúc trong JSON
      if (Array.isArray(data.phim_1)) render("menu-phim-1", data.phim_1);
      if (Array.isArray(data.phim_2)) render("menu-phim-2", data.phim_2);
      if (Array.isArray(data.phim_3)) render("menu-phim-3", data.phim_3);
      if (Array.isArray(data.phim_4)) render("menu-phim-4", data.phim_4);

    } catch (err) {
      console.error("Lỗi load menu:", err);
    }
  }

  loadMenu();
});