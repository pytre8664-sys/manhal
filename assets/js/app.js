/* MANHAL — shared app shell: i18n, icons, header/footer, components, page logic */
(function () {
  "use strict";

  /* ================= Icons ================= */
  const P = {
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    school: '<path d="m4 6 8-4 8 4"/><path d="M18 10v11H6V10"/><path d="M2 21h20"/><path d="M12 10v4"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    bolt: '<path d="M13 2 3 14h8l-1 8 10-12h-8l1-8z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z"/>',
    mapPin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrowLeft: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>',
    heart: '<path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.7 6.8-4M8.6 13.3l6.8 4"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-5M12 8h.01"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M8.2 13.9 7 22l5-3 5 3-1.2-8.1"/>',
    filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3z"/>',
    trending: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
    home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    dollar: '<path d="M12 2v20"/><path d="M17 6.5c0-1.9-2.2-3.5-5-3.5s-5 1.6-5 3.5S9.2 10 12 10s5 1.6 5 3.5S14.8 17 12 17s-5-1.6-5-3.5"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    lock: '<rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
  };

  function icon(name, cls) {
    const d = P[name] || "";
    return `<svg class="icon${cls ? " " + cls : ""}" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  }

  /* ================= Language ================= */
  const LS_LANG = "manhal.lang";
  const LS_USER = "manhal.user";
  const LS_ROLE = "manhal.role";
  const LS_SAVED = "manhal.saved";

  function getLang() {
    return localStorage.getItem(LS_LANG) || "ar";
  }

  function t(key) {
    const lang = getLang();
    return (I18N[lang] && I18N[lang][key]) || (I18N.ar && I18N.ar[key]) || key;
  }

  function tr(obj) {
    if (!obj) return "";
    return getLang() === "en" ? obj.en || obj.ar : obj.ar || obj.en;
  }

  function applyI18n() {
    const lang = getLang();
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = t(key);
      if (val) el.textContent = val;
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const val = t(key);
      if (val) el.innerHTML = val;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    document.querySelectorAll(".lang-toggle [data-lang-label]").forEach((el) => {
      el.textContent = lang === "ar" ? "English" : "العربية";
    });
    document.dispatchEvent(new CustomEvent("manhal:lang", { detail: { lang } }));
  }

  function setLang(lang) {
    localStorage.setItem(LS_LANG, lang);
    applyI18n();
    renderHeader();
    renderFooter();
    document.dispatchEvent(new CustomEvent("manhal:re-render"));
  }

  /* ================= User ================= */
  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(LS_USER) || "null");
    } catch (e) {
      return null;
    }
  }

  function setUser(user) {
    localStorage.setItem(LS_USER, JSON.stringify(user));
    if (user && user.role) localStorage.setItem(LS_ROLE, user.role);
  }

  function logout() {
    localStorage.removeItem(LS_USER);
    localStorage.removeItem(LS_ROLE);
    location.href = "index.html";
  }

  function dashboardHref(role) {
    const r = role || localStorage.getItem(LS_ROLE) || "school";
    return (
      { school: "dashboard-school.html", parent: "dashboard-parent.html", teacher: "dashboard-teacher.html" }[r] ||
      "dashboard-school.html"
    );
  }

  /* ================= Saved teachers ================= */
  function getSaved() {
    try {
      return JSON.parse(localStorage.getItem(LS_SAVED) || "[]");
    } catch (e) {
      return [];
    }
  }
  function toggleSaved(id) {
    const list = getSaved();
    const i = list.indexOf(id);
    if (i > -1) list.splice(i, 1);
    else list.push(id);
    localStorage.setItem(LS_SAVED, JSON.stringify(list));
    return i === -1;
  }

  /* ================= Toast ================= */
  function toast(msg, kind) {
    let host = document.querySelector(".toast-host");
    if (!host) {
      host = document.createElement("div");
      host.className = "toast-host";
      document.body.appendChild(host);
    }
    const el = document.createElement("div");
    el.className = "toast" + (kind ? " toast--" + kind : "");
    el.textContent = msg;
    host.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(8px)";
      el.style.transition = "all .25s";
      setTimeout(() => el.remove(), 260);
    }, 2800);
  }

  /* ================= Header ================= */
  function navItems() {
    return [
      { href: "index.html", key: "nav.home" },
      { href: "how-it-works.html", key: "nav.how" },
      { href: "search.html", key: "nav.teachers" },
      { href: "about.html", key: "nav.about" },
      { href: "faq.html", key: "nav.faq" }
    ];
  }

  function isCurrent(href) {
    const p = location.pathname.split("/").pop() || "index.html";
    return p === href;
  }

  function renderHeader() {
    const host = document.getElementById("site-header");
    if (!host) return;
    const user = getUser();
    const links = navItems()
      .map(
        (n) =>
          `<a class="nav__link" href="${n.href}"${
            isCurrent(n.href) ? ' aria-current="page"' : ""
          }>${t(n.key)}</a>`
      )
      .join("");

    host.innerHTML = `
      <header class="site-header">
        <div class="container site-header__inner">
          <a class="brand" href="index.html" aria-label="${t("brand.name")}">
            <span class="brand__mark">${icon("book")}</span>
            <span class="brand__text">
              <span class="brand__name">${t("brand.name")}</span>
              <span class="brand__tag">${t("brand.tag")}</span>
            </span>
          </a>
          <nav class="nav" aria-label="main">${links}</nav>
          <div class="header-actions">
            <button class="lang-toggle" type="button" data-action="lang" aria-label="${t("nav.menu")}">
              ${icon("globe", "icon--sm")}<span data-lang-label>${getLang() === "ar" ? "English" : "العربية"}</span>
            </button>
            ${
              user
                ? `<a class="btn btn--ghost btn--sm" href="${dashboardHref()}">${t("nav.dashboard")}</a>
                   <button class="btn btn--primary btn--sm" type="button" data-action="logout">${t("nav.logout")}</button>`
                : `<a class="btn btn--ghost btn--sm" href="login.html">${t("nav.login")}</a>
                   <a class="btn btn--primary btn--sm" href="role-select.html">${t("nav.start")}</a>`
            }
            <button class="nav-burger" type="button" data-action="menu" aria-label="${t("nav.menu")}">
              ${icon("menu")}
            </button>
          </div>
        </div>
      </header>
      <div class="drawer" id="drawer" role="dialog" aria-modal="true">
        <div class="drawer__scrim" data-action="close-menu"></div>
        <div class="drawer__panel">
          <div class="row row--between">
            <a class="brand" href="index.html"><span class="brand__mark">${icon("book")}</span><span class="brand__name">${t("brand.name")}</span></a>
            <button class="btn btn--ghost btn--icon" type="button" data-action="close-menu" aria-label="${t("nav.close")}">${icon("x")}</button>
          </div>
          ${navItems()
            .map((n) => `<a class="nav__link" href="${n.href}">${t(n.key)}</a>`)
            .join("")}
          <hr class="divider" />
          ${
            user
              ? `<a class="btn btn--primary btn--block" href="${dashboardHref()}">${t("nav.dashboard")}</a>
                 <button class="btn btn--ghost btn--block" type="button" data-action="logout">${t("nav.logout")}</button>`
              : `<a class="btn btn--ghost btn--block" href="login.html">${t("nav.login")}</a>
                 <a class="btn btn--primary btn--block" href="role-select.html">${t("nav.start")}</a>`
          }
        </div>
      </div>`;
  }

  /* ================= Footer ================= */
  function renderFooter() {
    const host = document.getElementById("site-footer");
    if (!host) return;
    host.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-col">
              <a class="brand" href="index.html">
                <span class="brand__mark">${icon("book")}</span>
                <span class="brand__text"><span class="brand__name">${t("brand.name")}</span><span class="brand__tag">${t("brand.tag")}</span></span>
              </a>
              <p class="small muted mt-md">${t("footer.about")}</p>
            </div>
            <div class="footer-col">
              <h4>${t("footer.platform")}</h4>
              <a href="how-it-works.html">${t("footer.how")}</a>
              <a href="search.html">${t("footer.search")}</a>
              <a href="urgent.html">${t("footer.urgent")}</a>
              <a href="post-job.html">${t("dash.postJob")}</a>
            </div>
            <div class="footer-col">
              <h4>${t("footer.roles")}</h4>
              <a href="dashboard-school.html">${t("common.school")}</a>
              <a href="dashboard-parent.html">${t("common.parent")}</a>
              <a href="dashboard-teacher.html">${t("common.teacher")}</a>
              <a href="role-select.html">${t("nav.start")}</a>
            </div>
            <div class="footer-col">
              <h4>${t("footer.legal")}</h4>
              <a href="about.html">${t("footer.aboutUs")}</a>
              <a href="faq.html">${t("footer.faq")}</a>
              <a href="contact.html">${t("footer.contact")}</a>
              <a href="privacy.html">${t("footer.privacy")}</a>
              <a href="terms.html">${t("footer.terms")}</a>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© ${new Date().getFullYear()} ${t("brand.name")} — ${t("footer.rights")}</span>
            <span>${t("footer.made")}</span>
          </div>
        </div>
      </footer>`;
  }

  /* ================= Components ================= */
  function availabilityBadge(a) {
    const cls = a === "instant" ? "instant" : a === "partial" ? "partial" : "booked";
    const key = a === "instant" ? "common.instant" : a === "partial" ? "common.partial" : "common.booked";
    return `<span class="availability"><span class="dot dot--${cls}"></span>${t(key)}</span>`;
  }

  function teacherCard(x, opts) {
    opts = opts || {};
    const initials = (getLang() === "en" ? x.nameEn : x.name).replace(/^(أ\.|Mr\.|Ms\.)\s*/, "").trim().charAt(0);
    const modes = MODE_LABEL(x.mode);
    return `
      <article class="teacher-card" data-teacher="${x.id}">
        <div class="teacher-card__avatar">${initials}</div>
        <div class="teacher-card__body">
          <div class="teacher-card__top">
            <div>
              <h3 class="teacher-card__name">${getLang() === "en" ? x.nameEn : x.name}</h3>
              <p class="teacher-card__meta">${tr(SUBJ(x.subject))} · ${x.grades.map((g) => tr(GRADE(g))).join(" / ")} · ${tr(DIST(x.district))}</p>
            </div>
            ${x.verified.identity ? `<span class="chip chip--verified">${icon("shield")}${t("common.verified")}</span>` : `<span class="chip chip--outline">${t("common.notVerified")}</span>`}
          </div>
          <div class="teacher-card__tags">
            <span class="chip">${t(modes)}</span>
            <span class="chip">${x.experience} ${t("common.years")}</span>
            ${opts.showMatch ? `<span class="match-badge">${x.match}% ${t("sort.match")}</span>` : ""}
          </div>
          <div class="teacher-card__foot">
            <div class="row" style="gap:12px">
              <span class="rating">${icon("star")}${x.rating.toFixed(1)} <span class="muted small">(${x.reviews})</span></span>
              ${availabilityBadge(x.availability)}
            </div>
            <div class="row" style="gap:8px">
              <span class="price">${x.price.toLocaleString()} <span>${t("common.perHour")}</span></span>
              <a class="btn btn--sm" href="teacher.html?id=${x.id}">${t("common.viewProfile")}</a>
            </div>
          </div>
        </div>
      </article>`;
  }

  function emptyState(iconName, title, desc, actionsHtml) {
    return `
      <div class="empty">
        <div class="empty__icon">${icon(iconName)}</div>
        <h3>${title}</h3>
        <p>${desc}</p>
        ${actionsHtml ? `<div class="row row--wrap mt-md" style="justify-content:center">${actionsHtml}</div>` : ""}
      </div>`;
  }

  /* ================= Global actions ================= */
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const action = el.getAttribute("data-action");

    if (action === "lang") {
      setLang(getLang() === "ar" ? "en" : "ar");
    } else if (action === "menu") {
      document.getElementById("drawer").classList.add("is-open");
      document.body.style.overflow = "hidden";
    } else if (action === "close-menu") {
      const d = document.getElementById("drawer");
      if (d) d.classList.remove("is-open");
      document.body.style.overflow = "";
    } else if (action === "logout") {
      logout();
    } else if (action === "save-teacher") {
      const id = el.getAttribute("data-id");
      const nowSaved = toggleSaved(id);
      el.classList.toggle("is-saved", nowSaved);
      toast(t(nowSaved ? "teacher.savedMsg" : "common.saved"), "success");
    }
  });

  /* Demo forms */
  document.addEventListener("submit", (e) => {
    const form = e.target;
    if (!form.matches("[data-demo-form]")) return;
    e.preventDefault();
    const msg = form.getAttribute("data-success") || t("common.demoNotice");
    toast(msg, "success");
    const redirect = form.getAttribute("data-redirect");
    if (redirect) setTimeout(() => (location.href = redirect), 700);
    else form.reset();
  });

  /* ================= Page: search ================= */
  function initSearch() {
    const root = document.getElementById("search-app");
    if (!root) return;
    if (root.__manhalRender) {
      root.__manhalRender();
      return;
    }

    const state = {
      q: "",
      subject: "",
      grade: "",
      district: "",
      mode: "",
      verifiedOnly: false,
      availableOnly: false,
      sort: "match"
    };

    const params = new URLSearchParams(location.search);
    ["subject", "grade", "district", "mode"].forEach((k) => {
      if (params.get(k)) state[k] = params.get(k);
    });

    const resultsEl = document.getElementById("results");
    const countEl = document.getElementById("results-count");
    const emptyEl = document.getElementById("results-empty");

    function matched() {
      let list = TEACHERS.filter((x) => {
        if (state.subject && x.subject !== state.subject) return false;
        if (state.grade && !x.grades.includes(state.grade)) return false;
        if (state.district && x.district !== state.district) return false;
        if (state.mode && x.mode !== state.mode && x.mode !== "both") return false;
        if (state.verifiedOnly && !x.verified.identity) return false;
        if (state.availableOnly && x.availability !== "instant") return false;
        if (state.q) {
          const hay = (x.name + " " + x.nameEn + " " + tr(SUBJ(x.subject)) + " " + tr(DIST(x.district))).toLowerCase();
          if (!hay.includes(state.q.toLowerCase())) return false;
        }
        return true;
      });
      if (state.sort === "rating") list = list.slice().sort((a, b) => b.rating - a.rating);
      else if (state.sort === "experience") list = list.slice().sort((a, b) => b.experience - a.experience);
      else if (state.sort === "near") list = list.slice().sort((a, b) => (a.district === "mukalla" ? -1 : 1));
      else list = list.slice().sort((a, b) => b.match - a.match);
      return list;
    }

    function render() {
      const list = matched();
      if (countEl) countEl.textContent = `${list.length} ${t("common.results")}`;
      if (resultsEl) resultsEl.innerHTML = list.map((x) => teacherCard(x, { showMatch: true })).join("");
      if (emptyEl) emptyEl.classList.toggle("hidden", list.length > 0);
      if (resultsEl) resultsEl.classList.toggle("hidden", list.length === 0);
    }

    const sel = (id) => document.getElementById(id);
    root.__manhalRender = render;
    if (sel("f-q"))
      sel("f-q").addEventListener("input", (e) => {
        state.q = e.target.value;
        render();
      });
    [["f-subject", "subject"], ["f-grade", "grade"], ["f-district", "district"], ["f-mode", "mode"], ["f-sort", "sort"]].forEach(
      ([id, k]) => {
        const el = sel(id);
        if (el && !el.matches("[data-static]"))
          el.addEventListener("change", (e) => {
            state[k] = e.target.value;
            render();
          });
      }
    );
    ["f-verified", "f-available"].forEach((id) => {
      const el = sel(id);
      if (el)
        el.addEventListener("change", (e) => {
          if (id === "f-verified") state.verifiedOnly = e.target.checked;
          else state.availableOnly = e.target.checked;
          render();
        });
      });
    const notify = sel("btn-notify");
    if (notify)
      notify.addEventListener("click", () => {
        toast(t("search.saved"), "success");
      });

    render();
  }

  /* ================= Page: teacher profile ================= */
  function initTeacher() {
    const root = document.getElementById("teacher-app");
    if (!root) return;
    const bound = root.__manhalBound;
    const id = new URLSearchParams(location.search).get("id") || TEACHERS[0].id;
    const x = TEACHERS.find((t2) => t2.id === id);

    if (!x) {
      root.innerHTML = emptyState("alert", "404", t("common.empty"), `<a class="btn" href="search.html">${t("common.searchTeacher")}</a>`);
      return;
    }

    const lang = getLang();
    const name = lang === "en" ? x.nameEn : x.name;
    const v = x.verified;
    const totalV = [v.identity, v.qualification, v.experience].filter(Boolean).length;

    root.innerHTML = `
      <div class="grid profile-layout" style="align-items:start">
        <div class="stack" style="gap:24px">
          <div class="card">
            <div class="profile-head">
              <div class="profile-avatar">${name.replace(/^(أ\.|Mr\.|Ms\.)\s*/, "").charAt(0)}</div>
              <div style="flex:1;min-width:200px">
                <div class="row row--wrap" style="gap:8px">
                  <h1 style="font-size:26px;margin:0">${name}</h1>
                  ${v.identity ? `<span class="chip chip--verified">${icon("shield")}${t("common.verified")}</span>` : ""}
                </div>
                <p class="muted" style="margin:6px 0 10px">${tr(SUBJ(x.subject))} · ${x.grades.map((g) => tr(GRADE(g))).join(" / ")}</p>
                <div class="row row--wrap" style="gap:8px">
                  <span class="chip">${icon("mapPin")}${tr(DIST(x.district))}</span>
                  <span class="chip">${t(MODE_LABEL(x.mode))}</span>
                  <span class="chip">${x.experience} ${t("common.years")}</span>
                  <span class="rating">${icon("star")}${x.rating.toFixed(1)} <span class="muted small">(${x.reviews} ${t("common.reviews")})</span></span>
                </div>
              </div>
            </div>
            <hr class="divider" />
            <h3>${t("teacher.about")}</h3>
            <p class="muted" style="margin-bottom:0">${lang === "en" ? x.bioEn : x.bio}</p>
          </div>

          <div class="card">
            <h3>${t("teacher.subjects")}</h3>
            <div class="row row--wrap" style="gap:8px">
              <span class="chip chip--lavender">${tr(SUBJ(x.subject))}</span>
              ${x.grades.map((g) => `<span class="chip">${tr(GRADE(g))}</span>`).join("")}
              <span class="chip">${t(MODE_LABEL(x.mode))}</span>
            </div>
            <hr class="divider" />
            <h3>${t("teacher.verification")}</h3>
            <p class="small muted">${totalV}/3 — ${t("trust.desc")}</p>
            <div class="stack" style="gap:8px">
              ${[
                ["trust.v1", v.identity],
                ["trust.v2", v.qualification],
                ["trust.v3", v.experience]
              ]
                .map(
                  ([k, ok]) => `
                <div class="row" style="gap:10px">
                  ${ok ? `<span class="chip chip--verified">${icon("checkCircle")}</span>` : `<span class="chip chip--outline">${icon("x")}</span>`}
                  <span class="small" style="color:${ok ? "var(--text-body)" : "var(--text-muted)"}">${t(k)}</span>
                </div>`
                )
                .join("")}
            </div>
          </div>

          <div class="card">
            <h3>${t("teacher.schedule")}</h3>
            <div class="grid" style="grid-template-columns:repeat(7,minmax(0,1fr));gap:6px">
              ${["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"]
                .map(
                  (d, i) => `
                <div class="center" style="padding:10px 4px;border-radius:12px;border:1px solid ${i < 5 ? "var(--border)" : "transparent"};background:${i < 5 ? "var(--lavender)" : "var(--surface-subtle)"}">
                  <div class="tiny muted" style="font-weight:700">${d}</div>
                  <div class="tiny" style="font-weight:800;color:${i < 5 ? "var(--primary)" : "var(--text-muted)"}">${i < 5 ? "متاح" : "—"}</div>
                </div>`
                )
                .join("")}
            </div>
          </div>

          <div>
            <h3 class="mt-lg">${t("teacher.similar")}</h3>
            <div class="grid grid-2" style="margin-top:12px">
              ${TEACHERS.filter((y) => y.id !== x.id && (y.subject === x.subject || y.district === x.district))
                .slice(0, 2)
                .map((y) => teacherCard(y))
                .join("")}
            </div>
          </div>
        </div>

        <aside class="stack" style="gap:16px;position:sticky;top:96px">
          <div class="card">
            <div class="row row--between">
              <span class="price" style="font-size:22px">${x.price.toLocaleString()} <span>${t("common.perHour")}</span></span>
              ${availabilityBadge(x.availability)}
            </div>
            <div class="stack mt-md" style="gap:8px">
              <button class="btn btn--block" type="button" data-action="open-contact">${t("common.contact")}</button>
              <div class="row" style="gap:8px">
                <button class="btn btn--secondary btn--block" type="button" data-action="save-teacher" data-id="${x.id}">${icon("heart", "icon--sm")} ${t("common.save")}</button>
                <button class="btn btn--ghost btn--block" type="button" data-action="share">${icon("share", "icon--sm")} ${t("common.share")}</button>
              </div>
            </div>
            <p class="tiny muted mt-md" style="margin-bottom:0">${t("teacher.contactSub")}</p>
          </div>
          <div class="card card--lavender">
            <div class="row" style="gap:8px">${icon("lock", "icon--sm")}<strong class="small">${t("about.v2")}</strong></div>
            <p class="tiny muted mt-sm" style="margin-bottom:0">${t("about.v2d")}</p>
          </div>
        </aside>
      </div>

      <div class="modal" id="contact-modal">
        <div class="modal__scrim" data-action="close-contact"></div>
        <div class="modal__card">
          <div class="row row--between">
            <h3 style="margin:0">${t("teacher.contactTitle")}</h3>
            <button class="btn btn--ghost btn--icon" type="button" data-action="close-contact">${icon("x")}</button>
          </div>
          <p class="small muted">${t("teacher.contactSub")}</p>
          <form data-demo-form data-success="${t("teacher.contactSent")}" class="stack" style="gap:12px">
            <div class="field"><label class="field__label">${t("search.subject")}</label>
              <select class="select" required>${SUBJECTS.map((s) => `<option ${s.id === x.subject ? "selected" : ""}>${tr(s)}</option>`).join("")}</select></div>
            <div class="form-grid">
              <div class="field"><label class="field__label">${t("search.grade")}</label>
                <select class="select">${GRADES.map((g) => `<option>${tr(g)}</option>`).join("")}</select></div>
              <div class="field"><label class="field__label">${t("search.mode")}</label>
                <select class="select">${MODES.map((m) => `<option>${t(m.key)}</option>`).join("")}</select></div>
            </div>
            <div class="field"><label class="field__label">${t("urgentForm.notes")}</label>
              <textarea class="textarea" rows="3" placeholder="${t("urgentForm.notes")}"></textarea></div>
            <button class="btn btn--block" type="submit">${t("teacher.contactSend")}</button>
          </form>
        </div>
      </div>`;

    root.querySelectorAll("form[data-demo-form]").forEach((f) => {
      f.addEventListener("submit", () => {
        const m = document.getElementById("contact-modal");
        if (m) m.classList.remove("is-open");
      });
    });

    if (!bound) {
      root.__manhalBound = true;
      root.addEventListener("click", (e) => {
        const modal = document.getElementById("contact-modal");
        if (e.target.closest('[data-action="open-contact"]') && modal) modal.classList.add("is-open");
        if (e.target.closest('[data-action="close-contact"]') && modal) modal.classList.remove("is-open");
        if (e.target.closest('[data-action="share"]')) {
          if (navigator.clipboard) navigator.clipboard.writeText(location.href).catch(() => {});
          toast(t("teacher.shared"), "success");
        }
      });
    }
  }

  /* ================= Page: role select ================= */
  function initRoleSelect() {
    const root = document.getElementById("role-app");
    if (!root) return;
    const cards = root.querySelectorAll("[data-role]");
    const next = document.getElementById("role-next");
    cards.forEach((c) =>
      c.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        cards.forEach((x) => x.classList.remove("role-card--selected"));
        c.classList.add("role-card--selected");
        localStorage.setItem(LS_ROLE, c.getAttribute("data-role"));
        if (next) {
          next.classList.remove("hidden");
          next.setAttribute("href", "signup.html?role=" + c.getAttribute("data-role"));
        }
      })
    );
  }

  /* ================= Page: auth ================= */
  function initAuth() {
    const form = document.getElementById("signup-form");
    if (!form) return;
    const role = new URLSearchParams(location.search).get("role") || localStorage.getItem(LS_ROLE) || "school";
    form.querySelectorAll('input[name="role"]').forEach((r) => {
      if (r.value === role) r.checked = true;
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const r = data.get("role") || role;
      setUser({ name: data.get("name") || "مستخدم تجريبي", email: data.get("email"), role: r });
      location.href = dashboardHref(r);
    });
  }

  /* ================= Page: dashboard ================= */
  function initDashboard() {
    const root = document.getElementById("dash-app");
    if (!root) return;
    const role = root.getAttribute("data-role") || "school";
    const user = getUser() || { name: role === "school" ? "مدرسة النهضة الأهلية" : role === "parent" ? "أحمد باشراحيل" : "أ. سارة بامطرف", role };
    // ensure role stored
    if (!localStorage.getItem(LS_ROLE)) localStorage.setItem(LS_ROLE, role);

    document.querySelectorAll("[data-dash-name]").forEach((el) => (el.textContent = user.name));
    document.querySelectorAll("[data-dash-role]").forEach((el) =>
      (el.textContent = t(role === "school" ? "common.school" : role === "parent" ? "common.parent" : "common.teacher"))
    );

    // section switching
    const links = document.querySelectorAll("[data-section]");
    const panels = document.querySelectorAll("[data-panel]");
    links.forEach((l) =>
      l.addEventListener("click", (e) => {
        e.preventDefault();
        const s = l.getAttribute("data-section");
        links.forEach((x) => x.classList.toggle("is-active", x === l));
        panels.forEach((p) => p.classList.toggle("hidden", p.getAttribute("data-panel") !== s));
      })
    );

    // teacher completeness
    const bar = document.querySelector("[data-progress]");
    if (bar) bar.style.width = bar.getAttribute("data-progress") + "%";
  }

  /* ================= Page: notifications badge ================= */
  function initNotifications() {
    const list = document.getElementById("notif-list");
    if (!list) return;
    const lang = getLang();
    list.innerHTML = NOTIFICATIONS.map(
      (n) => `
      <div class="row" style="gap:12px;padding:14px;border:1px solid var(--border);border-radius:16px;background:#fff">
        <span class="dot ${n.unread ? "dot--instant" : ""}"></span>
        <div style="flex:1">
          <div class="small" style="font-weight:700">${lang === "en" ? n.textEn : n.text}</div>
          <div class="tiny muted">${lang === "en" ? n.timeEn : n.time}</div>
        </div>
      </div>`
    ).join("");
  }

  /* ================= Boot ================= */
  function boot() {
    applyI18n();
    renderHeader();
    renderFooter();
    initSearch();
    initTeacher();
    initRoleSelect();
    initAuth();
    initDashboard();
    initNotifications();
  }

  document.addEventListener("manhal:lang", () => {
    initSearch();
    initTeacher();
    initNotifications();
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  /* Expose a tiny API for inline page scripts */
  window.Manhal = { t, tr, icon, toast, getUser, setUser, getSaved, toggleSaved, teacherCard, emptyState, SUBJ, GRADE, DIST, TEACHERS, REQUESTS, TEACHER_REQUESTS, getLang };
})();
