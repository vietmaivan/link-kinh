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

  // Accordion behavior - expand/collapse on click
  function setupSectionToggle() {
    menuSections.forEach(section => {
      const toggle = section.querySelector(".menu-link");
      if (!toggle) return;

      toggle.setAttribute("aria-expanded", "false");

      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        
        const isOpen = section.classList.toggle("open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");

        const arrow = toggle.querySelector(".arrow-icon");
        if (arrow) {
          arrow.classList.toggle("rotated");
        }

        if (window.innerWidth > 768) {
          menuSections.forEach(s => {
            if (s !== section) {
              s.classList.remove("open");
              const t = s.querySelector(".menu-link");
              const arr = t ? t.querySelector(".arrow-icon") : null;
              if (t) {
                t.setAttribute("aria-expanded", "false");
                if (arr) arr.classList.remove("rotated");
              }
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
      
      menuSections.forEach(s => {
        s.classList.remove("open");
        const t = s.querySelector(".menu-link");
        const arr = t ? t.querySelector(".arrow-icon") : null;
        if (t) {
          t.setAttribute("aria-expanded", "false");
          if (arr) arr.classList.remove("rotated");
        }
      });
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
        ul.innerHTML = "";

        if (!Array.isArray(items)) return;

        items.forEach((item) => {
          const li = document.createElement("li");
          li.className = "tablinks";
          li.setAttribute("role", "none");

          const a = document.createElement("a");
          a.setAttribute("role", "menuitem");
          a.setAttribute("tabindex", "0");
          a.href = item.link || "#";
          if (item.link && item.link !== "#") a.target = "_blank";
          a.rel = "noopener noreferrer";

          const iconSpan = document.createElement("span");
          iconSpan.className = "menu-icon";
          const i = document.createElement("i");
          i.className = item.icon || "fas fa-angle-right";
          iconSpan.appendChild(i);

          const textSpan = document.createElement("span");
          textSpan.className = "menu-text";
          textSpan.textContent = item.name || "Untitled";

          a.appendChild(iconSpan);
          a.appendChild(textSpan);

          if (item.badge) {
            const badge = document.createElement("span");
            badge.className = "menu-badge";
            badge.textContent = item.badge;
            a.appendChild(badge);
          }

          a.addEventListener("click", () => {
            ul.querySelectorAll(".tablinks").forEach(n => n.classList.remove("active"));
            li.classList.add("active");

            if (window.innerWidth <= 768) {
              sidebar.classList.remove("active");
              menuToggle.setAttribute("aria-expanded", "false");
            }
          });

          li.appendChild(a);
          ul.appendChild(li);
        });
      };

      // Đầy đủ từ kinh_1 đến kinh_7 khớp với JSON mới
      render("menu-kinh-1", data.kinh_1);
      render("menu-kinh-2", data.kinh_2);
      render("menu-kinh-3", data.kinh_3);
      render("menu-kinh-4", data.kinh_4);
      render("menu-kinh-5", data.kinh_5);
      render("menu-kinh-6", data.kinh_6);
      render("menu-kinh-7", data.kinh_7);

    } catch (err) {
      console.error("Lỗi load menu:", err);
    }
  }

  loadMenu();
});