const state = {
  selectedTheme: "All",
  selectedTag: "All",
  query: "",
  currentSlug: ""
};

const COMMENTS_KEY = "ccc_comments_v1";

const el = {
  searchInput: document.getElementById("searchInput"),
  themeFilters: document.getElementById("themeFilters"),
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
  themeToggle: document.getElementById("themeToggle"),
  commentsList: document.getElementById("commentsList"),
  commentForm: document.getElementById("commentForm"),
  commentName: document.getElementById("commentName"),
  commentText: document.getElementById("commentText")
};

function uniqueValues(values) {
  return ["All", ...new Set(values)].filter(Boolean);
}

function activeThemeMode() {
  return localStorage.getItem("ccc_theme_mode") || "light";
}

function applyThemeMode(mode) {
  document.body.dataset.theme = mode;
  localStorage.setItem("ccc_theme_mode", mode);
  el.themeToggle.textContent = mode === "dark" ? "Light mode" : "Dark mode";
}

function toggleThemeMode() {
  applyThemeMode(activeThemeMode() === "dark" ? "light" : "dark");
}

function matchPost(post) {
  const q = state.query.trim().toLowerCase();
  const haystack = `${post.title} ${post.excerpt} ${post.tags.join(" ")} ${post.content}`.toLowerCase();
  const byQuery = !q || haystack.includes(q);
  const byTheme = state.selectedTheme === "All" || post.theme === state.selectedTheme;
  const byTag = state.selectedTag === "All" || post.tags.includes(state.selectedTag);
  return byQuery && byTheme && byTag;
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
  const themes = uniqueValues(window.POSTS.map((p) => p.theme));
  const tags = uniqueValues(window.POSTS.flatMap((p) => p.tags));
  el.themeFilters.replaceChildren(
    ...themes.map((theme) =>
      chip(theme, state.selectedTheme === theme, () => {
        state.selectedTheme = theme;
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
    <img class="feed-image" src="${safeImage}" alt="Image for ${post.title}" loading="lazy" />
    <div class="feed-content">
      <p class="feed-meta">${post.theme} - ${formatDate(post.date)}</p>
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
      <div class="chips">${post.tags.map((tag) => `<span class="chip">${tag}</span>`).join("")}</div>
      <div class="feed-actions">
        <button class="action-link js-read" type="button">Read</button>
        <button class="action-link js-share" type="button">Share</button>
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
    el.cardsContainer.innerHTML = "<p class='meta'>No results for this query yet.</p>";
    return;
  }
  el.cardsContainer.replaceChildren(...posts.map(postCard));
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function renderMath(retries = 10) {
  if (!window.renderMathInElement) {
    if (retries > 0) window.setTimeout(() => renderMath(retries - 1), 120);
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

function normalizeInlineMath(markdown) {
  const blocks = [];
  const protectedMarkdown = markdown.replace(/\$\$[\s\S]*?\$\$/g, (m) => {
    const key = `@@MATH_BLOCK_${blocks.length}@@`;
    blocks.push(m);
    return key;
  });
  const converted = protectedMarkdown.replace(/(^|[^$])\$([^\n$]+?)\$/g, (full, prefix, expr) => {
    return `${prefix}\\(${expr.trim()}\\)`;
  });
  return converted.replace(/@@MATH_BLOCK_(\d+)@@/g, (_, idx) => blocks[Number(idx)]);
}

function openPost(slug, pushHash) {
  const post = window.POSTS.find((item) => item.slug === slug);
  if (!post) return;

  state.currentSlug = slug;
  el.listView.classList.add("hidden");
  el.detailView.classList.remove("hidden");
  el.detailMeta.textContent = `${post.theme} - ${formatDate(post.date)}`;
  el.detailTitle.textContent = post.title;
  el.detailTags.innerHTML = post.tags.map((tag) => `<span class="chip">${tag}</span>`).join("");

  if (post.rawHtml) {
    el.detailContent.innerHTML = post.content;
  } else {
    const normalizedContent = normalizeInlineMath(post.content);
    el.detailContent.innerHTML = window.marked.parse(normalizedContent);
  }

  el.detailContent.setAttribute("lang", post.lang || "en");
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
  renderComments(slug);
  el.shareBtn.onclick = () => sharePost(slug);
  if (pushHash) window.location.hash = slug;
}

function closePost() {
  el.detailView.classList.add("hidden");
  el.listView.classList.remove("hidden");
  state.currentSlug = "";
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
    alert("Link copied.");
  } catch {
    // User cancelled share or browser blocked clipboard.
  }
}

function loadComments() {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveComments(store) {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(store));
}

function getPostComments(slug) {
  const store = loadComments();
  const list = Array.isArray(store[slug]) ? store[slug] : [];
  return list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

function renderComments(slug) {
  const comments = getPostComments(slug);
  if (!comments.length) {
    el.commentsList.innerHTML = "<p class='meta'>No comments yet. Be the first one.</p>";
    return;
  }

  const nodes = comments.map((comment) => {
    const item = document.createElement("article");
    item.className = "comment-item";

    const head = document.createElement("div");
    head.className = "comment-head";
    const name = document.createElement("strong");
    name.textContent = comment.name || "Anonymous";
    const time = document.createElement("span");
    time.textContent = new Date(comment.createdAt).toLocaleString("en-US");
    head.append(name, time);

    const body = document.createElement("p");
    body.className = "comment-body";
    body.textContent = comment.text;

    item.append(head, body);
    return item;
  });

  el.commentsList.replaceChildren(...nodes);
}

function addComment(slug, name, text) {
  const store = loadComments();
  const list = Array.isArray(store[slug]) ? store[slug] : [];
  list.push({
    id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    name: name || "Anonymous",
    text,
    createdAt: new Date().toISOString()
  });
  store[slug] = list;
  saveComments(store);
}

function initEvents() {
  el.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value || "";
    renderList();
  });

  el.clearFiltersBtn.addEventListener("click", () => {
    state.selectedTheme = "All";
    state.selectedTag = "All";
    state.query = "";
    el.searchInput.value = "";
    renderList();
  });

  el.backBtn.addEventListener("click", closePost);
  el.themeToggle.addEventListener("click", toggleThemeMode);

  el.commentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!state.currentSlug) return;
    const name = (el.commentName.value || "").trim();
    const text = (el.commentText.value || "").trim();
    if (!text) return;
    addComment(state.currentSlug, name, text);
    el.commentText.value = "";
    renderComments(state.currentSlug);
  });

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
  applyThemeMode(activeThemeMode());
  renderList();
  initEvents();
  const slug = window.location.hash.replace("#", "");
  if (slug) openPost(slug, false);
}

boot();
