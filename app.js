(() => {
  const STORAGE_KEY = "impostor-settings";
  const STARTER_KEY = "impostor-starters";
  const $ = (id) => document.getElementById(id);

  const CATEGORY_ICONS = {
    "Comida": "🍕", "Animales": "🐾", "Lugares": "📍", "Objetos": "🧸",
    "Profesiones": "👩‍🚒", "Deportes": "⚽", "Películas y series": "🎬",
    "Transporte": "🚗", "Frutas y verduras": "🥑", "Bebidas": "🥤",
    "Postres y dulces": "🍰", "Países": "🌍", "Ciudades": "🏙️",
    "Monumentos": "🗽", "Naturaleza": "🌋", "Partes del cuerpo": "🫀",
    "Ropa y accesorios": "👟", "En casa": "🛋️", "Colegio": "🎒",
    "Tecnología": "💻", "Apps y redes sociales": "📱", "Marcas": "🏷️",
    "Videojuegos": "🎮", "Superhéroes y villanos": "🦸", "Dibujos animados": "📺",
    "Famosos": "⭐", "Instrumentos musicales": "🎸", "Fiestas y celebraciones": "🎉",
    "Hobbies": "🎨", "Fantasía y mitología": "🐉", "En la playa": "🏖️",
    "Tareas del día a día": "🧺", "Emociones y sensaciones": "😵‍💫",
  };
  const icon = (cat) => CATEGORY_ICONS[cat] || "🃏";

  const AVATAR_COLORS = ["#8b5cf6", "#ec4899", "#f97316", "#eab308", "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6", "#ef4444", "#a855f7"];

  const settings = {
    players: [],
    impostors: 1,
    categories: Object.keys(CATEGORIES),
    hint: false,
    random: true,
  };

  let game = null;

  // ---------- Utilidades ----------
  const rand = (n) => Math.floor(Math.random() * n);
  const pick = (arr) => arr[rand(arr.length)];

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = rand(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function show(screen) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    $("screen-" + screen).classList.add("active");
    window.scrollTo(0, 0);
  }

  function vibrate(pattern) {
    try { navigator.vibrate && navigator.vibrate(pattern); } catch (e) {}
  }

  function avatarColor(name) {
    let h = 0;
    for (const ch of name) h = (h * 31 + ch.codePointAt(0)) >>> 0;
    return AVATAR_COLORS[h % AVATAR_COLORS.length];
  }

  function paintAvatar(el, name) {
    el.textContent = [...name][0] || "?";
    el.style.setProperty("--c", avatarColor(name));
  }

  function makeAvatar(name, size = "") {
    const el = document.createElement("span");
    el.className = "avatar " + size;
    paintAvatar(el, name);
    return el;
  }

  function shake(el) {
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
  }

  function confetti(colors) {
    const box = $("confetti");
    box.innerHTML = "";
    for (let i = 0; i < 90; i++) {
      const p = document.createElement("i");
      p.style.left = Math.random() * 100 + "vw";
      p.style.background = pick(colors);
      p.style.setProperty("--dx", (Math.random() * 40 - 20) + "vw");
      p.style.setProperty("--r", (Math.random() * 1080 - 540) + "deg");
      p.style.animationDuration = 2.2 + Math.random() * 2 + "s";
      p.style.animationDelay = Math.random() * 0.6 + "s";
      box.appendChild(p);
    }
    setTimeout(() => (box.innerHTML = ""), 5000);
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch (e) {}
  }

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!data) return;
      if (Array.isArray(data.players)) settings.players = data.players;
      if (Number.isInteger(data.impostors)) settings.impostors = data.impostors;
      if (Array.isArray(data.categories)) {
        const valid = data.categories.filter((c) => c in CATEGORIES);
        if (valid.length) settings.categories = valid;
      }
      settings.hint = !!data.hint;
      if (typeof data.random === "boolean") settings.random = data.random;
    } catch (e) {}
  }

  const maxImpostors = () => Math.max(1, Math.floor((settings.players.length - 1) / 2));

  // ---------- Configuración ----------
  function renderSetup() {
    const list = $("player-list");
    list.innerHTML = "";
    settings.players.forEach((name, i) => {
      const li = document.createElement("li");
      li.appendChild(makeAvatar(name));
      li.appendChild(document.createTextNode(name));
      const rm = document.createElement("button");
      rm.className = "remove";
      rm.type = "button";
      rm.setAttribute("aria-label", "Quitar " + name);
      rm.textContent = "×";
      rm.onclick = () => {
        settings.players.splice(i, 1);
        save();
        renderSetup();
      };
      li.appendChild(rm);
      list.appendChild(li);
    });
    $("player-count").textContent = settings.players.length;
    $("player-empty").classList.toggle("hidden", settings.players.length >= 3);
    $("player-empty").textContent = settings.players.length
      ? `Faltan ${3 - settings.players.length} para poder jugar`
      : "Añade al menos 3 jugadores";

    settings.impostors = Math.min(settings.impostors, maxImpostors());
    $("imp-count").textContent = settings.impostors;
    $("imp-label").textContent = settings.impostors === 1 ? "impostor" : "impostores";
    $("imp-minus").disabled = settings.impostors <= 1;
    $("imp-plus").disabled = settings.impostors >= maxImpostors();

    const all = Object.keys(CATEGORIES);
    const cats = $("category-list");
    cats.innerHTML = "";
    all.forEach((cat) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip" + (settings.categories.includes(cat) ? " on" : "");
      const em = document.createElement("span");
      em.className = "em";
      em.textContent = icon(cat);
      chip.append(em, cat);
      chip.onclick = () => {
        if (settings.categories.includes(cat)) {
          settings.categories = settings.categories.filter((c) => c !== cat);
        } else {
          settings.categories.push(cat);
        }
        save();
        renderSetup();
      };
      cats.appendChild(chip);
    });
    $("cat-count").textContent = settings.random ? `${all.length}` : `${settings.categories.length}/${all.length}`;

    $("opt-random").checked = settings.random;
    $("category-picker").classList.toggle("disabled", settings.random);
    $("opt-hint").checked = settings.hint;
    $("setup-error").textContent = "";
  }

  $("add-player-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("player-input");
    const name = input.value.trim();
    if (!name) return;
    if (settings.players.some((p) => p.toLowerCase() === name.toLowerCase())) {
      $("setup-error").textContent = "Ese nombre ya está.";
      shake(input);
      return;
    }
    settings.players.push(name);
    input.value = "";
    input.focus();
    save();
    renderSetup();
  });

  $("imp-minus").onclick = () => {
    settings.impostors = Math.max(1, settings.impostors - 1);
    save();
    renderSetup();
  };
  $("imp-plus").onclick = () => {
    settings.impostors = Math.min(maxImpostors(), settings.impostors + 1);
    save();
    renderSetup();
  };
  $("opt-random").onchange = (e) => {
    settings.random = e.target.checked;
    save();
    renderSetup();
  };
  $("cat-all").onclick = () => {
    settings.categories = Object.keys(CATEGORIES);
    save();
    renderSetup();
  };
  $("cat-none").onclick = () => {
    settings.categories = [];
    save();
    renderSetup();
  };
  $("opt-hint").onchange = (e) => {
    settings.hint = e.target.checked;
    save();
  };

  $("start-btn").onclick = () => {
    let error = "";
    if (settings.players.length < 3) error = "Hacen falta al menos 3 jugadores.";
    else if (!settings.random && !settings.categories.length) error = "Elige al menos una categoría.";
    if (error) {
      $("setup-error").textContent = error;
      shake($("start-btn"));
      vibrate(80);
      return;
    }
    startGame();
  };

  // ---------- Partida ----------
  function startGame() {
    const category = pick(settings.random ? Object.keys(CATEGORIES) : settings.categories);
    const players = settings.players;
    const impostors = new Set(shuffle(players.map((_, i) => i)).slice(0, settings.impostors));

    game = {
      category,
      word: pick(CATEGORIES[category]),
      impostors,
      alive: new Set(players.map((_, i) => i)),
      order: players.map((_, i) => i),
      revealIndex: 0,
    };
    showReveal();
  }

  function showReveal() {
    const idx = game.order[game.revealIndex];
    const name = settings.players[idx];
    const card = $("reveal-card");
    // Se gira la carta de vuelta sin animación para que nadie vea el reverso del siguiente.
    card.classList.add("no-anim");
    card.classList.remove("revealed", "impostor");
    void card.offsetWidth;
    card.classList.remove("no-anim");
    document.body.classList.remove("danger-mode");
    $("reveal-next").classList.add("hidden");

    const dots = $("reveal-dots");
    dots.innerHTML = "";
    game.order.forEach((_, i) => {
      const d = document.createElement("i");
      if (i < game.revealIndex) d.className = "done";
      if (i === game.revealIndex) d.className = "now";
      dots.appendChild(d);
    });

    $("reveal-name").textContent = name;
    paintAvatar($("reveal-avatar"), name);

    if (game.impostors.has(idx)) {
      $("reveal-role").textContent = "Eres el impostor";
      $("reveal-word").textContent = "🕵️";
      $("reveal-hint").textContent = settings.hint
        ? `Pista: ${icon(game.category)} ${game.category}`
        : "Disimula y descubre la palabra";
    } else {
      $("reveal-role").textContent = "La palabra secreta es";
      $("reveal-word").textContent = game.word;
      $("reveal-hint").textContent = `${icon(game.category)} ${game.category}`;
    }
    show("reveal");
  }

  $("reveal-card").onclick = () => {
    const card = $("reveal-card");
    if (card.classList.contains("revealed")) return;
    const isImpostor = game.impostors.has(game.order[game.revealIndex]);
    card.classList.add("revealed");
    card.classList.toggle("impostor", isImpostor);
    document.body.classList.toggle("danger-mode", isImpostor);
    vibrate(isImpostor ? [60, 60, 120] : 40);
    $("reveal-next").classList.remove("hidden");
    $("reveal-next").textContent =
      game.revealIndex === game.order.length - 1 ? "Ocultar y empezar 🚀" : "Ocultar y pasar ➜";
  };

  $("reveal-next").onclick = () => {
    game.revealIndex++;
    if (game.revealIndex < game.order.length) showReveal();
    else showDiscuss();
  };

  // Turno de inicio por "bolsa": todos empiezan una vez (en orden aleatorio) antes de que
  // nadie repita, y nunca empieza la misma persona dos veces seguidas.
  function pickStarter() {
    const alive = [...game.alive].map((i) => settings.players[i]);
    let state = {};
    try { state = JSON.parse(localStorage.getItem(STARTER_KEY)) || {}; } catch (e) {}
    let bag = (Array.isArray(state.bag) ? state.bag : []).filter((n) => settings.players.includes(n));
    let first = bag.find((n) => alive.includes(n) && n !== state.last);
    if (!first) {
      bag = shuffle(settings.players);
      first = bag.find((n) => alive.includes(n) && n !== state.last) || pick(alive);
    }
    bag = bag.filter((n) => n !== first);
    try { localStorage.setItem(STARTER_KEY, JSON.stringify({ bag, last: first })); } catch (e) {}
    return first;
  }

  function showDiscuss() {
    document.body.classList.remove("danger-mode");
    const first = pickStarter();
    $("first-player").textContent = first;
    paintAvatar($("first-avatar"), first);
    $("direction").textContent = Math.random() < 0.5 ? "↻ Sentido horario" : "↺ Sentido antihorario";
    show("discuss");
  }

  $("to-vote").onclick = showVote;

  function showVote() {
    const list = $("vote-list");
    list.innerHTML = "";
    [...game.alive].forEach((idx, n) => {
      const name = settings.players[idx];
      const li = document.createElement("li");
      li.style.animationDelay = n * 0.04 + "s";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.append(makeAvatar(name, "lg"), name);
      btn.onclick = () => {
        if (confirm(`¿Expulsar a ${name}?`)) expel(idx);
      };
      li.appendChild(btn);
      list.appendChild(li);
    });
    show("vote");
  }

  function aliveCounts() {
    let imps = 0;
    game.alive.forEach((i) => { if (game.impostors.has(i)) imps++; });
    return { imps, civs: game.alive.size - imps };
  }

  function expel(idx) {
    game.alive.delete(idx);
    const name = settings.players[idx];
    const verdict = $("expelled-verdict");
    $("expelled-name").textContent = name;
    paintAvatar($("expelled-avatar"), name);
    $("guess-box").classList.add("hidden");
    $("expelled-continue").classList.add("hidden");

    if (game.impostors.has(idx)) {
      verdict.textContent = "¡Era el impostor! 🎯";
      verdict.className = "verdict caught";
      $("guess-box").classList.remove("hidden");
      vibrate([40, 40, 40]);
    } else {
      verdict.textContent = "Era inocente 😬";
      verdict.className = "verdict innocent";
      vibrate(200);
      const { imps, civs } = aliveCounts();
      if (imps >= civs) {
        setTimeout(() => endGame(false, "Los impostores ya son tantos como los civiles."), 1600);
      } else {
        $("expelled-continue").classList.remove("hidden");
      }
    }
    show("expelled");
  }

  $("guess-yes").onclick = () => endGame(false, "El impostor adivinó la palabra.");
  $("guess-no").onclick = () => {
    const { imps } = aliveCounts();
    if (imps === 0) {
      endGame(true, settings.impostors > 1 ? "Habéis descubierto a todos los impostores." : "Habéis descubierto al impostor.");
    } else {
      $("guess-box").classList.add("hidden");
      $("expelled-continue").classList.remove("hidden");
      $("expelled-verdict").textContent = `¡Era impostor! Pero queda${imps > 1 ? "n" : ""} ${imps} más…`;
    }
  };

  $("expelled-continue").onclick = showDiscuss;

  function endGame(civiliansWin, reason) {
    document.body.classList.toggle("danger-mode", !civiliansWin);
    $("end-emoji").textContent = civiliansWin ? "🎉" : "😈";
    $("end-title").innerHTML = civiliansWin ? "¡Ganan los <span>civiles</span>!" : "¡Gana el <span>impostor</span>!";
    $("end-reason").textContent = reason;
    $("end-word").textContent = game.word;
    $("end-category").textContent = `${icon(game.category)} ${game.category}`;
    $("end-imp-label").textContent = game.impostors.size > 1 ? "Los impostores eran" : "El impostor era";

    const box = $("end-impostors");
    box.innerHTML = "";
    game.impostors.forEach((i) => {
      const name = settings.players[i];
      const el = document.createElement("div");
      el.className = "imp";
      el.append(makeAvatar(name, "lg"), name);
      box.appendChild(el);
    });

    show("end");
    confetti(civiliansWin
      ? ["#8b5cf6", "#22d3ee", "#34d399", "#facc15", "#f5f3ff"]
      : ["#ff2e4d", "#ff3d81", "#7f1d1d", "#f5f3ff"]);
    vibrate(civiliansWin ? [50, 50, 50, 50, 150] : [300]);
  }

  $("again-btn").onclick = startGame;
  $("settings-btn").onclick = () => {
    document.body.classList.remove("danger-mode");
    renderSetup();
    show("setup");
  };

  load();
  renderSetup();
})();
