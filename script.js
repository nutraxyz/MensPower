
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
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

const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

// FAQ plus/minus indicators
document.querySelectorAll(".faq-list details").forEach(item => {
  const icon = item.querySelector("summary span");
  const updateIcon = () => {
    if (icon) icon.textContent = item.open ? "−" : "+";
  };
  item.addEventListener("toggle", updateIcon);
  updateIcon();
});

// Genuine online-session counter.
// Requires the /api/visitors backend shown below.
const visitorCount = document.getElementById("visitorCount");

async function updateVisitorCount() {
  if (!visitorCount) return;

  try {
    let sessionId = sessionStorage.getItem("mensPowerSession");

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("mensPowerSession", sessionId);
    }

    const response = await fetch(
      "/api/visitors?id=" + encodeURIComponent(sessionId),
      { cache: "no-store" }
    );

    if (!response.ok) throw new Error("Visitor service unavailable");

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
setInterval(updateVisitorCount, 60_000);

/* MENS POWER UPDATES */

.logo-icon {
  flex-shrink: 0;
}

.visitor-counter {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  white-space: nowrap;
  color: #e1e5eb;
  font-size: 11px;
  font-weight: 700;
}

.live-dot {
  width: 8px;
  height: 8px;
  display: inline-block;
  border-radius: 50%;
  background: #43d69b;
  box-shadow: 0 0 10px #43d69b70;
}

.topic-section {
  padding-top: 55px;
  padding-bottom: 75px;
}

.topic-card {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  align-items: center;
  gap: 38px;
  margin-bottom: 32px;
  overflow: hidden;
  border-radius: 22px;
  background: #fff;
  border: 1px solid var(--line);
  box-shadow: 0 12px 35px #10182708;
}

.topic-card.reverse {
  grid-template-columns: 1.15fr 0.85fr;
}

.topic-card.reverse img {
  order: 2;
}

.topic-card img {
  width: 100%;
  height: 310px;
  object-fit: cover;
}

.topic-card > div {
  padding: 30px 35px 30px 0;
}

.topic-card.reverse > div {
  padding: 30px 0 30px 35px;
}

.topic-card h2 {
  margin: 0 0 14px;
  color: var(--navy);
  font-size: clamp(27px, 3vw, 38px);
  line-height: 1.15;
  letter-spacing: -1px;
}

.topic-card p:not(.eyebrow) {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.9;
}

.topic-card .eyebrow {
  margin-bottom: 12px;
}

.about .section-copy h3 {
  color: var(--navy);
  font-size: 17px;
  line-height: 1.5;
  margin: 0 0 12px;
}

.about .check-list {
  margin-top: 10px;
}

.about .check-list li {
  line-height: 1.8;
  margin: 12px 0;
}

.hero-photo img {
  width: 100%;
  max-width: 490px;
  height: 370px;
  object-fit: cover;
  border-radius: 24px;
  box-shadow: 0 20px 50px #10182720;
}

.product-secondary img {
  width: 100%;
  height: 100%;
  max-height: 380px;
  object-fit: cover;
}

@media (max-width: 850px) {
  .visitor-counter {
    margin-left: auto;
  }

  .header {
    gap: 14px;
  }

  .topic-card,
  .topic-card.reverse {
    gap: 22px;
  }

  .topic-card img {
    height: 270px;
  }

  .topic-card > div {
    padding-right: 22px;
  }

  .topic-card.reverse > div {
    padding-left: 22px;
  }
}

@media (max-width: 650px) {
  .header {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .header .logo {
    margin-right: auto;
  }

  .visitor-counter {
    order: 2;
    margin-left: 0;
    font-size: 10px;
  }

  .menu-toggle {
    order: 1;
  }

  .nav {
    order: 3;
  }

  .topic-section {
    padding-top: 35px;
    padding-bottom: 45px;
  }

  .topic-card,
  .topic-card.reverse {
    grid-template-columns: 1fr;
    gap: 0;
    margin-bottom: 22px;
  }

  .topic-card.reverse img {
    order: 0;
  }

  .topic-card img {
    height: 240px;
  }

  .topic-card > div,
  .topic-card.reverse > div {
    padding: 24px;
  }

  .topic-card h2 {
    font-size: 30px;
  }

  .hero-photo {
    min-height: 260px;
  }

  .hero-photo img {
    height: 260px;
  }

  .product-secondary img {
    height: 260px;
  }
}
