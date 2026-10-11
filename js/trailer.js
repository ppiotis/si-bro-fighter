/* Cinematic autoplay trailer. Driven one frame at a time when ?capture=1. */
(function () {
  var FPS = 24;
  var BEATS = [
    ["logo", 48],
    ["tag", 36],
    ["elon", 40],
    ["sam", 40],
    ["dario", 40],
    ["jensen", 40],
    ["trump", 40],
    ["vs", 36],
    ["fight", 24],
    ["combo", 84],
    ["super", 110],
    ["end", 72]
  ];
  var TOTAL = 0;
  for (var i = 0; i < BEATS.length; i++) TOTAL += BEATS[i][1];

  var state = { f: -1, beat: 0, local: 0, name: "logo", started: false, error: "" };

  function beatAt(frame) {
    var acc = 0;
    for (var i = 0; i < BEATS.length; i++) {
      if (frame < acc + BEATS[i][1]) return { i: i, name: BEATS[i][0], local: frame - acc, dur: BEATS[i][1] };
      acc += BEATS[i][1];
    }
    return { i: BEATS.length - 1, name: "end", local: 71, dur: 72 };
  }

  function wipeFx() {
    G.parts = [];
    G.projs = [];
    G.ghosts = [];
    G.fx = [];
    G.walls = [];
    G.cine = null;
    G.ann = null;
    G.callout = null;
    G.combo = null;
    G.freeze = 0;
    G.hitstop = 0;
    G.shake = 0;
    G.flash = 0;
    G.superZoom = 0;
    G.timeSlow = 0;
  }

  function place(id1, id2, x1, x2, stage) {
    setupMatch(id1, id2);
    G.stage = stage;
    G.mode = "fight";
    G.roundPhase = "fight";
    G.cpuOff = true;
    G.p1.cpu = false;
    G.p2.cpu = false;
    G.p1.x = x1;
    G.p2.x = x2;
    G.p1.y = FLOOR;
    G.p2.y = FLOOR;
    G.p1.onGround = true;
    G.p2.onGround = true;
    G.p1.facing = x2 >= x1 ? 1 : -1;
    G.p2.facing = x1 >= x2 ? 1 : -1;
    G.p1.state = "idle";
    G.p2.state = "idle";
    G.p1.hp = G.p1.maxHp;
    G.p2.hp = G.p2.maxHp;
    G.p1.dispHp = G.p1.maxHp;
    G.p2.dispHp = G.p2.maxHp;
    G.timer = 99;
    G.cam.z = 1.12;
    G.cam.x = (Math.min(x1, x2) + Math.max(x1, x2)) / 2;
  }

  function readyVictim(v) {
    v.attack = null;
    v.moveId = null;
    v.state = "idle";
    v.onGround = true;
    v.y = FLOOR;
    v.vy = 0;
    v.vx = 0;
    v.invuln = 0;
    v.hp = Math.max(v.hp, 700);
    v.grabbedBy = null;
  }

  function sim() {
    if (G.roundPhase !== "fight" && G.roundPhase !== "ko") G.roundPhase = "fight";
    simFrame();
    updateParts();
    G.t++;
  }

  var PW = 1080, PH = 1920;
  var plate = null;
  var plateCtx = null;

  function gamePlate() {
    if (!plate) {
      plate = document.createElement("canvas");
      plate.width = 1280;
      plate.height = 720;
      plateCtx = plate.getContext("2d");
    }
    var keepC = canvas;
    var keepX = ctx;
    canvas = plate;
    ctx = plateCtx;
    G.dpr = 1;
    render();
    canvas = keepC;
    ctx = keepX;
    return plate;
  }

  function portraitBase(top, bot) {
    var g = ctx.createLinearGradient(0, 0, 0, PH);
    g.addColorStop(0, top || "#070814");
    g.addColorStop(1, bot || "#120810");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, PW, PH);
  }

  function fightWindow(img) {
    var dw = 1000;
    var dh = dw * (720 / 1280);
    var x = (PW - dw) / 2;
    var y = 430;
    ctx.fillStyle = "#000";
    ctx.fillRect(x - 8, y - 8, dw + 16, dh + 16);
    ctx.drawImage(img, x, y, dw, dh);
    ctx.strokeStyle = "rgba(154,231,255,0.85)";
    ctx.lineWidth = 4;
    ctx.strokeRect(x - 2, y - 2, dw + 4, dh + 4);
    return { x: x, y: y, w: dw, h: dh, bottom: y + dh };
  }

  function rosterRow(y, pose) {
    for (var i = 0; i < 5; i++) {
      ctx.save();
      ctx.translate(118 + i * 212, y);
      ctx.scale(1.05, 1.05);
      var df = dummyFighter(CAST[i], i < 3 ? 1 : -1, pose || "idle");
      df.anim = state.f + i * 6;
      drawFighter(df, 0, 0);
      ctx.restore();
    }
  }

  function renderNow() {
    G.dpr = 1;
    canvas.width = PW;
    canvas.height = PH;
    var shot = gamePlate();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.textAlign = "center";
    ctx.lineJoin = "round";
    var b = beatAt(Math.max(0, state.f));
    var name = b.name;
    if (name === "logo") {
      portraitBase("#05060f", "#140818");
      var u = Math.min(1, b.local / 10);
      ctx.save();
      ctx.translate(PW / 2, 760);
      ctx.scale(0.45 + u * 0.7, 0.45 + u * 0.7);
      chromeText("SI BRO", 0, -70, 96);
      chromeText("FIGHTER", 0, 50, 96);
      ctx.restore();
      if (b.local > 16) {
        ctx.globalAlpha = Math.min(1, (b.local - 16) / 10);
        ctx.font = "900 34px Impact, Haettenschweiler, 'Arial Black', sans-serif";
        ctx.fillStyle = "#9ae7ff";
        ctx.fillText("THE COMPUTE WARS", PW / 2, 980);
        ctx.globalAlpha = 1;
      }
    } else if (name === "tag") {
      portraitBase("#070814", "#101018");
      chromeText("PICK YOUR", PW / 2, 280, 72);
      chromeText("FIGHTER", PW / 2, 390, 84);
      ctx.font = "900 32px Impact, Haettenschweiler, 'Arial Black', sans-serif";
      ctx.fillStyle = "#ffb703";
      if (b.local > 12) ctx.fillText("BEST OF THREE", PW / 2, 500);
      rosterRow(1500 + Math.max(0, 80 - b.local * 6), "idle");
    } else if (name === "end") {
      portraitBase("#05060c", "#120814");
      var pulse = 1 + Math.sin(b.local * 0.25) * 0.015;
      ctx.save();
      ctx.translate(PW / 2, 520);
      ctx.scale(pulse, pulse);
      chromeText("SI BRO", 0, -40, 86);
      chromeText("FIGHTER", 0, 70, 86);
      ctx.restore();
      ctx.font = "900 32px Impact, Haettenschweiler, 'Arial Black', sans-serif";
      ctx.fillStyle = "#9ae7ff";
      ctx.fillText("THE COMPUTE WARS", PW / 2, 760);
      ctx.fillStyle = "#fff";
      ctx.font = "900 64px Impact, Haettenschweiler, 'Arial Black', sans-serif";
      if (b.local > 8) ctx.fillText("OUT NOW", PW / 2, 880);
      rosterRow(1560, "win");
    } else {
      var pal = "#9ae7ff";
      var title = "";
      var sub = "";
      var line = "";
      if (name === "vs") {
        title = "ELON";
        sub = "VS  JENSEN";
        line = "GTC KEYNOTE";
        pal = "#ffb020";
      } else if (name === "fight") {
        title = "FIGHT";
        sub = "ELON  VS  JENSEN";
        line = "GTC KEYNOTE";
      } else if (name === "combo") {
        title = "TRADE BLOWS";
        sub = "LIGHT INTO HEAVY";
        line = "HOLD BACK TO BLOCK";
        pal = "#ffd56a";
      } else if (name === "super") {
        title = "TO THE MOON";
        sub = "SUPER";
        line = b.local > 80 ? "K.O." : "FULL METER";
        pal = "#ffb020";
      } else if (ROSTER[name]) {
        title = ROSTER[name].name;
        sub = ROSTER[name].epithet;
        line = ROSTER[name].specials[0][0];
        pal = ROSTER[name].pal.fx;
      }
      portraitBase("#070910", "#160c14");
      ctx.font = "900 28px Impact, Haettenschweiler, 'Arial Black', sans-serif";
      ctx.fillStyle = pal;
      ctx.fillText(sub, PW / 2, 250);
      chromeText(title, PW / 2, 390, title.length > 12 ? 64 : 84);
      var win = fightWindow(shot);
      ctx.font = "900 36px Impact, Haettenschweiler, 'Arial Black', sans-serif";
      ctx.fillStyle = "#f4f7ff";
      ctx.fillText(line, PW / 2, win.bottom + 90);
    }
  }

  function beginBeat(name) {
    wipeFx();
    G.hideHud = true;
    G.letterbox = true;
    G.flash = 0.35;
    if (name === "logo" || name === "tag" || name === "end") {
      G.mode = "title";
      G.menu = 0;
      return;
    }
    if (name === "vs") {
      place("elon", "jensen", 520, 1240, "gtc");
      G.mode = "vs";
      G.vsT = 0;
      G.hideHud = true;
      return;
    }
    if (name === "fight" || name === "combo" || name === "super") {
      place("elon", "jensen", name === "super" ? 690 : 700, name === "super" ? 820 : 1040, "gtc");
      G.hideHud = false;
      G.letterbox = false;
      G.p1.meter = name === "super" ? 100 : 55;
      G.p2.meter = 40;
      G.cam.z = name === "super" ? 1.2 : 1.08;
      G.cam.x = (G.p1.x + G.p2.x) / 2;
      if (name === "fight") announce("FIGHT!", { life: 40 });
      return;
    }
    var home = { elon: "starship", sam: "orb", dario: "library", jensen: "gtc", trump: "tower" };
    var foe = { elon: "jensen", sam: "dario", dario: "elon", jensen: "trump", trump: "jensen" };
    place(name, foe[name], 620, name === "dario" ? 710 : 1180, home[name]);
    G.hideHud = false;
    G.letterbox = false;
    G.cam.z = 1.18;
    G.cam.x = name === "dario" ? 700 : 780;
    announce(ROSTER[name].name, { life: 50, color: ROSTER[name].pal.fx });
  }

  function runBeat(name, local) {
    if (name === "logo" || name === "tag" || name === "end") {
      G.mode = name === "end" ? "title" : "title";
      G.t++;
      updateParts();
      return;
    }
    if (name === "vs") {
      G.mode = "vs";
      G.vsT = local;
      G.t++;
      updateParts();
      return;
    }
    if (name === "elon" && local === 6) startMove(G.p1, "special1");
    if (name === "sam" && local === 6) startMove(G.p1, "special1");
    if (name === "dario" && local === 4) {
      readyVictim(G.p2);
      G.p2.x = G.p1.x + 100;
      G.p2.facing = -1;
      startMove(G.p1, "special2");
    }
    if (name === "jensen" && local === 4) startMove(G.p1, "special2");
    if (name === "trump" && local === 4) startMove(G.p1, "special1");
    if (name === "trump" && local === 18) startMove(G.p1, "hp");
    if (name === "combo" && local === 4) startMove(G.p1, "lp");
    if (name === "combo" && local === 10 && canCancel(G.p1)) startMove(G.p1, "hp");
    if (name === "combo" && local === 28) {
      readyVictim(G.p1);
      if (!G.p2.attack) startMove(G.p2, "special1");
    }
    if (name === "combo" && local === 48) {
      readyVictim(G.p2);
      G.p1.facing = G.p2.x >= G.p1.x ? 1 : -1;
      if (Math.abs(G.p1.x - G.p2.x) < 160) startMove(G.p1, "hk");
      else startMove(G.p1, "special2");
    }
    if (name === "super" && local === 8) {
      G.p1.meter = 100;
      G.p1.facing = 1;
      G.p2.facing = -1;
      G.p2.x = G.p1.x + 110;
      readyVictim(G.p2);
      G.p2.hp = 900;
      startMove(G.p1, "super");
    }
    if (name === "super" && local === 88) {
      announce("K.O.", { life: 36 });
      G.flash = 0.75;
      G.shake = 16;
      G.p2.hp = 0;
      G.p2.dispHp = 0;
    }
    if (name === "super" && local === 102 && G.p1.hp > 800) announce("PERFECT", { life: 30 });
    if (name === "fight" || name === "combo" || name === "super" || name === "elon" || name === "sam" || name === "dario" || name === "jensen" || name === "trump") {
      if (G.p1) G.p1.hold = { fwd: false, back: false, down: false, up: false, block: false };
      if (G.p2) G.p2.hold = { fwd: false, back: false, down: false, up: false, block: false };
      sim();
      if (G.cam && G.p1 && G.p2 && G.mode === "fight") {
        var mid = (G.p1.x + G.p2.x) / 2;
        if (G.p2.x > 2000) mid = G.p1.x + 80;
        G.cam.x += (mid - G.cam.x) * 0.18;
      }
      return;
    }
    G.t++;
    updateParts();
  }

  function overlay() {
    var b = beatAt(Math.max(0, state.f));
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.textAlign = "center";
    ctx.lineJoin = "round";
    if (b.name === "logo") {
      ctx.fillStyle = "#05060f";
      ctx.fillRect(0, 0, 1280, 720);
      var u = Math.min(1, b.local / 10);
      ctx.save();
      ctx.translate(640, 300);
      ctx.scale(0.4 + u * 0.75, 0.4 + u * 0.75);
      chromeText("SI BRO FIGHTER", 0, 0, 92);
      ctx.restore();
      if (b.local > 16) {
        ctx.globalAlpha = Math.min(1, (b.local - 16) / 10);
        ctx.font = "900 28px Impact, Haettenschweiler, 'Arial Black', sans-serif";
        ctx.fillStyle = "#9ae7ff";
        ctx.fillText("T H E   C O M P U T E   W A R S", 640, 390);
        ctx.globalAlpha = 1;
      }
    } else if (b.name === "tag") {
      ctx.fillStyle = "#070814";
      ctx.fillRect(0, 0, 1280, 720);
      for (var i = 0; i < 5; i++) {
        var slide = Math.min(1, Math.max(0, (b.local - i * 3) / 8));
        ctx.save();
        ctx.translate(150 + i * 245, 620 + (1 - slide) * 80);
        ctx.scale(0.9, 0.9);
        drawFighter(dummyFighter(CAST[i], 1, "idle"), 0, 0);
        ctx.restore();
      }
      chromeText("PICK YOUR FIGHTER", 640, 160, 58);
      ctx.font = "900 24px Impact, Haettenschweiler, 'Arial Black', sans-serif";
      ctx.fillStyle = "#ffb703";
      if (b.local > 14) ctx.fillText("BEST OF THREE  ·  ONE SUPER", 640, 214);
    } else if (b.name === "end") {
      ctx.fillStyle = "#05060c";
      ctx.fillRect(0, 0, 1280, 720);
      var pulse = 1 + Math.sin(b.local * 0.3) * 0.02;
      ctx.save();
      ctx.translate(640, 210);
      ctx.scale(pulse, pulse);
      chromeText("SI BRO FIGHTER", 0, 0, 78);
      ctx.restore();
      ctx.font = "900 26px Impact, Haettenschweiler, 'Arial Black', sans-serif";
      ctx.fillStyle = "#9ae7ff";
      ctx.fillText("THE COMPUTE WARS", 640, 270);
      ctx.fillStyle = "#fff";
      ctx.font = "900 42px Impact, Haettenschweiler, 'Arial Black', sans-serif";
      if (b.local > 10) ctx.fillText("OUT NOW", 640, 340);
      for (i = 0; i < 5; i++) {
        ctx.save();
        ctx.translate(150 + i * 245, 640);
        ctx.scale(0.95, 0.95);
        var df = dummyFighter(CAST[i], i < 3 ? 1 : -1, "win");
        df.anim = state.f;
        drawFighter(df, 0, 0);
        ctx.restore();
      }
    }
    if (G.letterbox && b.name !== "logo" && b.name !== "tag" && b.name !== "end") {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, 1280, 64);
      ctx.fillRect(0, 720 - 64, 1280, 64);
    }
  }

  function advance() {
    if (state.f >= TOTAL - 1) {
      try { renderNow(); } catch (err0) { state.error = String(err0 && err0.stack || err0); }
      return false;
    }
    state.f++;
    var b = beatAt(state.f);
    if (!state.started || b.i !== state.beat) {
      state.beat = b.i;
      state.name = b.name;
      try { beginBeat(b.name); }
      catch (err) { state.error = String(err && err.stack || err); }
    }
    try { runBeat(b.name, b.local); }
    catch (err2) { state.error = String(err2 && err2.stack || err2); }
    try { renderNow(); }
    catch (err3) { state.error = String(err3 && err3.stack || err3); }
    state.started = true;
    return state.f < TOTAL - 1;
  }

  window.__startTrailer = function () {
    state.f = -1;
    state.started = false;
    window.__TRAILER = {
      ready: true,
      total: TOTAL,
      fps: FPS,
      error: "",
      grab: function () {
        var more = advance();
        window.__TRAILER.frame = state.f;
        window.__TRAILER.more = more;
        window.__TRAILER.beat = state.name;
        window.__TRAILER.error = state.error;
        var url = canvas.toDataURL("image/jpeg", 0.86);
        return url.slice(url.indexOf(",") + 1);
      }
    };
  };

  window.__trailerLoop = function () {
    if (!window.__TRAILER) window.__startTrailer();
    var more = advance();
    if (more) requestAnimationFrame(window.__trailerLoop);
  };
})();
