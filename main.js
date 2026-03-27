(() => {
  const hamburger = document.querySelector(".hamburger");
  const navlist = document.querySelector(".navlist");

  if (hamburger && navlist) {
    hamburger.addEventListener("click", () => {
      navlist.classList.toggle("open");
      hamburger.classList.toggle("open");
    });

    navlist.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (navlist.classList.contains("open")) {
          navlist.classList.remove("open");
          hamburger.classList.remove("open");
        }
      });
    });
  }

  const userMenuButton = document.querySelector("[data-menu='user']");
  const userMenu = document.getElementById("user-menu");

  if (userMenuButton && userMenu) {
    const closeMenu = () => {
      userMenu.classList.remove("open");
      userMenuButton.setAttribute("aria-expanded", "false");
    };

    userMenuButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = userMenu.classList.toggle("open");
      userMenuButton.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
      if (!userMenu.contains(event.target) && !userMenuButton.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  const navLinks = Array.from(document.querySelectorAll(".navlist a[href*='#']"));
  const sections = navLinks
    .map((link) => {
      const hash = link.getAttribute("href")?.split("#")[1];
      if (!hash) {
        return null;
      }
      const target = document.getElementById(hash);
      return target ? { link, target } : null;
    })
    .filter(Boolean);

  const setActiveLink = () => {
    if (!sections.length) {
      return;
    }
    const offset = 120;
    let current = sections[0].link;
    sections.forEach(({ link, target }) => {
      const top = target.getBoundingClientRect().top;
      if (top - offset <= 0) {
        current = link;
      }
    });
    navLinks.forEach((link) => link.classList.remove("active"));
    current.classList.add("active");
  };

  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        setActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener("scroll", onScroll);
  window.addEventListener("load", setActiveLink);

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || !href.includes("#")) {
        return;
      }
      const [path, hash] = href.split("#");
      const isSamePage =
        (!path || path === "" || path === window.location.pathname) && hash;
      if (isSamePage) {
        const target = document.getElementById(hash);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  const showMessage = (form, message) => {
    let note = form.parentElement.querySelector(".form-message");
    if (!note) {
      note = document.createElement("p");
      note.className = "form-message";
      form.parentElement.appendChild(note);
    }
    note.textContent = message;
  };

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const forms = document.querySelectorAll(".form-container, .auth-form");
  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      const requiredInputs = form.querySelectorAll("input[required]");
      let invalid = false;

      requiredInputs.forEach((input) => {
        if (!input.value.trim()) {
          invalid = true;
        }
      });

      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value && !validateEmail(emailInput.value)) {
        invalid = true;
        showMessage(form, "Please enter a valid email address.");
      }

      const password1 = form.querySelector('input[name="password1"]');
      const password2 = form.querySelector('input[name="password2"]');
      if (password1 && password2 && password1.value !== password2.value) {
        invalid = true;
        showMessage(form, "Passwords do not match.");
      }

      if (invalid) {
        event.preventDefault();
        if (!emailInput) {
          showMessage(form, "Please complete all required fields.");
        }
      }
    });
  });
})();
