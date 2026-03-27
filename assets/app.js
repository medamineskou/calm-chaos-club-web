const state = {
  selectedType: "Tous",
  selectedTag: "Tous",
  query: ""
};

const el = {
  searchInput: document.getElementById("searchInput"),
  typeFilters: document.getElementById("typeFilters"),
  tagFilters: document.getElementById("tagFilters"),
  clearFiltersBtn: document.getElementById("clearFiltersBtn"),
  cardsContainer: document.getElementById("cardsContainer"),
  resultsMeta: document.getElementById("resultsMeta"),
  listView: document.getElementById("listView"),
  detailView: document.getElementById("detailView"),
  detailMeta: document.getElementById("detailMeta"),
  detailTitle: document.getElementById("detailTitle"),
  detailTags: document.getElementById("detailTags"),
  detailImage: document.getElementById("detailImage"),
  detailContent: document.getElementById("detailContent"),
  shareBtn: document.getElementById("shareBtn"),
  sourceLink: document.getElementById("sourceLink"),
  backBtn: document.getElementById("backBtn"),
  themeToggle: document.getElementById("themeToggle")
};

function uniqueValues(values) {
  return ["Tous", ...new Set(values)].filter(Boolean);
}

function activeTheme() {
  return localStorage.getItem("ccc_theme") || "light";
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("ccc_theme", theme);
  el.themeToggle.textContent = theme === "dark" ? "Mode jour" : "Mode nuit";
}

function toggleTheme() {
  applyTheme(activeTheme() === "dark" ? "light" : "dark");
}

function matchPost(post) {
  const q = state.query.trim().toLowerCase();
  const haystack = `${post.title} ${post.excerpt} ${post.tags.join(" ")} ${post.content}`.toLowerCase();
  const byQuery = !q || haystack.includes(q);
  const byType = state.selectedType === "Tous" || post.type === state.selectedType;
  const byTag = state.selectedTag === "Tous" || post.tags.includes(state.selectedTag);
  return byQuery && byType && byTag;
}

function filteredPosts() {
  return window.POSTS.filter(matchPost).sort((a, b) => b.date.localeCompare(a.date));
}

function chip(label, active, onClick) {
  const node = document.createElement("button");
  node.type = "button";
  node.className = `chip ${active ? "active" : ""}`;
  node.textContent = label;
  node.addEventListener("click", onClick);
  return node;
}

function renderFilters() {
  const types = uniqueValues(window.POSTS.map((p) => p.type));
  const tags = uniqueValues(window.POSTS.flatMap((p) => p.tags));
  el.typeFilters.replaceChildren(
    ...types.map((type) =>
      chip(type, state.selectedType === type, () => {
        state.selectedType = type;
        renderList();
      })
    )
  );
  el.tagFilters.replaceChildren(
    ...tags.map((tag) =>
      chip(tag, state.selectedTag === tag, () => {
        state.selectedTag = tag;
        renderList();
      })
    )
  );
}

function postCard(post) {
  const node = document.createElement("article");
  node.className = "feed-card";
  const safeImage =
    post.image ||
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80";
  node.innerHTML = `
    <img class="feed-image" src="${safeImage}" alt="Image du post ${post.title}" loading="lazy" />
    <div class="feed-content">
      <p class="feed-meta">${post.type} • ${formatDate(post.date)}</p>
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
      <div class="chips">${post.tags.map((tag) => `<span class="chip">${tag}</span>`).join("")}</div>
      <div class="feed-actions">
        <button class="action-link js-read" type="button">Lire</button>
        <button class="action-link js-share" type="button">Partager</button>
      </div>
    </div>
  `;
  node.querySelector(".js-read").addEventListener("click", () => openPost(post.slug, true));
  node.querySelector(".js-share").addEventListener("click", () => sharePost(post.slug));
  return node;
}

function renderList() {
  renderFilters();
  const posts = filteredPosts();
  el.resultsMeta.textContent = `${posts.length} post(s)`;
  if (!posts.length) {
    el.cardsContainer.innerHTML =
      "<p class='meta'>Aucun resultat pour cette recherche. Essaie un autre tag ou mot-cle.</p>";
    return;
  }
  el.cardsContainer.replaceChildren(...posts.map(postCard));
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("fr-BE", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function renderMath(retries = 8) {
  if (!window.renderMathInElement) {
    if (retries > 0) {
      window.setTimeout(() => renderMath(retries - 1), 120);
    }
    return;
  }

  window.renderMathInElement(el.detailContent, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "\\[", right: "\\]", display: true },
      { left: "\\(", right: "\\)", display: false }
    ],
    throwOnError: false
  });
}

function openPost(slug, pushHash) {
  const post = window.POSTS.find((item) => item.slug === slug);
  if (!post) return;

  el.listView.classList.add("hidden");
  el.detailView.classList.remove("hidden");
  el.detailMeta.textContent = `${post.type} • ${formatDate(post.date)}`;
  el.detailTitle.textContent = post.title;
  el.detailTags.innerHTML = post.tags.map((tag) => `<span class="chip">${tag}</span>`).join("");
  el.detailContent.innerHTML = window.marked.parse(post.content);
  el.detailContent.setAttribute("lang", post.lang || "fr");
  el.detailContent.setAttribute("dir", post.dir || "ltr");

  if (post.image) {
    el.detailImage.src = post.image;
    el.detailImage.classList.remove("hidden");
  } else {
    el.detailImage.classList.add("hidden");
  }

  if (post.sourceUrl) {
    el.sourceLink.href = post.sourceUrl;
    el.sourceLink.classList.remove("hidden");
  } else {
    el.sourceLink.classList.add("hidden");
  }

  renderMath();
  el.shareBtn.onclick = () => sharePost(slug);
  if (pushHash) window.location.hash = slug;
}

function closePost() {
  el.detailView.classList.add("hidden");
  el.listView.classList.remove("hidden");
  if (window.location.hash) history.replaceState(null, "", window.location.pathname);
}

async function sharePost(slug) {
  const url = `${window.location.origin}${window.location.pathname}#${slug}`;
  try {
    if (navigator.share) {
      await navigator.share({ title: "Calm Chaos Club", url });
      return;
    }
    await navigator.clipboard.writeText(url);
    alert("Lien copie.");
  } catch {
    // User cancelled share or browser blocked clipboard.
  }
}

function initEvents() {
  el.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value || "";
    renderList();
  });

  el.clearFiltersBtn.addEventListener("click", () => {
    state.selectedType = "Tous";
    state.selectedTag = "Tous";
    state.query = "";
    el.searchInput.value = "";
    renderList();
  });

  el.backBtn.addEventListener("click", closePost);
  el.themeToggle.addEventListener("click", toggleTheme);

  window.addEventListener("hashchange", () => {
    const slug = window.location.hash.replace("#", "");
    if (!slug) {
      closePost();
      return;
    }
    openPost(slug, false);
  });
}

function boot() {
  applyTheme(activeTheme());
  renderList();
  initEvents();
  const slug = window.location.hash.replace("#", "");
  if (slug) openPost(slug, false);
}

boot();
