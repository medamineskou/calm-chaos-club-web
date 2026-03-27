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
  resultsMeta: document.getElementById("resultsMeta"),
  cardsContainer: document.getElementById("cardsContainer"),
  listView: document.getElementById("listView"),
  detailView: document.getElementById("detailView"),
  detailMeta: document.getElementById("detailMeta"),
  detailTitle: document.getElementById("detailTitle"),
  detailTags: document.getElementById("detailTags"),
  detailContent: document.getElementById("detailContent"),
  shareBtn: document.getElementById("shareBtn"),
  sourceLink: document.getElementById("sourceLink"),
  backBtn: document.getElementById("backBtn")
};

function uniqueValues(values) {
  return ["Tous", ...new Set(values)].filter(Boolean);
}

function matches(post) {
  const query = state.query.trim().toLowerCase();
  const haystack = `${post.title} ${post.excerpt} ${post.content} ${post.tags.join(" ")}`.toLowerCase();
  const byQuery = !query || haystack.includes(query);
  const byType = state.selectedType === "Tous" || post.type === state.selectedType;
  const byTag = state.selectedTag === "Tous" || post.tags.includes(state.selectedTag);
  return byQuery && byType && byTag;
}

function filteredPosts() {
  return window.POSTS.filter(matches).sort((a, b) => b.date.localeCompare(a.date));
}

function chip(label, active, onClick) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = `chip ${active ? "active" : ""}`;
  b.textContent = label;
  b.addEventListener("click", onClick);
  return b;
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
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <p class="meta-text">${post.type} • ${post.date}</p>
    <h3>${post.title}</h3>
    <p>${post.excerpt}</p>
    <div class="chips">${post.tags.map((t) => `<span class="chip">${t}</span>`).join("")}</div>
    <div class="card-foot">
      <button class="btn-link" type="button">Lire</button>
      <button class="btn-link" type="button">Partager</button>
    </div>
  `;
  const [readBtn, shareBtn] = card.querySelectorAll(".btn-link");
  readBtn.addEventListener("click", () => openPost(post.slug, true));
  shareBtn.addEventListener("click", () => sharePost(post.slug));
  return card;
}

function renderList() {
  renderFilters();
  const list = filteredPosts();
  el.resultsMeta.textContent = `${list.length} partage(s)`;
  if (!list.length) {
    el.cardsContainer.innerHTML = "<p class='meta-text'>Aucun resultat. Essaie un autre filtre.</p>";
    return;
  }
  el.cardsContainer.replaceChildren(...list.map(postCard));
}

function renderMath() {
  if (window.renderMathInElement) {
    window.renderMathInElement(el.detailContent, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\(", right: "\\)", display: false }
      ],
      throwOnError: false
    });
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("fr-BE", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function openPost(slug, pushHash) {
  const post = window.POSTS.find((p) => p.slug === slug);
  if (!post) return;
  el.listView.classList.add("hidden");
  el.detailView.classList.remove("hidden");
  el.detailMeta.textContent = `${post.type} • ${formatDate(post.date)}`;
  el.detailTitle.textContent = post.title;
  el.detailTags.innerHTML = post.tags.map((t) => `<span class="chip">${t}</span>`).join("");
  el.detailContent.innerHTML = window.marked.parse(post.content);
  renderMath();
  if (post.sourceUrl) {
    el.sourceLink.href = post.sourceUrl;
    el.sourceLink.classList.remove("hidden");
  } else {
    el.sourceLink.classList.add("hidden");
  }
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
      await navigator.share({ title: "Journal de Mohammed", url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Lien copie dans le presse-papiers.");
    }
  } catch {
    // No-op: user cancelled share.
  }
}

function initEvents() {
  el.searchInput.addEventListener("input", (e) => {
    state.query = e.target.value;
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
  renderList();
  initEvents();
  const slug = window.location.hash.replace("#", "");
  if (slug) openPost(slug, false);
}

boot();
