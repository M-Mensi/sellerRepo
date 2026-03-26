// modal.js: open/close modals; card routing
(function () {
  const issueModal = document.getElementById("issueModald");
  const unsolvedModal = document.getElementById("unsolvedModal");
  const body = document.body;

  function openModal(el) {
    el.classList.add("open");
    el.removeAttribute("aria-hidden");
    body.classList.add("no-scroll");
  }
  function closeModal(el) {
    el.classList.remove("open");
    el.setAttribute("aria-hidden", "true");
    body.classList.remove("no-scroll");
  }

  // Expose for other modules
  window.Modals = {
    openIssue() {
      openModal(issueModal);
    },
    closeIssue() {
      closeModal(issueModal);
    },
    openUnsolved() {
      openModal(unsolvedModal);
    },
    closeUnsolved() {
      closeModal(unsolvedModal);
    },
  };

  // Generic close handlers
  document.querySelectorAll(".modal [data-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const m = btn.closest(".modal");
      closeModal(m);
    });
  });
  document.querySelectorAll(".modal").forEach((m) => {
    m.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-backdrop")) closeModal(m);
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.open").forEach((m) => closeModal(m));
    }
  });

  // Card routing
  document.querySelectorAll(".guide-card").forEach((card) => {
    const title =
      card.dataset.guide ||
      card.querySelector(".card-title")?.textContent?.trim();
    const action = card.dataset.action || "form";
    card.addEventListener("click", (e) => {
      e.preventDefault();
      if (action === "unsolved") {
        window.UnsolvedList && window.UnsolvedList.open();
      } else {
        // default: open form
        const guideInput = document.getElementById("guideName");
        if (guideInput) guideInput.value = title || "Selected Guide";
        window.AddingIssue && window.AddingIssue.open();
      }
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.click();
      }
    });
  });
})();
