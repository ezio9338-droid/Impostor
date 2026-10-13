(() => {
  const STORAGE_KEY = "impostor-settings";
  const $ = (id) => document.getElementById(id);

  const settings = {
    players: [],
    impostors: 1,
    categories: Object.keys(CATEGORIES),
    hint: false,
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
    } catch (e) {}
  }

  const maxImpostors = () => Math.max(1, Math.floor((settings.players.length - 1) / 2));

  // ---------- Configuración ----------
  function renderSetup() {
    const list = $("player-list");
    list.innerHTML = "";
    settings.players.forEach((name, i) => {
      const li = document.createElement("li");
      li.textContent = name;
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

    settings.impostors = Math.min(settings.impostors, maxImpostors());
    $("imp-count").textContent = settings.impostors;

    const cats = $("category-list");
    cats.innerHTML = "";
    Object.keys(CATEGORIES).forEach((cat) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip" + (settings.categories.includes(cat) ? " on" : "");
      chip.textContent = cat;
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
  $("opt-hint").onchange = (e) => {
    settings.hint = e.target.checked;
    save();
  };

  $("start-btn").onclick = () => {
    if (settings.players.length < 3) {
      $("setup-error").textContent = "Hacen falta al menos 3 jugadores.";
      return;
    }
    if (!settings.categories.length) {
      $("setup-error").textContent = "Elige al menos una categoría.";
      return;
    }
    startGame();
  };

  // ---------- Partida ----------
  function startGame() {
    const category = pick(settings.categories);
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
    const card = $("reveal-card");
    card.classList.remove("revealed", "impostor");
    $("reveal-next").classList.add("hidden");
    $("reveal-step").textContent = `Jugador ${game.revealIndex + 1} de ${game.order.length}`;
    $("reveal-name").textContent = settings.players[idx];

    if (game.impostors.has(idx)) {
      $("reveal-role").textContent = "Eres el impostor";
      $("reveal-word").textContent = "🕵️";
      $("reveal-hint").textContent = settings.hint ? `Pista: la categoría es «${game.category}»` : "Disimula y descubre la palabra";
    } else {
      $("reveal-role").textContent = "La palabra secreta es";
      $("reveal-word").textContent = game.word;
      $("reveal-hint").textContent = `Categoría: ${game.category}`;
    }
    show("reveal");
  }

  $("reveal-card").onclick = () => {
    const card = $("reveal-card");
    if (card.classList.contains("revealed")) return;
    card.classList.add("revealed");
    if (game.impostors.has(game.order[game.revealIndex])) card.classList.add("impostor");
    $("reveal-next").classList.remove("hidden");
    $("reveal-next").textContent =
      game.revealIndex === game.order.length - 1 ? "Ocultar y empezar" : "Ocultar y pasar";
  };

  $("reveal-next").onclick = () => {
    game.revealIndex++;
    if (game.revealIndex < game.order.length) showReveal();
    else showDiscuss();
  };

  function showDiscuss() {
    const alive = [...game.alive];
    $("first-player").textContent = settings.players[pick(alive)];
    $("direction").textContent = Math.random() < 0.5 ? "y seguid en sentido horario ↻" : "y seguid en sentido antihorario ↺";
    show("discuss");
  }

  $("to-vote").onclick = showVote;

  function showVote() {
    const list = $("vote-list");
    list.innerHTML = "";
    [...game.alive].forEach((idx) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = settings.players[idx];
      btn.onclick = () => {
        if (confirm(`¿Expulsar a ${settings.players[idx]}?`)) expel(idx);
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
    const verdict = $("expelled-verdict");
    $("expelled-name").textContent = settings.players[idx];
    $("guess-box").classList.add("hidden");
    $("expelled-continue").classList.add("hidden");

    if (game.impostors.has(idx)) {
      verdict.textContent = "¡Era el impostor! 🎯";
      verdict.className = "verdict caught";
      $("guess-box").classList.remove("hidden");
    } else {
      verdict.textContent = "Era inocente 😬";
      verdict.className = "verdict innocent";
      const { imps, civs } = aliveCounts();
      if (imps >= civs) {
        setTimeout(() => endGame(false, "Los impostores ya son tantos como los civiles."), 1200);
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
    $("end-title").textContent = civiliansWin ? "🎉 ¡Ganan los civiles!" : "🕵️ ¡Gana el impostor!";
    $("end-reason").textContent = reason;
    $("end-word").textContent = game.word;
    $("end-category").textContent = game.category;
    $("end-impostors").textContent = [...game.impostors].map((i) => settings.players[i]).join(", ");
    show("end");
  }

  $("again-btn").onclick = startGame;
  $("settings-btn").onclick = () => {
    renderSetup();
    show("setup");
  };

  load();
  renderSetup();
})();
