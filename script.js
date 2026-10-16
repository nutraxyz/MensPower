
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

// Mobile navigation
if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );

    menuToggle.textContent = isOpen ? "×" : "☰";
  });

  navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
      menuToggle.textContent = "☰";
    });
  });
}

// Automatic copyright year
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// FAQ plus/minus indicators
document.querySelectorAll(".faq-list details").forEach(item => {
  const icon = item.querySelector("summary span");

  const updateIcon = () => {
    if (icon) {
      icon.textContent = item.open ? "−" : "+";
    }
  };

  item.addEventListener("toggle", updateIcon);
  updateIcon();
});

// Live visitor counter
// Requires the Vercel /api/visitors backend and Upstash configuration.
const visitorCount = document.getElementById("visitorCount");

async function updateVisitorCount() {
  if (!visitorCount) return;

  try {
    let sessionId = sessionStorage.getItem("mensPowerSession");

    if (!sessionId) {
      if (!window.crypto || !crypto.randomUUID) {
        throw new Error("Session ID is unavailable");
      }

      sessionId = crypto.randomUUID();
      sessionStorage.setItem("mensPowerSession", sessionId);
    }

    const response = await fetch(
      "/api/visitors?id=" + encodeURIComponent(sessionId),
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Visitor service unavailable");
    }

    const data = await response.json();

    if (typeof data.online !== "number") {
      throw new Error("Invalid visitor count");
    }

    visitorCount.textContent = data.online.toLocaleString();
  } catch {
    visitorCount.textContent = "Unavailable";
  }
}

updateVisitorCount();
setInterval(updateVisitorCount, 60000);
