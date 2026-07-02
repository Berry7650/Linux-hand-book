const device = document.querySelector("[data-theme-device]");
const menu = document.querySelector("[data-theme-menu]");
const choices = document.querySelectorAll("[data-theme-choice]");
const wallpaperCycle = document.querySelector("[data-wallpaper-cycle]");
const tip = document.querySelector("[data-penguin-tip]");
const clock = document.querySelector("[data-penguin-clock]");
const storageKey = "linux-command-theme";
const autoDarkKey = "linux-command-auto-dark";
const moonStyleProperties = [
  "--moon-wallpaper-image",
  "--moon-core",
  "--moon-glow",
  "--moon-atmosphere-a",
  "--moon-atmosphere-b",
  "--moon-panel-tint",
  "--moon-soft-tint",
  "--moon-border-tint",
  "--accent",
  "--accent-strong"
];
let hideTimer;
let tipTimer;
let nextTipTimer;
let autoThemeTimer;
let wallpapers = [];
let wallpaperIndex = 0;

const fallbackWallpapers = [
  "linear-gradient(120deg, #0b1020, #16213a 34%, #1e2d4f 62%, #0f172a)",
  "linear-gradient(135deg, #08111f 0%, #12304f 42%, #355070 72%, #0b1324 100%)",
  "radial-gradient(circle at 30% 22%, rgba(186, 230, 253, 0.26), transparent 34%), linear-gradient(145deg, #020617 0%, #172554 48%, #0f172a 100%)",
  "linear-gradient(160deg, #111827 0%, #1e3a5f 45%, #312e81 100%)"
];

const moonColors = [
  {
    name: "white moon",
    core: "rgba(248, 250, 252, 0.92)",
    glow: "rgba(191, 219, 254, 0.5)",
    atmosphereA: "rgba(96, 165, 250, 0.16)",
    atmosphereB: "rgba(186, 230, 253, 0.12)",
    panel: "rgba(22, 31, 49, 0.58)",
    soft: "rgba(32, 43, 64, 0.62)",
    border: "rgba(191, 219, 254, 0.26)",
    accent: "#8ab4ff",
    accentStrong: "#dbeafe"
  },
  {
    name: "blue moon",
    core: "rgba(147, 197, 253, 0.96)",
    glow: "rgba(59, 130, 246, 0.56)",
    atmosphereA: "rgba(37, 99, 235, 0.24)",
    atmosphereB: "rgba(125, 211, 252, 0.16)",
    panel: "rgba(18, 38, 72, 0.62)",
    soft: "rgba(30, 64, 112, 0.58)",
    border: "rgba(147, 197, 253, 0.34)",
    accent: "#60a5fa",
    accentStrong: "#bfdbfe"
  },
  {
    name: "crimson moon",
    core: "rgba(252, 165, 165, 0.96)",
    glow: "rgba(220, 38, 38, 0.52)",
    atmosphereA: "rgba(185, 28, 28, 0.22)",
    atmosphereB: "rgba(251, 113, 133, 0.16)",
    panel: "rgba(61, 24, 38, 0.62)",
    soft: "rgba(88, 28, 46, 0.58)",
    border: "rgba(252, 165, 165, 0.34)",
    accent: "#fb7185",
    accentStrong: "#fecdd3"
  },
  {
    name: "gray moon",
    core: "rgba(203, 213, 225, 0.95)",
    glow: "rgba(100, 116, 139, 0.52)",
    atmosphereA: "rgba(148, 163, 184, 0.18)",
    atmosphereB: "rgba(71, 85, 105, 0.16)",
    panel: "rgba(31, 41, 55, 0.64)",
    soft: "rgba(51, 65, 85, 0.58)",
    border: "rgba(203, 213, 225, 0.28)",
    accent: "#cbd5e1",
    accentStrong: "#f8fafc"
  },
  {
    name: "yellow moon",
    core: "rgba(254, 240, 138, 0.96)",
    glow: "rgba(234, 179, 8, 0.54)",
    atmosphereA: "rgba(202, 138, 4, 0.22)",
    atmosphereB: "rgba(253, 224, 71, 0.16)",
    panel: "rgba(62, 49, 20, 0.62)",
    soft: "rgba(84, 64, 19, 0.58)",
    border: "rgba(254, 240, 138, 0.34)",
    accent: "#facc15",
    accentStrong: "#fef08a"
  },
  {
    name: "violet moon",
    core: "rgba(216, 180, 254, 0.95)",
    glow: "rgba(147, 51, 234, 0.5)",
    atmosphereA: "rgba(126, 34, 206, 0.22)",
    atmosphereB: "rgba(196, 181, 253, 0.15)",
    panel: "rgba(45, 31, 70, 0.62)",
    soft: "rgba(59, 37, 96, 0.58)",
    border: "rgba(216, 180, 254, 0.32)",
    accent: "#c084fc",
    accentStrong: "#e9d5ff"
  },
  {
    name: "teal moon",
    core: "rgba(153, 246, 228, 0.95)",
    glow: "rgba(20, 184, 166, 0.5)",
    atmosphereA: "rgba(13, 148, 136, 0.22)",
    atmosphereB: "rgba(94, 234, 212, 0.15)",
    panel: "rgba(17, 55, 60, 0.62)",
    soft: "rgba(19, 78, 74, 0.58)",
    border: "rgba(153, 246, 228, 0.32)",
    accent: "#5eead4",
    accentStrong: "#ccfbf1"
  },
  {
    name: "emerald moon",
    core: "rgba(187, 247, 208, 0.95)",
    glow: "rgba(34, 197, 94, 0.48)",
    atmosphereA: "rgba(22, 163, 74, 0.2)",
    atmosphereB: "rgba(134, 239, 172, 0.14)",
    panel: "rgba(18, 55, 42, 0.62)",
    soft: "rgba(20, 83, 45, 0.55)",
    border: "rgba(187, 247, 208, 0.3)",
    accent: "#86efac",
    accentStrong: "#dcfce7"
  },
  {
    name: "amber moon",
    core: "rgba(253, 186, 116, 0.95)",
    glow: "rgba(245, 158, 11, 0.52)",
    atmosphereA: "rgba(217, 119, 6, 0.22)",
    atmosphereB: "rgba(251, 191, 36, 0.14)",
    panel: "rgba(65, 42, 22, 0.62)",
    soft: "rgba(92, 56, 23, 0.56)",
    border: "rgba(253, 186, 116, 0.32)",
    accent: "#f59e0b",
    accentStrong: "#fed7aa"
  },
  {
    name: "rose moon",
    core: "rgba(251, 207, 232, 0.96)",
    glow: "rgba(236, 72, 153, 0.46)",
    atmosphereA: "rgba(219, 39, 119, 0.2)",
    atmosphereB: "rgba(244, 114, 182, 0.14)",
    panel: "rgba(62, 28, 52, 0.62)",
    soft: "rgba(83, 31, 63, 0.56)",
    border: "rgba(251, 207, 232, 0.3)",
    accent: "#f472b6",
    accentStrong: "#fbcfe8"
  }
];

const linuxTips = [
  "Try `man command` when you want the full manual.",
  "`ls -lah` is a strong first look inside any folder.",
  "Use `pwd` before deleting or moving files.",
  "`grep -R text .` searches through a project.",
  "`tail -f file.log` follows new log lines live.",
  "`df -h` checks disk space. `du -sh *` finds big folders.",
  "Small commands combine well with pipes.",
  "You are learning the Linux way: inspect first, act second."
];

const themeTips = {
  auto: "Auto mode is on. I will adjust the theme by time.",
  night: "Night Mode warms the page for longer reading.",
  electricity: "Dark Mode keeps the screen dark and calm.",
  moon: "Moon Night mode softens contrast with blue tones.",
  default: "Default mode is back. Clean and bright."
};

function pickLateTheme({ forceNew = false } = {}) {
  const saved = localStorage.getItem(autoDarkKey);
  if (!forceNew && (saved === "electricity" || saved === "moon")) return saved;
  const next = Math.random() > 0.5 ? "electricity" : "moon";
  localStorage.setItem(autoDarkKey, next);
  return next;
}

function resolveAutoTheme({ rotateLate = false } = {}) {
  const hour = new Date().getHours();
  if (hour >= 20 || hour < 5) return pickLateTheme({ forceNew: rotateLate });
  if (hour >= 17) return "night";
  return "default";
}

function applyTheme(theme) {
  const effectiveTheme = theme === "auto" ? resolveAutoTheme() : theme;
  document.documentElement.dataset.theme = effectiveTheme;
  syncMoonEnvironment();
}

function setTheme(theme) {
  applyTheme(theme);
  localStorage.setItem(storageKey, theme);
  showTip(themeTips[theme] || "Theme updated.");
  scheduleAutoTheme();
}

function closeMenu() {
  if (!menu || !device) return;
  clearTimeout(hideTimer);
  menu.hidden = true;
  if (clock) clock.hidden = false;
  device.setAttribute("aria-expanded", "false");
}

function scheduleMenuHide() {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(closeMenu, 4500);
}

function showTip(message) {
  if (!tip) return;
  if (menu && !menu.hidden) return;
  clearTimeout(tipTimer);
  tip.textContent = message;
  tip.hidden = false;
  tipTimer = setTimeout(() => {
    tip.hidden = true;
  }, 5200);
}

function scheduleRandomTip() {
  if (!tip) return;
  clearTimeout(nextTipTimer);
  nextTipTimer = setTimeout(() => {
    const message = linuxTips[Math.floor(Math.random() * linuxTips.length)];
    showTip(message);
    scheduleRandomTip();
  }, 15000);
}

function updateClock() {
  if (!clock) return;
  const now = new Date();
  clock.setAttribute("datetime", now.toISOString());
  clock.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function applyMoonWallpaper() {
  if (document.documentElement.dataset.theme !== "moon") return;

  const moonColor = moonColors[wallpaperIndex % moonColors.length];
  const wallpaper = moonColor.name === "blue moon" && wallpapers.length
    ? wallpapers[0]
    : fallbackWallpapers[wallpaperIndex % fallbackWallpapers.length];

  if (!wallpaper) {
    document.documentElement.style.removeProperty("--moon-wallpaper-image");
    return;
  }

  const root = window.__SITE_ROOT__ || "";
  const image = wallpaper.startsWith("wallpapers/") ? `url("${root}${wallpaper}")` : wallpaper;
  document.documentElement.style.setProperty("--moon-wallpaper-image", image);
  document.documentElement.style.setProperty("--moon-core", moonColor.core);
  document.documentElement.style.setProperty("--moon-glow", moonColor.glow);
  document.documentElement.style.setProperty("--moon-atmosphere-a", moonColor.atmosphereA);
  document.documentElement.style.setProperty("--moon-atmosphere-b", moonColor.atmosphereB);
  document.documentElement.style.setProperty("--moon-panel-tint", moonColor.panel);
  document.documentElement.style.setProperty("--moon-soft-tint", moonColor.soft);
  document.documentElement.style.setProperty("--moon-border-tint", moonColor.border);
  document.documentElement.style.setProperty("--accent", moonColor.accent);
  document.documentElement.style.setProperty("--accent-strong", moonColor.accentStrong);
}

function clearMoonEnvironment() {
  moonStyleProperties.forEach((property) => {
    document.documentElement.style.removeProperty(property);
  });
}

function syncMoonEnvironment() {
  if (document.documentElement.dataset.theme === "moon") {
    applyMoonWallpaper();
    return;
  }

  clearMoonEnvironment();
}

async function loadMoonWallpapers() {
  try {
    const response = await fetch(window.__WALLPAPERS_INDEX__ || "wallpapers-index.json");
    wallpapers = await response.json();
    wallpaperIndex = Number(localStorage.getItem("linux-command-wallpaper-index") || "0");
    syncMoonEnvironment();
  } catch {
    wallpapers = [];
    syncMoonEnvironment();
  }
}

function cycleMoonWallpaper() {
  if (document.documentElement.dataset.theme !== "moon") return;

  const cycleLength = moonColors.length;
  if (!cycleLength) return;

  wallpaperIndex = (wallpaperIndex + 1) % cycleLength;
  localStorage.setItem("linux-command-wallpaper-index", String(wallpaperIndex));
  applyMoonWallpaper();
  showTip(`${moonColors[wallpaperIndex % moonColors.length].name} selected.`);
}

function scheduleAutoTheme() {
  clearInterval(autoThemeTimer);
  if (localStorage.getItem(storageKey) !== "auto") return;
  autoThemeTimer = setInterval(() => {
    const minute = new Date().getMinutes();
    const rotateLate = minute % 5 === 0;
    document.documentElement.dataset.theme = resolveAutoTheme({ rotateLate });
    syncMoonEnvironment();
  }, 60000);
}

device?.addEventListener("click", () => {
  if (!menu) return;
  const next = menu.hidden;
  menu.hidden = !next;
  device.setAttribute("aria-expanded", String(next));
  if (next) {
    if (tip) tip.hidden = true;
    if (clock) clock.hidden = true;
    scheduleMenuHide();
  } else if (clock) {
    clock.hidden = false;
  }
});

choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    setTheme(choice.dataset.themeChoice || "default");
    closeMenu();
  });
});

wallpaperCycle?.addEventListener("click", () => {
  cycleMoonWallpaper();
  closeMenu();
});

menu?.addEventListener("pointerenter", () => clearTimeout(hideTimer));
menu?.addEventListener("pointerleave", scheduleMenuHide);
menu?.addEventListener("focusin", () => clearTimeout(hideTimer));
menu?.addEventListener("focusout", scheduleMenuHide);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.addEventListener("pointerdown", (event) => {
  if (!menu || menu.hidden) return;
  const target = event.target;
  if (target instanceof Node && !menu.contains(target) && !device?.contains(target)) {
    closeMenu();
  }
});

setTimeout(() => {
  showTip("Welcome. Search a command, then open its notes.");
}, 1600);
applyTheme(localStorage.getItem(storageKey) || "default");
scheduleAutoTheme();
loadMoonWallpapers();
scheduleRandomTip();
updateClock();
setInterval(updateClock, 1000);
