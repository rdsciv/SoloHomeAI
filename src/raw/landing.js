(function () {
      var root = document.documentElement;
      var header = document.getElementById("site-header");
      var themeBtn = document.getElementById("theme-toggle");
      var menuBtn = document.getElementById("menu-btn");
      var mobileNav = document.getElementById("mobile-nav");

      var stored = null;
      try { stored = localStorage.getItem("solohome-theme"); } catch (e) {}
      if (stored === "light" || stored === "dark") {
        root.setAttribute("data-theme", stored);
      }

      themeBtn.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
        root.setAttribute("data-theme", next);
        try { localStorage.setItem("solohome-theme", next); } catch (e) {}
      });

      function onScroll() {
        if (window.scrollY > 8) header.classList.add("is-scrolled");
        else header.classList.remove("is-scrolled");
      }
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });

      menuBtn.addEventListener("click", function () {
        var open = menuBtn.getAttribute("aria-expanded") === "true";
        menuBtn.setAttribute("aria-expanded", String(!open));
        if (open) {
          mobileNav.classList.remove("open");
          mobileNav.hidden = true;
        } else {
          mobileNav.hidden = false;
          mobileNav.classList.add("open");
        }
      });

      mobileNav.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          menuBtn.setAttribute("aria-expanded", "false");
          mobileNav.classList.remove("open");
          mobileNav.hidden = true;
        });
      });
    })();
