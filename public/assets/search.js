const input = document.querySelector("[data-search-input]");
const results = document.querySelector("[data-results]");
const title = document.querySelector("[data-results-title]");
const count = document.querySelector("[data-results-count]");
const empty = document.querySelector("[data-empty-state]");
const clear = document.querySelector("[data-search-clear]");
const searchForm = document.querySelector("[data-search-form]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let resultsScrollTimer;

const normalize = (value) => value.toLowerCase().trim().replace(/\s+/g, " ");

function scoreCommand(command, terms) {
  let score = 0;
  const name = command.name.toLowerCase();
  const haystack = command.searchText || "";

  for (const term of terms) {
    if (name === term) score += 80;
    else if (name.startsWith(term)) score += 45;
    else if (name.includes(term)) score += 25;

    if (command.tags.some((tag) => tag.toLowerCase().includes(term))) score += 15;
    if (command.summary.toLowerCase().includes(term)) score += 12;
    if (haystack.includes(term)) score += 4;
  }

  return score;
}

function highlightedCommandName(commandName, query, isNearNameMatch) {
  const safeName = escapeHtml(commandName);
  if (!isNearNameMatch || !query) return safeName;

  const matchLength = query.length;
  return `<span class="near-match-text">${escapeHtml(commandName.slice(0, matchLength))}</span>${escapeHtml(commandName.slice(matchLength))}`;
}

function card(command, query) {
  const root = window.__SITE_ROOT__ || "";
  const commandName = normalize(command.name);
  const isExactNameMatch = commandName === query;
  const isNearNameMatch = !isExactNameMatch && commandName.startsWith(query);
  const matchClass = isExactNameMatch
    ? " is-exact-match"
    : isNearNameMatch
      ? " has-near-text-match"
      : " is-related-match";
  const displayName = highlightedCommandName(command.name, query, isNearNameMatch);
  const tags = command.tags.slice(0, 4).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  return `<a class="command-card${matchClass}" href="${root}commands/${command.slug}/index.html" data-command-card>
    <span class="command-name">${displayName}</span>
    <span class="command-summary">${escapeHtml(command.summary)}</span>
    <span class="tag-row">${tags}</span>
  </a>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function scrollToElement(element, block = "start") {
  element?.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block
  });
}

function restartNoResultsBlink() {
  if (!searchForm) return;
  searchForm.classList.remove("has-no-results");
  void searchForm.offsetWidth;
  searchForm.classList.add("has-no-results");
}

async function setupSearch() {
  if (!input || !results) return;

  let commands;
  try {
    const response = await fetch(window.__SEARCH_INDEX__ || "search-index.json");
    commands = await response.json();
  } catch {
    return;
  }
  const initialCards = results.innerHTML;
  const initialCount = count?.textContent || "";
  const initialTitle = title?.textContent || "";

  const render = ({ shouldScroll = false } = {}) => {
    const query = normalize(input.value);
    clearTimeout(resultsScrollTimer);
    searchForm?.classList.remove("has-no-results");

    if (!query) {
      results.innerHTML = initialCards;
      if (count) count.textContent = initialCount;
      if (title) title.textContent = initialTitle;
      if (empty) empty.hidden = true;
      results.hidden = false;
      if (shouldScroll) scrollToElement(searchForm || input, "center");
      return;
    }

    const terms = query.split(" ").filter(Boolean);
    const matches = commands
      .map((command) => ({ command, score: scoreCommand(command, terms) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.command.name.localeCompare(b.command.name))
      .map((item) => item.command);

    results.innerHTML = matches.map((match) => card(match, query)).join("");
    if (count) count.textContent = `${matches.length} ${matches.length === 1 ? "command" : "commands"}`;
    if (title) title.textContent = `Results for "${input.value.trim()}"`;
    if (empty) empty.hidden = matches.length > 0;
    results.hidden = false;
    if (matches.length === 0) {
      restartNoResultsBlink();
    }

    if (shouldScroll) {
      scrollToElement(searchForm || input, "center");
      resultsScrollTimer = setTimeout(() => {
        scrollToElement(empty && !empty.hidden ? empty : title || results, "start");
      }, 450);
    }
  };

  input.addEventListener("input", () => render({ shouldScroll: true }));
  clear?.addEventListener("click", () => {
    requestAnimationFrame(() => {
      input.value = "";
      render({ shouldScroll: true });
      input.focus();
    });
  });

  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  if (q) {
    input.value = q;
    render({ shouldScroll: true });
  }
}

setupSearch();
