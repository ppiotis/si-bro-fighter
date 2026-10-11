/* SI BRO FIGHTER — simulation, input, rounds. Original moves and cast. */
var VIEW_W = 1280, VIEW_H = 720, FLOOR = 640, STAGE_L = 150, STAGE_R = 1770;
var DIFF_ORDER = ["intern", "founder", "agi"];
var STAGE_IDS = ["starship", "orb", "library", "gtc", "tower", "summit"];
var STAGE_NAME = {
  starship: "STARSHIP PAD",
  orb: "ORB HALL",
  library: "CONSTITUTION LIBRARY",
  gtc: "GTC KEYNOTE",
  tower: "GOLD TOWER RALLY",
  summit: "COMPUTE SUMMIT"
};
var HOME_STAGE = { elon: "starship", sam: "orb", dario: "library", jensen: "gtc", trump: "tower" };

var ROSTER = {
  elon: {
    id: "elon", name: "ELON", epithet: "The Grokfather",
    speed: 5.5, jump: 16.2, tall: 1.08, wide: 0.88, lean: 0.14,
    win: "The simulation just got a patch.",
    taunt: "Let's ship this to production.",
    specials: [
      ["GROK BEAM", "quarter-circle forward + punch"],
      ["CYBERTRUCK RAM", "forward, forward + punch"]
    ],
    super: ["TO THE MOON", "both punches, full meter"],
    pal: {
      skin: "#f0c7a4", skin2: "#d9a883", hair: "#1a120e",
      cloth: "#141418", cloth2: "#2c2c34", accent: "#e11d2e",
      pants: "#0e1016", shoe: "#111", fx: "#ffb020", fx2: "#fff4d2",
      metal: "#c5ccd6"
    }
  },
  sam: {
    id: "sam", name: "SAM ALTMAN", epithet: "The Softmax",
    speed: 4.35, jump: 15.2, tall: 1, wide: 1, lean: 0.02,
    win: "We shipped. The board will understand.",
    taunt: "We're so back. Safely.",
    specials: [
      ["WALL OF TEXT", "quarter-circle forward + punch"],
      ["SAFETY PIVOT", "back + kick"]
    ],
    super: ["ALIGNMENT LOCK", "both punches, full meter"],
    pal: {
      skin: "#f3d2b4", skin2: "#e0b494", hair: "#b08968",
      cloth: "#f4efe6", cloth2: "#e3d9cc", accent: "#1fbf8f",
      pants: "#cfc6b8", shoe: "#f7f4ee", fx: "#5ddec4", fx2: "#e8fff8",
      metal: "#bfc6c8"
    }
  },
  dario: {
    id: "dario", name: "DARIO", epithet: "The Constitution",
    speed: 3.75, jump: 14.6, tall: 1.02, wide: 1, lean: -0.02,
    win: "That output was not within spec.",
    taunt: "I have some concerns.",
    specials: [
      ["CONSTITUTIONAL COUNTER", "down-back + punch while blocking"],
      ["CLAUDE HANDS", "quarter-circle back + punch"]
    ],
    super: ["EXISTENTIAL PAUSE", "both punches, full meter"],
    pal: {
      skin: "#f6d3b6", skin2: "#e2b48e", hair: "#2a211c",
      cloth: "#243156", cloth2: "#1a2442", accent: "#e38a45",
      pants: "#2a3148", shoe: "#4a3428", fx: "#f0c14a", fx2: "#fff6d8",
      tee: "#f4f1ea", metal: "#d9d3c8"
    }
  },
  jensen: {
    id: "jensen", name: "JENSEN", epithet: "The Blackwell",
    speed: 4.05, jump: 14.4, tall: 0.9, wide: 1.14, lean: 0.16,
    win: "The world needed more compute. I delivered.",
    taunt: "The more you buy, the more you save.",
    specials: [
      ["CUDA KICK", "quarter-circle forward + kick"],
      ["RTX RAY PUNCH", "forward + punch"]
    ],
    super: ["FULL POWER", "both punches, full meter"],
    pal: {
      skin: "#e8c3a2", skin2: "#d0a684", hair: "#1a1a1a",
      cloth: "#161616", cloth2: "#2a2a2a", accent: "#76b900",
      pants: "#101010", shoe: "#0a0a0a", fx: "#76b900", fx2: "#e7ffb0",
      metal: "#b7c4b0"
    }
  },
  trump: {
    id: "trump", name: "TRUMP", epithet: "The Dealmaker",
    speed: 3.55, jump: 13.8, tall: 1, wide: 1.16, lean: 0.04,
    win: "Everybody's saying it. Best fighter. Tremendous.",
    taunt: "This is going to be huge.",
    specials: [
      ["YOU'RE FIRED", "close, quarter-circle back + punch"],
      ["THE WALL", "down-back + punch"]
    ],
    super: ["RALLY", "both punches, full meter"],
    pal: {
      skin: "#ee9d55", skin2: "#d9843d", hair: "#f3d56b",
      cloth: "#1c2c55", cloth2: "#152244", accent: "#d3122a",
      pants: "#172444", shoe: "#111", fx: "#ffd24a", fx2: "#fff",
      tee: "#f3f3f0", metal: "#e6c34a"
    }
  }
};
var CAST = ["elon", "sam", "dario", "jensen", "trump"];

function mkMove(o) { return o; }

function buildMoves(id) {
  var lp = mkMove({ kind: "strike", anim: "punch", startup: 4, active: 3, recovery: 11, dmg: 40, stun: 14, bstun: 9, stop: 3, kb: 5.2, type: "mid", cancel: true, hb: { x: 58, y: 116, w: 50, h: 22 }, name: "JAB" });
  var hp = mkMove({ kind: "strike", anim: "punch", startup: 8, active: 4, recovery: 16, dmg: 86, stun: 20, bstun: 14, stop: 6, kb: 9, type: "mid", hb: { x: 66, y: 118, w: 60, h: 28 }, name: "HEAVY PUNCH" });
  var lk = mkMove({ kind: "strike", anim: "kick", startup: 5, active: 4, recovery: 12, dmg: 48, stun: 15, bstun: 10, stop: 3, kb: 6.5, type: "mid", cancel: true, hb: { x: 68, y: 82, w: 64, h: 22 }, name: "KICK" });
  var hk = mkMove({ kind: "strike", anim: "kick", startup: 10, active: 5, recovery: 18, dmg: 96, stun: 22, bstun: 16, stop: 7, kb: 11, type: "mid", hb: { x: 76, y: 96, w: 74, h: 26 }, name: "HEAVY KICK" });
  var clp = mkMove({ kind: "strike", anim: "punch", startup: 5, active: 3, recovery: 12, dmg: 36, stun: 14, bstun: 10, stop: 3, kb: 4, type: "low", cancel: true, hb: { x: 62, y: 62, w: 54, h: 20 }, name: "LOW JAB" });
  var clk = mkMove({ kind: "strike", anim: "kick", startup: 6, active: 4, recovery: 14, dmg: 52, stun: 16, bstun: 13, stop: 4, kb: 7, type: "low", hb: { x: 74, y: 42, w: 80, h: 22 }, name: "LOW KICK" });
  var airp = mkMove({ kind: "strike", anim: "punch", startup: 4, active: 6, recovery: 12, dmg: 55, stun: 14, bstun: 12, stop: 4, kb: 6, type: "overhead", hb: { x: 64, y: 108, w: 56, h: 26 }, name: "AIR PUNCH" });
  var airk = mkMove({ kind: "strike", anim: "kick", startup: 6, active: 6, recovery: 14, dmg: 72, stun: 16, bstun: 14, stop: 5, kb: 8, type: "overhead", hb: { x: 76, y: 78, w: 72, h: 24 }, name: "AIR KICK" });
  var thr = mkMove({ kind: "grab", anim: "grab", startup: 4, active: 14, recovery: 16, dmg: 120, kb: 11, launch: -7, range: 76, visual: "toss", stop: 8, name: "THROW" });

  if (id === "elon") {
    lp.startup = 3; lp.recovery = 10; lp.dmg = 38; lp.hb = { x: 74, y: 120, w: 66, h: 20 };
    lk.hb = { x: 88, y: 74, w: 96, h: 18 }; lk.dmg = 46;
    airk.hb = { x: 90, y: 80, w: 96, h: 22 };
  } else if (id === "sam") {
    lp.hb = { x: 66, y: 116, w: 58, h: 20 }; lp.recovery = 8; lp.bstun = 12; lp.dmg = 36;
    lk.hb = { x: 80, y: 102, w: 76, h: 22 }; lk.recovery = 9; lk.bstun = 13; lk.dmg = 44;
  } else if (id === "dario") {
    lp.startup = 6; lp.dmg = 48; lp.hb = { x: 60, y: 120, w: 54, h: 24 };
    hk.startup = 8; hk.dmg = 102; hk.hb = { x: 48, y: 170, w: 80, h: 96 }; hk.stun = 20;
    hp.dmg = 92; hp.startup = 9;
  } else if (id === "jensen") {
    hp.dmg = 118; hp.startup = 9; hp.stop = 8; hp.stun = 22; hp.kb = 11; hp.hb = { x: 68, y: 116, w: 72, h: 34 };
    lp.dmg = 48; hk.dmg = 108;
  } else if (id === "trump") {
    lp.startup = 6; lp.dmg = 54; lp.hb = { x: 52, y: 114, w: 50, h: 28 };
    hp.dmg = 104; hp.startup = 10; hp.hb = { x: 60, y: 116, w: 66, h: 32 };
    thr.range = 112; thr.dmg = 130;
    clk.hb = { x: 80, y: 46, w: 88, h: 24 };
  }

  var specials = {};
  if (id === "elon") {
    specials.special1 = mkMove({ kind: "proj", anim: "punch", startup: 11, active: 2, recovery: 18, proj: "beam", name: "GROK BEAM", special: true });
    specials.special2 = mkMove({ kind: "dash", anim: "dash", startup: 7, active: 16, recovery: 16, dmg: 115, stun: 26, bstun: 18, stop: 8, kb: 14, type: "mid", hb: { x: 82, y: 92, w: 112, h: 66 }, vx: 17.5, armor: true, guardBreak: true, name: "CYBERTRUCK RAM", special: true, chip: 0.1 });
    specials.super = mkMove({ kind: "super", anim: "super", startup: 12, active: 6, recovery: 28, dmg: 210, stun: 12, bstun: 18, stop: 9, kb: 4, launch: -18, moon: true, hb: { x: 56, y: 168, w: 96, h: 190 }, name: "TO THE MOON", special: true, chip: 0.15, invuln: 16, superHit: true, type: "mid" });
  } else if (id === "sam") {
    specials.special1 = mkMove({ kind: "proj", anim: "punch", startup: 13, active: 2, recovery: 18, proj: "text", name: "WALL OF TEXT", special: true });
    specials.special2 = mkMove({ kind: "tele", anim: "dash", startup: 3, active: 8, recovery: 12, name: "SAFETY PIVOT", special: true });
    specials.super = mkMove({ kind: "super", anim: "super", startup: 10, active: 4, recovery: 36, dmg: 200, name: "ALIGNMENT LOCK", special: true, invuln: 12, hb: { x: 74, y: 112, w: 80, h: 36 }, type: "mid" });
  } else if (id === "dario") {
    specials.special1 = mkMove({ kind: "counter", anim: "counter", startup: 3, active: 15, recovery: 18, name: "CONSTITUTIONAL COUNTER", special: true });
    specials.special2 = mkMove({ kind: "grab", anim: "grab", startup: 8, active: 16, recovery: 18, dmg: 145, kb: 8, launch: -5, range: 118, visual: "book", name: "CLAUDE HANDS", special: true });
    specials.super = mkMove({ kind: "super", anim: "super", startup: 8, active: 6, recovery: 34, dmg: 255, name: "EXISTENTIAL PAUSE", special: true, invuln: 18, hb: { x: 90, y: 120, w: 130, h: 90 }, type: "mid" });
  } else if (id === "jensen") {
    specials.special1 = mkMove({ kind: "strike", anim: "punch", startup: 6, active: 4, recovery: 16, dmg: 72, stun: 16, bstun: 12, stop: 5, kb: 8, type: "mid", hb: { x: 70, y: 116, w: 66, h: 28 }, spawnRay: true, name: "RTX RAY PUNCH", special: true, chip: 0.08 });
    specials.special2 = mkMove({ kind: "dash", anim: "kick", startup: 8, active: 20, recovery: 16, dmg: 102, stun: 20, bstun: 14, stop: 6, kb: 12, type: "mid", hb: { x: 74, y: 90, w: 96, h: 52 }, vx: 21, name: "CUDA KICK", special: true, chip: 0.08 });
    specials.super = mkMove({ kind: "super", anim: "super", startup: 18, active: 6, recovery: 28, dmg: 280, name: "FULL POWER", special: true, invuln: 14, type: "mid" });
  } else if (id === "trump") {
    specials.special1 = mkMove({ kind: "wall", anim: "punch", startup: 6, active: 4, recovery: 16, name: "THE WALL", special: true });
    specials.special2 = mkMove({ kind: "grab", anim: "grab", startup: 7, active: 16, recovery: 20, dmg: 135, kb: 13, launch: -8, range: 108, visual: "elevator", name: "YOU'RE FIRED", special: true });
    specials.super = mkMove({ kind: "super", anim: "dash", startup: 18, active: 14, recovery: 20, dmg: 175, stun: 18, bstun: 16, stop: 8, kb: 16, type: "mid", hb: { x: 78, y: 100, w: 100, h: 70 }, wallBounce: true, name: "RALLY", special: true, chip: 0.12, invuln: 12, superHit: true });
  }

  return {
    lp: lp, hp: hp, lk: lk, hk: hk, clp: clp, clk: clk, airp: airp, airk: airk, throw: thr,
    special1: specials.special1, special2: specials.special2, super: specials.super
  };
}

var MOVES = {};
CAST.forEach(function (id) { MOVES[id] = buildMoves(id); });

var DIFFS = {
  intern: { block: 0.04, anti: 0, punish: 0, super: 0.04, fire: 0.05, spec: 0.04, react: 30, cancel: 0, jump: 0.06, mash: 0.9, throw: 0 },
  founder: { block: 0.5, anti: 0.52, punish: 0.48, super: 0.66, fire: 0.42, spec: 0.36, react: 13, cancel: 0.62, jump: 0.05, mash: 0, throw: 0.28 },
  agi: { block: 0.82, anti: 0.9, punish: 0.88, super: 0.78, fire: 0.48, spec: 0.42, react: 6, cancel: 0.86, jump: 0.03, mash: 0, throw: 0.34 }
};

var audio = { ctx: null, unlocked: false };
function unlockAudio() {
  if (G && G.mute) return;
  var AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  if (!audio.ctx) audio.ctx = new AC();
  if (audio.ctx.state === "suspended") audio.ctx.resume();
  if (!audio.unlocked) {
    audio.unlocked = true;
    if (!G || G.mode === "title") sfx.sting();
  }
}
function envGain(dur, vol) {
  if (!audio.ctx || (G && G.mute)) return null;
  var t = audio.ctx.currentTime;
  var g = audio.ctx.createGain();
  g.gain.setValueAtTime(Math.max(0.0001, vol), t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  g.connect(audio.ctx.destination);
  return g;
}
var sfx = {
  tone: function (freq, dur, type, vol, freq2) {
    if (!audio.ctx || (G && G.mute)) return;
    var t = audio.ctx.currentTime;
    var o = audio.ctx.createOscillator();
    var g = envGain(dur, vol);
    if (!g) return;
    o.type = type || "square";
    o.frequency.setValueAtTime(freq, t);
    if (freq2) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq2), t + dur);
    o.connect(g);
    o.start(t);
    o.stop(t + dur + 0.02);
  },
  noise: function (dur, vol, freq) {
    if (!audio.ctx || (G && G.mute)) return;
    var n = Math.max(1, (dur * audio.ctx.sampleRate) | 0);
    var buf = audio.ctx.createBuffer(1, n, audio.ctx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    var s = audio.ctx.createBufferSource();
    s.buffer = buf;
    var f = audio.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = freq || 900;
    var g = envGain(dur, vol);
    if (!g) return;
    s.connect(f); f.connect(g);
    s.start();
  },
  swing: function () { this.noise(0.05, 0.18, 1200); this.tone(180, 0.04, "square", 0.04, 90); },
  hit: function (heavy) {
    this.noise(heavy ? 0.12 : 0.07, heavy ? 0.45 : 0.3, heavy ? 500 : 800);
    this.tone(heavy ? 90 : 150, heavy ? 0.12 : 0.07, "sawtooth", heavy ? 0.12 : 0.06, 50);
  },
  block: function () { this.tone(320, 0.06, "square", 0.06, 180); this.noise(0.04, 0.12, 2000); },
  whoosh: function () { this.tone(520, 0.16, "sawtooth", 0.07, 140); this.noise(0.12, 0.12, 1500); },
  super: function () { this.tone(220, 0.28, "square", 0.12, 880); this.tone(110, 0.32, "sawtooth", 0.08, 55); },
  boom: function () { this.noise(0.3, 0.5, 400); this.tone(70, 0.28, "sawtooth", 0.16, 36); },
  ko: function () { this.tone(440, 0.35, "sawtooth", 0.14, 55); this.noise(0.4, 0.35, 600); },
  crowd: function () { this.noise(0.55, 0.22, 700); this.tone(180, 0.4, "triangle", 0.05, 90); },
  jump: function () { this.tone(240, 0.08, "square", 0.04, 420); },
  thud: function () { this.noise(0.08, 0.22, 300); this.tone(80, 0.08, "square", 0.06, 50); },
  blip: function () { this.tone(660, 0.05, "square", 0.05, 880); },
  deny: function () { this.tone(140, 0.08, "square", 0.05, 90); },
  fight: function () { this.tone(523, 0.08, "square", 0.07); this.tone(784, 0.1, "square", 0.06); },
  sting: function () {
    var notes = [523, 659, 784, 1046];
    for (var i = 0; i < notes.length; i++) {
      (function (f, delay) {
        setTimeout(function () { sfx.tone(f, 0.12, "square", 0.06); }, delay);
      })(notes[i], i * 90);
    }
  }
};

var keys = Object.create(null);
var just = Object.create(null);
var vkeys = Object.create(null);
var vjust = Object.create(null);

var G = null;

function makeFighter(id, x, facing) {
  return {
    id: id, x: x, y: FLOOR, vx: 0, vy: 0, facing: facing,
    hp: 1000, maxHp: 1000, dispHp: 1000, meter: 0, rounds: 0,
    onGround: true, state: "idle", frame: 0, anim: 0,
    attack: null, moveId: null, didHit: false, didCounter: false,
    hold: { fwd: false, back: false, down: false, up: false, block: false },
    pending: null, pendingT: 0, force: null,
    dirHist: [],
    ai: { t: 0, act: "idle", queued: null, back: false, down: false },
    cpu: false, hits: 0, comboT: 0, whiff: 0,
    counterOk: 0, counterLive: false, invuln: 0, flash: 0,
    stun: 0, juggle: 0, grabbed: null, grabbedBy: null,
    wallBounce: false, squash: 1, thrownKind: null,
    hopped: false, jumpT: 0
  };
}

function announce(text, opt) {
  opt = opt || {};
  G.ann = { text: text, t: 0, life: opt.life || 46, color: opt.color || "#ffffff" };
}

function burst(x, y, n, color, speed, kind) {
  for (var i = 0; i < n; i++) {
    var a = Math.random() * Math.PI * 2;
    var s = speed * (0.35 + Math.random());
    G.parts.push({
      x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1.2,
      life: 18 + Math.random() * 16, max: 34, color: color,
      kind: kind || "spark", size: 3 + Math.random() * 4,
      ch: "TOKEN WEIGHT ALIGN SAFE MODEL"[((Math.random() * 24) | 0)]
    });
  }
  if (G.parts.length > 220) G.parts.splice(0, G.parts.length - 220);
}

function worldBox(f, hb) {
  var cx = f.x + hb.x * f.facing;
  var cy = f.y - hb.y;
  return { x: cx - hb.w / 2, y: cy - hb.h / 2, w: hb.w, h: hb.h };
}
function hurtBox(f) {
  var crouch = f.onGround && (f.state === "crouch" || (f.hold.down && f.state !== "jump" && f.state !== "launch"));
  if (!f.onGround) return worldBox(f, { x: 0, y: 86, w: 48, h: 140 });
  if (crouch) return worldBox(f, { x: 6, y: 62, w: 62, h: 112 });
  return worldBox(f, { x: 0, y: 92, w: 54, h: 170 });
}
function overlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
function boxOverlap(f, opp, a) {
  if (!a || !a.hb) return false;
  return overlap(worldBox(f, a.hb), hurtBox(opp));
}

function compressDirs(hist) {
  var out = [];
  var start = Math.max(0, hist.length - 22);
  for (var i = start; i < hist.length; i++) {
    var d = hist[i];
    if (d === 5) continue;
    if (!out.length || out[out.length - 1] !== d) out.push(d);
  }
  return out;
}
function endsWith(hist, pat) {
  var c = compressDirs(hist);
  if (c.length < pat.length) return false;
  for (var i = 0; i < pat.length; i++) if (c[c.length - pat.length + i] !== pat[i]) return false;
  return true;
}
function lastDir(f) {
  var h = f.dirHist;
  for (var i = h.length - 1; i >= 0; i--) if (h[i] !== 5) return h[i];
  return 5;
}
function hasFF(hist) {
  var i = hist.length - 1;
  var guard = 0;
  while (i >= 0 && hist[i] === 5 && guard < 4) { i--; guard++; }
  if (i < 0 || hist[i] !== 6) return false;
  i--;
  guard = 0;
  var gap = false;
  while (i >= 0 && guard < 16) {
    guard++;
    var d = hist[i];
    if (d === 6) return gap;
    if (d === 5) gap = true;
    else return false;
    i--;
  }
  return false;
}

function canAct(f) {
  if (!f || f.grabbedBy) return false;
  if (f.state === "idle" || f.state === "walk" || f.state === "crouch") return true;
  if (f.state === "jump" && !f.attack) return true;
  return false;
}
function canCancel(f) {
  if (!f.attack || !f.attack.cancel || !f.didHit) return false;
  var a = f.attack;
  return f.frame >= a.startup && f.frame <= a.startup + (a.active || 1) + 8;
}
function isChainable(m) {
  return m === "hp" || m === "hk" || m === "special1" || m === "special2" || m === "super" || m === "throw";
}

function withSpec(a, extra) {
  var o = {};
  var k;
  for (k in a) o[k] = a[k];
  for (k in extra) o[k] = extra[k];
  return o;
}

function canBlock(def, spec) {
  if (!def || !spec) return false;
  if (spec.unblockable || spec.type === "throw" || spec.kind === "throw") return false;
  if (def.state === "hit" || def.state === "launch" || def.state === "down" || def.state === "getup" || def.state === "ko" || def.state === "thrown" || def.state === "cine" || def.state === "win" || def.state === "lose") return false;
  if (def.state === "attack" && def.attack) return false;
  if (!def.hold.block) return false;
  if (spec.type === "low" && !def.hold.down) return false;
  if (spec.type === "overhead" && def.hold.down && def.onGround) return false;
  return true;
}

function endRound(winner, loser, how) {
  if (!G || G.roundPhase !== "fight") return;
  G.roundPhase = "ko";
  G.how = how;
  G.koT = 0;
  G.winner = winner;
  G.loser = loser;
  winner.rounds += 1;
  if (how === "ko") {
    loser.hp = 0;
    sfx.ko();
    sfx.crowd();
    G.shake = Math.max(G.shake, 12);
    G.flash = Math.max(G.flash, 0.55);
  }
  if (winner.state !== "cine" && winner.state !== "launch") {
    winner.state = "win";
    winner.attack = null;
    winner.moveId = null;
    winner.vx = 0;
  }
  if (loser.state !== "cine" && loser.state !== "launch" && how === "ko") loser.state = "ko";
}

function startMoon(owner, def) {
  G.cine = { kind: "moon", t: 0, who: def, x0: def.x, dir: owner.facing, owner: owner };
  def.state = "cine";
  def.invuln = 80;
  def.attack = null;
  def.moveId = null;
  def.onGround = false;
  G.shake = 12;
  burst(def.x, def.y - 80, 18, "#fff6c8", 5, "star");
}

function connect(owner, def, spec, token) {
  if (!owner || !def || !spec || !token) return;
  if (token.didHit && !spec.multi) return;
  if (def.hp <= 0 && def.state === "ko") return;
  if (G.roundPhase !== "fight" && G.roundPhase !== "ko") return;
  if (def.invuln > 0 && spec.kind !== "throw" && !spec.moon) return;

  if (def.moveId === "counter" && def.counterLive && def.frame >= 3 && def.frame <= 18 && spec.kind !== "throw" && spec.kind !== "grab") {
    token.didHit = true;
    fireCounter(def, owner);
    return;
  }

  if (def.attack && def.attack.armor && def.state === "attack" && !spec.superHit && spec.kind !== "throw" &&
      def.frame >= def.attack.startup && def.frame <= def.attack.startup + def.attack.active) {
    token.didHit = true;
    def.hp = Math.max(0, def.hp - Math.round((spec.dmg || 0) * 0.45));
    def.meter = Math.min(100, def.meter + 4);
    burst(def.x, def.y - 90, 7, "#ffe0b0", 3.2, "spark");
    sfx.block();
    G.hitstop = Math.max(G.hitstop, 4);
    if (def.hp <= 0) endRound(owner, def, "ko");
    return;
  }

  var blocking = canBlock(def, spec);
  if (blocking && spec.guardBreak && !def.hold.down && def.onGround) blocking = false;

  token.didHit = true;
  if (token === owner) owner.didHit = true;
  G.hitstop = Math.max(G.hitstop, spec.stop || 4);
  def.flash = (spec.dmg || 40) > 70 ? 6 : 3;
  G.shake = Math.max(G.shake || 0, (spec.dmg || 0) > 140 ? 10 : (spec.dmg || 0) > 70 ? 5 : 3.2);

  if (blocking) {
    var chip = 0;
    if (spec.special) chip = Math.round((spec.dmg || 0) * (spec.chip || 0.08));
    if (spec.superHit) chip = Math.round((spec.dmg || 0) * (spec.chip || 0.14));
    def.hp = Math.max(0, def.hp - chip);
    def.state = "block";
    def.stun = spec.bstun || 12;
    def.frame = 0;
    def.attack = null;
    def.moveId = null;
    def.pending = null;
    def.vx = (spec.kb || 5) * 0.42 * owner.facing;
    def.counterOk = 16;
    owner.meter = Math.min(100, owner.meter + 2);
    burst((owner.x + def.x) / 2, def.y - 110, 6, "#e7f1ff", 2.4, "spark");
    sfx.block();
    if (def.hp <= 0) endRound(owner, def, "ko");
    return;
  }

  def.hp = Math.max(0, def.hp - (spec.dmg || 0));
  owner.meter = Math.min(100, owner.meter + (spec.dmg || 0) * 0.11);
  def.meter = Math.min(100, def.meter + (spec.dmg || 0) * 0.07);
  if (!spec.noCombo) {
    owner.hits = (owner.hits || 0) + 1;
    owner.comboT = 38;
    if (owner.hits >= 2) G.combo = { n: owner.hits, t: 38, who: def };
  }
  def.counterOk = 14;
  def.attack = null;
  def.moveId = null;
  def.pending = null;
  def.vx = (spec.kb || 6) * owner.facing;
  var kind = owner.id === "sam" ? "token" : owner.id === "dario" ? "page" : owner.id === "jensen" ? "shard" : owner.id === "trump" ? "coin" : "spark";
  burst((owner.x + def.x) / 2 + owner.facing * 20, def.y - 108, (spec.dmg || 0) > 100 ? 16 : 9, ROSTER[owner.id].pal.fx, 4.4, kind);
  sfx.hit((spec.dmg || 0) > 80);
  G.flash = Math.max(G.flash || 0, (spec.dmg || 0) > 120 ? 0.3 : 0.12);

  if (spec.moon) {
    startMoon(owner, def);
  } else if (spec.launch) {
    def.state = "launch";
    def.onGround = false;
    def.y -= 2;
    def.vy = spec.launch;
    def.juggle = (def.juggle || 0) + 1;
    if (def.juggle >= 2 && !spec.superHit) { def.vy = 5; def.invuln = 10; }
    if (spec.wallBounce) def.wallBounce = true;
  } else if (!def.onGround) {
    def.state = "launch";
    def.vy = Math.min(def.vy, -3);
    def.juggle = (def.juggle || 0) + 1;
    if (def.juggle >= 2 && !spec.superHit) { def.vy = 6; def.invuln = 8; }
  } else {
    def.state = "hit";
    def.stun = spec.stun || 14;
    def.frame = 0;
    if (spec.wallBounce) def.wallBounce = true;
  }
  if (def.hp <= 0) endRound(owner, def, "ko");
}

function fireCounter(def, atk) {
  if (def.didCounter) return;
  def.didCounter = true;
  def.didHit = true;
  G.callout = { text: "HELPFUL", t: 0, life: 32, color: "#ffd56a" };
  sfx.whoosh();
  if (Math.abs(def.x - atk.x) < 170) {
    connect(def, atk, { dmg: 100, stun: 18, kb: 9, stop: 8, special: true, type: "mid", chip: 0.1, kind: "strike" }, { didHit: false });
  } else {
    spawnProj(def, "counterbeam");
  }
  burst(def.x + def.facing * 40, def.y - 110, 10, "#ffd56a", 3.5, "page");
}

function spawnProj(f, kind) {
  var p = {
    owner: f, x: f.x + f.facing * 64, y: FLOOR - 116,
    vx: 14 * f.facing, w: 78, h: 18, life: 52, dmg: 85, delay: 0,
    kind: kind, didHit: false, stun: 16, bstun: 12, kb: 7, stop: 5,
    chip: 0.08, type: "mid", grow: 0
  };
  if (kind === "beam") { p.kind = "beam"; p.dmg = 86; p.vx = 14.5 * f.facing; p.w = 84; p.h = 16; }
  else if (kind === "text") { p.kind = "text"; p.vx = 6.1 * f.facing; p.w = 34; p.h = 42; p.life = 80; p.dmg = 52; p.grow = 2.15; p.stun = 14; }
  else if (kind === "counterbeam") { p.kind = "gold"; p.dmg = 100; p.vx = 16 * f.facing; p.w = 96; p.h = 26; p.life = 32; p.stun = 18; }
  else if (kind === "ray") { p.kind = "ray"; p.delay = 8; p.vx = 1.4 * f.facing; p.dmg = 46; p.w = 126; p.h = 16; p.life = 20; p.y = FLOOR - 118; }
  G.projs.push(p);
}

function snapshot(f) {
  return {
    id: f.id, facing: f.facing, state: f.state, frame: f.frame, anim: f.anim,
    moveId: f.moveId, attack: f.attack, hold: { down: !!f.hold.down },
    onGround: f.onGround, x: f.x, y: f.y, flash: 0, squash: f.squash || 1, thrownKind: f.thrownKind
  };
}

function doPivot(f) {
  G.ghosts.push({ f: snapshot(f), life: 16 });
  f.x -= f.facing * 158;
  if (f.x < STAGE_L + 40) f.x = STAGE_L + 40;
  if (f.x > STAGE_R - 40) f.x = STAGE_R - 40;
  f.invuln = Math.max(f.invuln, 14);
  f.vx = 0;
  burst(f.x, f.y - 80, 8, ROSTER[f.id].pal.fx2, 2, "spark");
  sfx.whoosh();
}

function placeWall(f) {
  var x = f.x + f.facing * 108 - 18;
  var found = null;
  for (var i = 0; i < G.walls.length; i++) if (G.walls[i].owner === f) found = G.walls[i];
  if (found) { found.x = x; found.life = 72; }
  else G.walls.push({ owner: f, x: x, y: FLOOR - 168, w: 38, h: 168, life: 72 });
  sfx.thud();
  burst(x + 18, FLOOR - 20, 8, "#c8c2b4", 2.4, "dust");
}

function tryGrab(f, opp, spec) {
  if (f.didHit || f.grabbed) return;
  var range = spec.range || 80;
  var dist = Math.abs(f.x - opp.x);
  var front = (opp.x - f.x) * f.facing > -12;
  if (!front || dist > range) return;
  if (!opp.onGround || opp.invuln > 0 || opp.hp <= 0) return;
  if (opp.attack || opp.grabbedBy || opp.state === "launch" || opp.state === "cine" || opp.state === "thrown" || opp.state === "ko") return;
  f.didHit = true;
  f.grabbed = opp;
  opp.grabbedBy = f;
  opp.state = "thrown";
  opp.attack = null;
  opp.moveId = null;
  opp.vx = 0;
  opp.vy = 0;
  opp.pending = null;
  opp.invuln = 6;
  opp.thrownKind = spec.visual || "toss";
  sfx.thud();
}

function releaseGrab(f, a) {
  var g = f.grabbed;
  if (!g) return;
  f.grabbed = null;
  g.grabbedBy = null;
  g.squash = 1;
  var vis = g.thrownKind;
  g.thrownKind = null;
  connect(f, g, {
    dmg: a.dmg || 120, kb: a.kb || 10, launch: a.launch == null ? -6 : a.launch,
    stun: 16, stop: 8, special: true, type: "throw", kind: "throw", unblockable: true,
    wallBounce: !!a.wallBounce, superHit: !!a.superHit
  }, { didHit: false });
  if (vis === "book") G.fx.push({ kind: "book", x: g.x, y: FLOOR, t: 0, life: 20 });
  if (vis === "elevator") G.fx.push({ kind: "elev", x: g.x, y: FLOOR, t: 0, life: 24 });
  burst(g.x, g.y - 60, 10, ROSTER[f.id].pal.fx, 3, vis === "book" ? "page" : "coin");
}

function pinGrab(f, a) {
  var g = f.grabbed;
  if (!g) return;
  if (f.frame >= a.startup + a.active) { releaseGrab(f, a); return; }
  g.x = f.x + f.facing * (a.visual === "book" ? 28 : 72);
  g.y = FLOOR;
  g.onGround = true;
  g.vx = 0;
  g.vy = 0;
  g.state = "thrown";
  g.thrownKind = a.visual || "toss";
  g.squash = a.visual === "elevator" ? 0.22 : (a.visual === "book" ? 0.72 : 1);
}

function superStep(f, opp, a, hits) {
  if (f.id === "elon") {
    if (f.frame > a.startup && f.frame <= a.startup + a.active && boxOverlap(f, opp, a)) {
      hits.push({ owner: f, def: opp, spec: a, token: f });
    }
    if (f.frame > a.startup && f.frame < a.startup + a.active) {
      burst(f.x + f.facing * 30, f.y - 150, 2, "#fff6d0", 3, "star");
    }
  } else if (f.id === "sam") {
    if (f.frame === 12 && !f.didHit && opp.onGround && opp.invuln <= 0 && opp.hp > 0 && Math.abs(f.x - opp.x) < 330 && G.roundPhase === "fight") {
      f.didHit = true;
      G.cine = { kind: "cage", t: 0, who: opp, x: opp.x, life: 46, owner: f };
      opp.state = "cine";
      opp.attack = null;
      opp.moveId = null;
      opp.vx = 0;
      opp.pending = null;
      sfx.whoosh();
    }
    if (G.cine && G.cine.kind === "cage" && G.cine.owner === f && Math.abs(f.x - opp.x) > 82) {
      f.vx = Math.sign(opp.x - f.x) * 9;
    }
    if (f.frame === 42 && opp.hp > 0 && opp.invuln <= 0 && Math.abs(f.x - opp.x) < 160) {
      hits.push({
        owner: f, def: opp, token: { didHit: false },
        spec: { dmg: 200, kb: 12, launch: -5, stun: 16, stop: 8, special: true, superHit: true, type: "mid", chip: 0.14, kind: "strike" }
      });
      if (G.cine && G.cine.who === opp) G.cine = null;
    }
  } else if (f.id === "dario") {
    if (f.frame === 4) {
      G.timeSlow = 58;
      G.slowWho = opp;
      G.slowOwner = f;
      G.cine = { kind: "essay", t: 0, who: opp, owner: f, life: 54, stamp: 0 };
      sfx.whoosh();
    }
    if (f.frame === 36) {
      G.timeSlow = 0;
      if (G.cine && G.cine.kind === "essay") G.cine.stamp = 1;
      var far = Math.abs(f.x - opp.x) > 460;
      if (!far && opp.invuln <= 0 && opp.hp > 0) {
        hits.push({
          owner: f, def: opp, token: { didHit: false },
          spec: { dmg: 255, kb: 13, launch: -6, stun: 18, stop: 10, special: true, superHit: true, type: "mid", chip: 0.16, kind: "strike" }
        });
      } else if (boxOverlap(f, opp, a)) {
        hits.push({ owner: f, def: opp, spec: withSpec(a, { superHit: true, special: true, dmg: 255, kb: 13, launch: -6, stun: 18, stop: 10 }), token: f });
      }
      G.shake = 12;
      burst(opp.x, opp.y - 120, 16, "#f4efe0", 4, "page");
      sfx.boom();
    }
  } else if (f.id === "jensen") {
    if (f.frame === 6) {
      G.cine = { kind: "gpu", t: 0, x: opp.x, y: FLOOR - 620, life: 48, owner: f, did: false };
      sfx.whoosh();
    }
  } else if (f.id === "trump") {
    if (f.frame === 8) {
      burst(f.x, FLOOR - 20, 28, "#ffd24a", 5, "confetti");
      sfx.crowd();
      if (opp.onGround && opp.invuln <= 0 && opp.hp > 0 && Math.abs(f.x - opp.x) < 390 && opp.state !== "cine") {
        opp.state = "hit";
        opp.stun = 24;
        opp.attack = null;
        opp.moveId = null;
        opp.pending = null;
        opp.vx = 0;
        G.hitstop = Math.max(G.hitstop, 6);
        G.callout = { text: "HUGE CROWD", t: 0, life: 28, color: "#ffd24a" };
      }
    }
    if (f.frame > a.startup && f.frame <= a.startup + a.active) {
      f.vx = 16.5 * f.facing;
      if (boxOverlap(f, opp, a)) hits.push({ owner: f, def: opp, spec: a, token: f });
    }
  }
}

function stepFighter(f, opp, hits) {
  if (G.timeSlow > 0 && f === G.slowWho && (G.t % 4 !== 0)) return;
  if (f.grabbedBy) return;
  if (!f.attack) return;
  var a = f.attack;
  f.frame++;
  if (a.kind === "dash") {
    var sp = f.frame < a.startup ? (a.vx || 10) * 0.35 : (a.vx || 10);
    if (f.frame <= a.startup + a.active) f.vx = sp * f.facing;
    else f.vx *= 0.8;
    if (f.frame % 3 === 0 && f.frame <= a.startup + a.active) G.ghosts.push({ f: snapshot(f), life: 9 });
    if (f.id === "jensen" && f.frame % 2 === 0) burst(f.x - f.facing * 10, f.y - 70, 1, "#76b900", 2.2, "shard");
    if (f.id === "elon" && f.frame % 2 === 0) burst(f.x - f.facing * 16, f.y - 30, 1, "#9aa4b2", 1.5, "dust");
  }
  if ((a.kind === "strike" || a.kind === "dash") && f.frame > a.startup && f.frame <= a.startup + a.active && boxOverlap(f, opp, a)) {
    hits.push({ owner: f, def: opp, spec: a, token: f });
  }
  if (a.spawnRay && f.frame === a.startup + 1) spawnProj(f, "ray");
  if (a.kind === "proj" && f.frame === a.startup) { spawnProj(f, a.proj); f.didHit = true; sfx.whoosh(); }
  if (a.kind === "grab" && f.frame === a.startup + 1) tryGrab(f, opp, a);
  if (a.kind === "tele" && f.frame === 4) doPivot(f);
  if (a.kind === "wall" && f.frame === 8) placeWall(f);
  if (a.kind === "super") superStep(f, opp, a, hits);
  if (f.grabbed) pinGrab(f, a);
  if (f.frame === (a.startup + a.active) && !f.didHit && a.kind !== "super" && a.kind !== "tele" && a.kind !== "wall" && a.kind !== "counter") {
    f.whiff = a.recovery || 10;
  }
  var total = (a.startup || 1) + (a.active || 1) + (a.recovery || 1);
  if (f.attack && f.frame >= total) finishAttack(f);
}

function finishAttack(f) {
  if (f.grabbed && f.attack) releaseGrab(f, f.attack);
  f.attack = null;
  f.moveId = null;
  if (f.onGround) {
    f.state = f.hold.down ? "crouch" : "idle";
    if (Math.abs(f.vx) < 8) f.vx = 0;
  } else {
    f.state = "jump";
  }
}

function startMove(f, id) {
  var spec = MOVES[f.id] && MOVES[f.id][id];
  if (!spec) return false;
  if ((id === "super") && f.meter < 100) return false;
  var cancelling = !!(f.attack && f.attack.cancel && f.didHit);
  if (!cancelling) f.hits = 0;
  if (id === "special1" && f.id === "dario") {
    f.counterLive = f.counterOk > 0 || f.hold.block || f.state === "block";
  } else f.counterLive = false;
  if (id === "super") {
    f.meter = 0;
    G.freeze = 11;
    G.superZoom = 1;
    G.superTint = ROSTER[f.id].pal.fx;
    G.superOwner = f;
    announce(spec.name, { life: 42, color: ROSTER[f.id].pal.fx });
    sfx.super();
  } else if (spec.special) {
    G.callout = { text: spec.name, t: 0, life: 30, color: ROSTER[f.id].pal.fx };
    if (spec.kind !== "proj") sfx.whoosh();
    else sfx.swing();
  } else sfx.swing();
  f.state = "attack";
  f.attack = spec;
  f.moveId = id;
  f.frame = 0;
  f.didHit = false;
  f.didCounter = false;
  f.whiff = 0;
  if (spec.invuln) f.invuln = spec.invuln;
  return true;
}

function interpret(f, opp, p) {
  if ((p === "jkl" || (p === "jk" && f.meter >= 100)) && f.meter >= 100) return "super";
  if (p === "jkl") return "special1";
  if (!f.onGround) {
    if (p === "jk" && f.meter >= 100) return "super";
    if (f.id === "jensen" && (p === "jk" || p === "lp" || p === "hp") && (p === "jk" || lastDir(f) === 6)) return "special1";
    if (p === "lk" || p === "hk" || p === "kl") return p === "hk" ? "airk" : "airk";
    if (p === "lp" || p === "hp" || p === "jk") return "airp";
    return null;
  }
  if (p === "jk") return "special1";
  if (p === "kl") return "special2";
  var punch = p === "lp" || p === "hp";
  var kick = p === "lk" || p === "hk";
  var qcf = endsWith(f.dirHist, [2, 3, 6]) || endsWith(f.dirHist, [2, 6]);
  var qcb = endsWith(f.dirHist, [2, 1, 4]) || endsWith(f.dirHist, [2, 4]);
  var ff = hasFF(f.dirHist);
  var last = lastDir(f);
  if (f.id === "elon") {
    if (punch && qcf) return "special1";
    if (punch && ff) return "special2";
  } else if (f.id === "sam") {
    if (punch && qcf) return "special1";
    if (kick && last === 4) return "special2";
  } else if (f.id === "dario") {
    if (punch && qcb) return "special2";
    if (punch && last === 1) return "special1";
  } else if (f.id === "jensen") {
    if (kick && qcf) return "special2";
    if (punch && last === 6) return "special1";
  } else if (f.id === "trump") {
    if (punch && qcb) return "special2";
    if (punch && last === 1) return "special1";
  }
  if (p === "hp" && opp && Math.abs(f.x - opp.x) < ((f.id === "trump") ? 112 : 78) && opp.onGround && !opp.attack && opp.invuln <= 0 && opp.state !== "launch" && opp.state !== "cine" && opp.state !== "thrown" && (opp.x - f.x) * f.facing > -10) {
    return "throw";
  }
  if (f.hold.down) {
    if (p === "lk" || p === "hk") return "clk";
    if (p === "lp") return "clp";
  }
  if (p === "lp" || p === "hp" || p === "lk" || p === "hk") return p;
  return null;
}

function resolveHuman(f, opp) {
  if (f.force) {
    var m = f.force;
    f.force = null;
    f.pending = null;
    f.pendingT = 0;
    if (!(canAct(f) || canCancel(f))) return;
    if (m === "super" && f.meter < 100) { sfx.deny(); return; }
    if (canCancel(f) && !isChainable(m)) return;
    if (!f.onGround && m === "special1" && f.id !== "jensen") m = "airp";
    if (!f.onGround && m === "special2") m = "airk";
    startMove(f, m);
    return;
  }
  if (!f.pending) return;
  if (!(canAct(f) || canCancel(f))) return;
  var mv = interpret(f, opp, f.pending);
  f.pending = null;
  f.pendingT = 0;
  if (!mv) return;
  if (canCancel(f) && !isChainable(mv)) return;
  startMove(f, mv);
}

function readHuman(f) {
  var left = !!(keys.KeyA || keys.ArrowLeft || vkeys.left);
  var right = !!(keys.KeyD || keys.ArrowRight || vkeys.right);
  var down = !!(keys.KeyS || keys.ArrowDown || vkeys.down);
  var up = !!(keys.KeyW || keys.ArrowUp || vkeys.up);
  var fwd = f.facing === 1 ? right : left;
  var back = f.facing === 1 ? left : right;
  f.hold.fwd = fwd;
  f.hold.back = back;
  f.hold.down = down;
  f.hold.up = up;
  f.hold.block = !!(keys.KeyU || vkeys.block || back);
  var J = !!(just.KeyJ || vjust.lp);
  var K = !!(just.KeyK || vjust.hp);
  var L = !!(just.KeyL || vjust.lk);
  var I = !!(just.KeyI || just.Semicolon || vjust.hk);
  f.btn = {
    lp: !!(keys.KeyJ || vkeys.lp),
    hp: !!(keys.KeyK || vkeys.hp),
    lk: !!(keys.KeyL || vkeys.lk),
    hk: !!(keys.KeyI || keys.Semicolon || vkeys.hk)
  };
  var dir = 5;
  if (down && back) dir = 1;
  else if (down && fwd) dir = 3;
  else if (up && back) dir = 7;
  else if (up && fwd) dir = 9;
  else if (down) dir = 2;
  else if (up) dir = 8;
  else if (back) dir = 4;
  else if (fwd) dir = 6;
  f.dirHist.push(dir);
  if (f.dirHist.length > 32) f.dirHist.shift();

  if (vjust.super) f.force = "super";
  else if (vjust.s1) f.force = "special1";
  else if (vjust.s2) f.force = "special2";

  if (J || K || L || I) {
    var bothP = (J && (K || f.btn.hp)) || (K && (J || f.btn.lp));
    var kl = (K && (L || f.btn.lk)) || (L && (K || f.btn.hp));
    var jkl = bothP && (L || I || f.btn.lk || f.btn.hk);
    if (jkl) f.pending = "jkl";
    else if (bothP) f.pending = "jk";
    else if (kl) f.pending = "kl";
    else if (J) f.pending = "lp";
    else if (K) f.pending = "hp";
    else if (L) f.pending = "lk";
    else if (I) f.pending = "hk";
    f.pendingT = 12;
  }
}

function face(f, opp) {
  if (!f || !opp) return;
  if (f.grabbed || f.grabbedBy) return;
  var locked = { attack: 1, hit: 1, block: 1, launch: 1, down: 1, getup: 1, ko: 1, thrown: 1, cine: 1, win: 1, lose: 1 };
  if (locked[f.state]) return;
  if (Math.abs(opp.x - f.x) < 16) return;
  f.facing = opp.x >= f.x ? 1 : -1;
}

function incoming(f) {
  for (var i = 0; i < G.projs.length; i++) {
    var p = G.projs[i];
    if (p.owner === f || p.delay > 0 || p.life <= 0) continue;
    var dx = f.x - p.x;
    if (Math.abs(p.y - (f.y - 110)) > 90) continue;
    if (p.vx > 0.5 && dx > 0 && dx < 280) return true;
    if (p.vx < -0.5 && dx < 0 && -dx < 280) return true;
    if (Math.abs(p.vx) <= 0.5 && Math.abs(dx) < 90) return true;
  }
  return false;
}

function thinkCPU(f, opp) {
  var d = DIFFS[G.diff] || DIFFS.founder;
  var dist = Math.abs(f.x - opp.x);
  if (canCancel(f) && Math.random() < d.cancel) return { move: "hp", t: 8, act: "idle" };
  if (d.mash && Math.random() < d.mash) {
    var bag = ["walk", "walk", "walk", "lp", "lk", "jump", "walk"];
    var pick = bag[(Math.random() * bag.length) | 0];
    if (pick === "walk") return { act: "walk", t: 22 };
    if (pick === "jump") return { act: "jump", t: 16 };
    return { move: pick, t: 20, act: "idle" };
  }
  if (incoming(f) && Math.random() < d.block) return { act: "block", t: 18 + (Math.random() * 16) | 0, down: opp.hold.down && Math.random() < 0.5 };
  if (!opp.onGround && opp.y < FLOOR - 36 && dist < 175 && Math.random() < d.anti) {
    return { move: f.id === "dario" ? "hk" : "hp", t: 12, act: "idle" };
  }
  if (f.id === "dario" && opp.attack && dist < 165 && opp.frame >= Math.max(0, (opp.attack.startup || 4) - 2) && Math.random() < d.anti) {
    f.counterOk = Math.max(f.counterOk, 8);
    f.hold.block = true;
    return { move: "special1", t: 14, act: "block" };
  }
  if (opp.whiff > 0 && dist < 145 && Math.random() < d.punish) return { move: dist < 90 ? "hp" : "hk", t: 12, act: "idle" };
  if (f.meter >= 100 && dist < 280 && Math.random() < d.super) return { move: "super", t: 16, act: "idle" };
  if (dist < (f.id === "trump" ? 108 : 74) && opp.onGround && !opp.attack && opp.invuln <= 0 && Math.random() < d.throw) {
    return { move: "throw", t: 10, act: "idle" };
  }
  if (dist > 300) {
    if (Math.random() < d.fire) return { move: "special1", t: 14, act: "idle" };
    return { act: "walk", t: 12 + (Math.random() * 10) | 0 };
  }
  if (dist < 92 && Math.random() < d.block * 0.65) return { act: "back", t: 12, down: Math.random() < 0.3 };
  if (opp.attack && dist < 200 && Math.random() < d.block) {
    return { act: "block", t: 16 + (Math.random() * 14) | 0, down: opp.hold.down || (opp.moveId === "clk") };
  }
  if (f.id === "sam" && opp.attack && dist < 210 && Math.random() < d.spec) return { move: "special2", t: 12, act: "idle" };
  if (f.id === "trump" && incoming(f)) return { move: "special1", t: 12, act: "idle" };
  if (Math.random() < d.spec) {
    var sp = "special1";
    if (f.id === "elon" && dist < 210) sp = "special2";
    if (f.id === "jensen" && dist > 160 && Math.random() < 0.6) sp = "special2";
    if (f.id === "trump" && dist < 120) sp = "special2";
    if (f.id === "dario" && dist < 130) sp = "special2";
    return { move: sp, t: 14, act: "idle" };
  }
  if (dist < 150) return { move: Math.random() < 0.55 ? "lp" : "lk", t: 10, act: "idle" };
  return { act: Math.random() < d.jump ? "jump" : "walk", t: 12 };
}

function applyAIHold(f) {
  f.hold.fwd = f.hold.back = f.hold.down = f.hold.up = f.hold.block = false;
  var act = f.ai.act;
  if (act === "walk" || act === "jump") f.hold.fwd = true;
  if (act === "jump") f.hold.up = true;
  if (act === "back") { f.hold.back = true; f.hold.block = true; }
  if (act === "block") { f.hold.back = true; f.hold.block = true; }
  if (f.ai.down) f.hold.down = true;
}

function updateCPU(f, opp) {
  if (G.cpuOff) return;
  if (f.ai.t > 0) {
    f.ai.t--;
    applyAIHold(f);
    return;
  }
  if (!canAct(f) && !canCancel(f)) {
    applyAIHold(f);
    return;
  }
  var choice = thinkCPU(f, opp);
  var d = DIFFS[G.diff] || DIFFS.founder;
  f.ai.act = choice.act || "idle";
  f.ai.down = !!choice.down;
  f.ai.queued = choice.move || null;
  f.ai.t = Math.max(4, choice.t || d.react);
  applyAIHold(f);
  if (f.ai.queued && (canAct(f) || (canCancel(f) && isChainable(f.ai.queued)))) {
    if (!(f.ai.queued === "super" && f.meter < 100)) startMove(f, f.ai.queued);
    f.ai.queued = null;
  }
}

function mobile(f) {
  return f.onGround && !f.attack && (f.state === "idle" || f.state === "walk" || f.state === "crouch");
}

function physics(f) {
  if (!f) return;
  if (f.grabbedBy) return;
  if (applyCine(f)) return;
  if (G.timeSlow > 0 && f === G.slowWho && (G.t % 4 !== 0)) return;

  if (mobile(f)) {
    var spd = ROSTER[f.id].speed;
    if (f.hold.up) {
      f.vy = -ROSTER[f.id].jump;
      f.onGround = false;
      f.y -= 1;
      f.state = "jump";
      f.jumpT = 0;
      f.hopped = false;
      f.vx = (f.hold.fwd ? spd * 0.85 : 0) + (f.hold.back ? -spd * 0.55 : 0);
      sfx.jump();
    } else if (f.hold.down) {
      f.state = "crouch";
      f.vx = 0;
    } else if (f.hold.fwd) {
      f.state = "walk";
      f.vx = spd * f.facing;
    } else if (f.hold.back) {
      f.state = "walk";
      f.vx = -spd * 0.76 * f.facing;
    } else {
      f.state = "idle";
      f.vx *= 0.45;
    }
  }

  if (!f.onGround) {
    f.jumpT = (f.jumpT || 0) + 1;
    if (!f.hopped && !f.hold.up && f.jumpT <= 7 && f.vy < 0) {
      f.vy = Math.max(f.vy, -ROSTER[f.id].jump * 0.62);
      f.hopped = true;
    }
    f.vy += 0.8;
    if (f.vy > 17) f.vy = 17;
  }
  if (f.state === "hit" || f.state === "block" || f.state === "down") f.vx *= 0.86;

  f.x += f.vx;
  f.y += f.vy;

  if (f.y >= FLOOR && f.vy >= 0) {
    var wasAir = !f.onGround;
    f.y = FLOOR;
    f.vy = 0;
    f.onGround = true;
    if (wasAir) {
      burst(f.x, FLOOR, 6, "rgba(210,210,220,0.7)", 2, "dust");
      f.juggle = 0;
      if (f.state === "launch" || f.state === "ko") {
        f.state = f.hp <= 0 ? "ko" : "down";
        f.stun = f.hp <= 0 ? 999 : 34;
        f.vx *= 0.25;
        sfx.thud();
        G.shake = Math.max(G.shake, 4);
      } else if (f.state === "attack" || f.state === "jump" || f.state === "hit") {
        if (f.state === "hit") {
          /* stay in hitstun if still stunned */
          if (f.stun <= 0) f.state = "idle";
        } else {
          f.attack = null;
          f.moveId = null;
          f.state = "idle";
          f.vx = 0;
        }
      }
    }
  } else if (f.y < FLOOR) f.onGround = false;

  if (f.onGround && f.state === "hit") {
    f.stun--;
    if (f.stun <= 0) f.state = f.hold.down ? "crouch" : "idle";
  }
  if (f.state === "block") {
    f.stun--;
    if (f.stun <= 0) f.state = f.hold.down ? "crouch" : "idle";
  }
  if (f.state === "down") {
    f.stun--;
    f.vx *= 0.8;
    if (f.stun <= 0) { f.state = "getup"; f.frame = 0; f.invuln = 14; }
  }
  if (f.state === "getup") {
    f.frame++;
    f.vx = 0;
    if (f.frame > 12) f.state = "idle";
  }
  if (f.invuln > 0 && f.state !== "cine") f.invuln--;
  if (f.counterOk > 0) f.counterOk--;
  if (f.flash > 0) f.flash--;
  if (f.whiff > 0) f.whiff--;
  f.anim++;
  clampF(f);
}

function clampF(f) {
  if (f.x < STAGE_L + 34) {
    if (f.wallBounce && f.vx < 0) {
      f.vx = 9.5; f.vy = -8; f.onGround = false; f.y = FLOOR - 2; f.wallBounce = false; f.state = "launch";
      G.shake = Math.max(G.shake, 8);
      burst(f.x, f.y - 70, 8, "#ddd", 3, "spark");
      sfx.thud();
    } else if (f.vx < 0) f.vx = 0;
    f.x = STAGE_L + 34;
  }
  if (f.x > STAGE_R - 34) {
    if (f.wallBounce && f.vx > 0) {
      f.vx = -9.5; f.vy = -8; f.onGround = false; f.y = FLOOR - 2; f.wallBounce = false; f.state = "launch";
      G.shake = Math.max(G.shake, 8);
      burst(f.x, f.y - 70, 8, "#ddd", 3, "spark");
      sfx.thud();
    } else if (f.vx > 0) f.vx = 0;
    f.x = STAGE_R - 34;
  }
}

function applyCine(f) {
  var c = G.cine;
  if (!c || c.who !== f) return false;
  c.t++;
  if (c.kind === "moon") {
    var u = Math.min(1, c.t / 66);
    var arc = Math.sin(u * Math.PI);
    f.x = c.x0 + c.dir * u * 110;
    f.y = FLOOR - arc * 980;
    f.onGround = false;
    f.vx = 0;
    f.vy = 0;
    if (c.t % 2 === 0) burst(f.x, f.y, 1, "#fff6c2", 1.2, "star");
    if (c.t >= 66) {
      f.y = FLOOR;
      f.onGround = true;
      f.vy = 0;
      f.state = f.hp <= 0 ? "ko" : "down";
      f.stun = 36;
      f.invuln = 0;
      f.hp = Math.max(0, f.hp - 80);
      G.shake = 16;
      G.flash = 0.5;
      burst(f.x, FLOOR, 18, "#ffe1a8", 5, "dust");
      burst(f.x, FLOOR - 20, 14, "#fff", 4, "star");
      sfx.boom();
      var owner = c.owner;
      G.cine = null;
      if (f.hp <= 0 && G.roundPhase === "fight") endRound(owner, f, "ko");
    }
    return true;
  }
  if (c.kind === "cage") {
    f.x = c.x;
    f.y = FLOOR;
    f.vx = 0;
    f.vy = 0;
    f.onGround = true;
    f.state = "cine";
    if (c.t >= c.life) {
      G.cine = null;
      if (f.state === "cine") { f.state = "hit"; f.stun = 10; }
    }
    return true;
  }
  return false;
}

function updateCineFX() {
  var c = G.cine;
  if (!c || c.kind !== "gpu") return;
  c.t++;
  c.y += 22;
  if (!c.did && c.y >= FLOOR - 180) {
    c.did = true;
    c.y = FLOOR - 210;
    G.shake = 16;
    G.flash = 0.55;
    sfx.boom();
    burst(c.x, FLOOR - 40, 26, "#76b900", 6, "shard");
    var opp = c.owner === G.p1 ? G.p2 : G.p1;
    if (opp && opp.invuln <= 0 && opp.hp > 0 && Math.abs(opp.x - c.x) < 155) {
      connect(c.owner, opp, {
        dmg: 280, kb: 14, launch: -8, stun: 16, stop: 10, special: true, superHit: true, type: "mid", chip: 0.16, kind: "strike"
      }, { didHit: false });
    }
  }
  if (c.t > 42) G.cine = null;
  if (G.cine && G.cine.kind === "essay" && G.cine.t > G.cine.life) G.cine = null;
}

function updateProjs() {
  var i, j, p, w, other, f;
  for (i = G.projs.length - 1; i >= 0; i--) {
    p = G.projs[i];
    if (p.delay > 0) { p.delay--; continue; }
    p.x += p.vx;
    if (p.grow) p.w += p.grow;
    p.life--;
    var box = { x: p.x - p.w / 2, y: p.y - p.h / 2, w: p.w, h: p.h };
    var killed = false;
    for (j = 0; j < G.walls.length; j++) {
      w = G.walls[j];
      if (overlap(box, w)) {
        killed = true;
        burst(p.x, p.y, 6, "#ddd", 2, "dust");
        sfx.thud();
        break;
      }
    }
    if (killed) { G.projs.splice(i, 1); continue; }
    if (!p.didHit) {
      for (j = 0; j < 2; j++) {
        f = j === 0 ? G.p1 : G.p2;
        if (!f || f === p.owner) continue;
        if (overlap(box, hurtBox(f))) {
          var beforeState = f.state;
          connect(p.owner, f, {
            dmg: p.dmg, stun: p.stun, bstun: p.bstun || 12, kb: p.kb, stop: p.stop,
            special: true, chip: p.chip || 0.08, type: p.type || "mid", kind: "proj"
          }, p);
          if (p.kind === "text" && !p.doubled && p.w > 96 && f.state === "hit") {
            p.doubled = true;
            G.projs.push({
              owner: p.owner, x: f.x, y: p.y, vx: p.vx * 0.15, w: 72, h: 36,
              life: 18, delay: 10, dmg: 40, kind: "text2", didHit: false,
              stun: 12, kb: 5, stop: 4, chip: 0.08, type: "mid", grow: 0, bstun: 10
            });
          }
          if (p.kind !== "ray") p.life = 0;
          break;
        }
      }
    }
    if (p.life <= 0 || p.x < STAGE_L - 200 || p.x > STAGE_R + 200) G.projs.splice(i, 1);
  }
  for (i = 0; i < G.projs.length; i++) {
    for (j = i + 1; j < G.projs.length; j++) {
      p = G.projs[i]; other = G.projs[j];
      if (!p || !other || p.owner === other.owner || p.delay || other.delay) continue;
      var A = { x: p.x - p.w / 2, y: p.y - p.h / 2, w: p.w, h: p.h };
      var B = { x: other.x - other.w / 2, y: other.y - other.h / 2, w: other.w, h: other.h };
      if (overlap(A, B)) {
        p.life = 0; other.life = 0;
        burst((p.x + other.x) / 2, p.y, 8, "#fff", 3, "spark");
      }
    }
  }
  G.projs = G.projs.filter(function (pr) { return pr.life > 0; });
}

function updateWalls() {
  for (var i = G.walls.length - 1; i >= 0; i--) {
    G.walls[i].life--;
    if (G.walls[i].life <= 0) G.walls.splice(i, 1);
  }
}

function pushApart(a, b) {
  if (!a.onGround || !b.onGround) return;
  if (a.grabbed || b.grabbed || a.grabbedBy || b.grabbedBy) return;
  if (a.state === "cine" || b.state === "cine" || a.state === "thrown" || b.state === "thrown") return;
  var dx = b.x - a.x;
  var dist = Math.abs(dx);
  var min = 58;
  if (dist >= min) return;
  var push = (min - dist) / 2 + 0.15;
  var s = dx === 0 ? 1 : Math.sign(dx);
  if (a.x <= STAGE_L + 60) b.x += push * 2;
  else if (b.x >= STAGE_R - 60) a.x -= push * 2;
  else { a.x -= s * push; b.x += s * push; }
}

function simFrame() {
  var p1 = G.p1, p2 = G.p2;
  if (!p1 || !p2) return;
  face(p1, p2);
  face(p2, p1);
  if (G.roundPhase === "fight") {
    if (p1.cpu) updateCPU(p1, p2); else resolveHuman(p1, p2);
    if (p2.cpu) updateCPU(p2, p1); else resolveHuman(p2, p1);
  }
  if (G.freeze > 0) { G.freeze--; return; }
  if (G.hitstop > 0) { G.hitstop--; return; }
  var hits = [];
  stepFighter(p1, p2, hits);
  stepFighter(p2, p1, hits);
  for (var i = 0; i < hits.length; i++) connect(hits[i].owner, hits[i].def, hits[i].spec, hits[i].token);
  updateProjs();
  updateWalls();
  updateCineFX();
  if (G.cine && G.cine.kind === "essay") {
    G.cine.t++;
    if (G.cine.t > G.cine.life) G.cine = null;
  }
  if (G.timeSlow > 0) G.timeSlow--;
  physics(p1);
  physics(p2);
  pushApart(p1, p2);
  clampF(p1);
  clampF(p2);
  if (p1.pendingT > 0) { p1.pendingT--; if (p1.pendingT <= 0) p1.pending = null; }
  if (p2.pendingT > 0) { p2.pendingT--; if (p2.pendingT <= 0) p2.pending = null; }
  if (p1.comboT > 0) { p1.comboT--; if (p1.comboT <= 0) p1.hits = 0; }
  if (p2.comboT > 0) { p2.comboT--; if (p2.comboT <= 0) p2.hits = 0; }
  if (G.roundPhase === "fight") {
    G.tick++;
    if (G.tick >= 60) {
      G.tick = 0;
      G.timer--;
      if (G.timer <= 0) timeUp();
    }
  }
}

function timeUp() {
  if (G.roundPhase !== "fight") return;
  announce("TIME");
  sfx.ko();
  var a = G.p1, b = G.p2;
  if (Math.abs(a.hp - b.hp) < 3) {
    G.roundPhase = "draw";
    G.koT = 0;
    G.how = "draw";
    G.winner = null;
    announce("DRAW", { life: 50 });
  } else if (a.hp > b.hp) endRound(a, b, "time");
  else endRound(b, a, "time");
}

function march(f, x) {
  f.attack = null;
  f.moveId = null;
  f.onGround = true;
  f.y = FLOOR;
  f.vy = 0;
  if (Math.abs(f.x - x) < 3) { f.x = x; f.vx = 0; f.state = "idle"; return; }
  f.facing = f.x < x ? 1 : -1;
  f.vx = Math.sign(x - f.x) * 3.4;
  f.state = "walk";
  f.x += f.vx;
  f.anim++;
}

function updateIntro() {
  G.introT++;
  march(G.p1, 520);
  march(G.p2, 1240);
  if (Math.abs(G.p2.x - G.p1.x) > 20) {
    G.p1.facing = 1;
    G.p2.facing = -1;
  }
  if (G.introT === 22) announce("ROUND " + G.round);
  if (G.introT === 70) { announce("FIGHT!"); sfx.fight(); }
  if (G.introT === 86) {
    G.roundPhase = "fight";
    G.timer = 99;
    G.tick = 0;
    if (G.showTut) G.tutT = 280;
  }
}

function updateRoundEnd() {
  G.koT++;
  G.freeze = 0;
  G.hitstop = 0;
  physics(G.p1);
  physics(G.p2);
  updateProjs();
  updateCineFX();
  if (G.koT === 18 && G.how === "ko") announce("K.O.");
  if (G.koT === 50 && G.winner && G.winner.hp >= G.winner.maxHp - 0.5) announce("PERFECT");
  if (G.koT >= 108) {
    if (G.roundPhase === "draw" || G.how === "draw") { nextRound(); return; }
    if (G.winner && G.winner.rounds >= 2) matchEnd();
    else nextRound();
  }
}

function resetBody(f, x, facing) {
  f.x = x; f.y = FLOOR; f.vx = 0; f.vy = 0; f.facing = facing;
  f.hp = f.maxHp; f.dispHp = f.maxHp;
  f.onGround = true; f.state = "idle"; f.frame = 0;
  f.attack = null; f.moveId = null; f.didHit = false;
  f.pending = null; f.pendingT = 0; f.force = null;
  f.hits = 0; f.comboT = 0; f.whiff = 0; f.invuln = 0; f.stun = 0;
  f.juggle = 0; f.grabbed = null; f.grabbedBy = null; f.wallBounce = false;
  f.squash = 1; f.thrownKind = null; f.flash = 0;
  f.ai.t = 0; f.ai.queued = null;
}

function nextRound() {
  G.round += 1;
  G.roundPhase = "intro";
  G.introT = 0;
  G.koT = 0;
  G.how = null;
  G.winner = null;
  G.loser = null;
  G.projs = [];
  G.walls = [];
  G.fx = [];
  G.cine = null;
  G.freeze = 0;
  G.hitstop = 0;
  G.timeSlow = 0;
  G.slowWho = null;
  G.timer = 99;
  G.tick = 0;
  G.combo = null;
  resetBody(G.p1, 240, 1);
  resetBody(G.p2, 1580, -1);
}

function setupMatch(id1, id2) {
  G.p1 = makeFighter(id1, 240, 1);
  G.p2 = makeFighter(id2, 1580, -1);
  G.p1.cpu = false;
  G.p2.cpu = true;
  G.round = 1;
  G.roundPhase = "intro";
  G.introT = 0;
  G.koT = 0;
  G.how = null;
  G.winner = null;
  G.loser = null;
  G.timer = 99;
  G.tick = 0;
  G.projs = [];
  G.walls = [];
  G.parts = [];
  G.ghosts = [];
  G.fx = [];
  G.cine = null;
  G.freeze = 0;
  G.hitstop = 0;
  G.timeSlow = 0;
  G.combo = null;
  G.callout = null;
  var home = HOME_STAGE[id2] || "summit";
  if (id1 === id2) home = "summit";
  G.stage = home;
  G.vsT = 0;
}

function matchEnd() {
  G.mode = "matchend";
  G.menu = 0;
  var playerWon = G.winner === G.p1;
  announce(playerWon ? "YOU WIN" : "YOU LOSE", { life: 70 });
  sfx.sting();
}

function freshGame() {
  G = {
    mode: "title",
    menu: 0,
    diff: "founder",
    t: 0,
    p1i: 0,
    p2i: 3,
    selPhase: 0,
    stage: "gtc",
    projs: [],
    walls: [],
    parts: [],
    ghosts: [],
    fx: [],
    cine: null,
    cam: { x: 960, z: 1 },
    shake: 0,
    flash: 0,
    superZoom: 0,
    superTint: "#fff",
    mute: false,
    showTut: true,
    tutT: 0,
    secret: { e: 0, s: 0, t: 0, done: false },
    ann: null,
    callout: null,
    combo: null,
    mouse: null,
    mouseMoved: false,
    clicked: false,
    layout: { ox: 0, oy: 0, sc: 1 },
    cpuOff: false,
    roundPhase: "intro",
    boxes: false
  };
  try { G.showTut = localStorage.getItem("abf_tut_v1") !== "1"; } catch (e) { G.showTut = true; }
}

function inside(p, r) {
  return p && r && p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
}
function titleButtons() {
  return [
    { id: "start", x: 420, y: 292, w: 440, h: 52, label: "START" },
    { id: "vs", x: 420, y: 356, w: 440, h: 52, label: "VERSUS CPU" },
    { id: "controls", x: 420, y: 420, w: 440, h: 52, label: "CONTROLS" }
  ];
}
function titleDiffPills() {
  return DIFF_ORDER.map(function (id, i) {
    return { id: id, x: 400 + i * 168, y: 512, w: 156, h: 40 };
  });
}
function cardRect(i) {
  return { x: 18 + i * 252, y: 118, w: 238, h: 292 };
}
function selectDiffPills() {
  return DIFF_ORDER.map(function (id, i) {
    return { id: id, x: 760 + i * 166, y: 22, w: 156, h: 36 };
  });
}
function winButtons() {
  return [
    { id: "rematch", x: 300, y: 575, w: 300, h: 58, label: "REMATCH" },
    { id: "select", x: 680, y: 575, w: 320, h: 58, label: "CHARACTER SELECT" }
  ];
}
function setDiff(id) {
  if (DIFF_ORDER.indexOf(id) >= 0 && G.diff !== id) {
    G.diff = id;
    sfx.blip();
  }
}
function cycleDiff(dir) {
  var i = DIFF_ORDER.indexOf(G.diff);
  if (i < 0) i = 1;
  i = (i + dir + DIFF_ORDER.length) % DIFF_ORDER.length;
  setDiff(DIFF_ORDER[i]);
}

function goSelect() {
  G.mode = "select";
  G.selPhase = 0;
  G.menu = G.p1i || 0;
  sfx.blip();
}
function confirmSelect() {
  if (G.selPhase === 0) {
    G.p1i = G.menu;
    G.selPhase = 1;
    G.menu = G.p2i;
    if (G.menu === G.p1i) G.menu = (G.menu + 3) % 5;
    if (CAST[G.p1i] !== "jensen" && G.p2i === G.p1i) G.menu = CAST.indexOf("jensen");
    sfx.blip();
    return;
  }
  G.p2i = G.menu;
  setupMatch(CAST[G.p1i], CAST[G.p2i]);
  G.mode = "vs";
  sfx.blip();
}
function cycleStage(dir) {
  var i = STAGE_IDS.indexOf(G.stage);
  if (i < 0) i = 0;
  i = (i + dir + STAGE_IDS.length) % STAGE_IDS.length;
  G.stage = STAGE_IDS[i];
  sfx.blip();
}

function updateTitle() {
  var buttons = titleButtons();
  if (G.mouseMoved && G.mouse) {
    for (var i = 0; i < buttons.length; i++) if (inside(G.mouse, buttons[i])) G.menu = i;
  }
  if (just.ArrowUp || just.KeyW) { G.menu = (G.menu + buttons.length - 1) % buttons.length; sfx.blip(); }
  if (just.ArrowDown || just.KeyS) { G.menu = (G.menu + 1) % buttons.length; sfx.blip(); }
  if (just.ArrowLeft || just.KeyA) cycleDiff(-1);
  if (just.ArrowRight || just.KeyD) cycleDiff(1);
  if (just.Digit1) setDiff("intern");
  if (just.Digit2) setDiff("founder");
  if (just.Digit3) setDiff("agi");
  var pills = titleDiffPills();
  if (G.clicked && G.mouse) {
    for (i = 0; i < pills.length; i++) if (inside(G.mouse, pills[i])) setDiff(pills[i].id);
  }
  var activate = just.Enter || just.NumpadEnter || (G.clicked && inside(G.mouse, buttons[G.menu]));
  if (!activate && G.clicked && G.mouse) {
    for (i = 0; i < buttons.length; i++) if (inside(G.mouse, buttons[i])) { G.menu = i; activate = true; }
  }
  if (activate) {
    if (G.menu === 2) { G.mode = "controls"; sfx.blip(); }
    else goSelect();
  }
  if (just.Enter || just.NumpadEnter) G.secret.e++;
  if (just.Space) G.secret.s++;
  G.secret.t++;
  if (G.secret.t > 36) { G.secret.e = 0; G.secret.s = 0; G.secret.t = 0; }
  if (!G.secret.done && G.secret.e >= 2 && G.secret.s >= 2) {
    G.secret.done = true;
    announce("THE BROS ARE HERE.", { life: 70, color: "#9ae7ff" });
    sfx.sting();
  }
}

function updateControls() {
  if (just.Escape || just.Enter || just.Backspace || just.NumpadEnter || G.clicked) {
    G.mode = "title";
    sfx.blip();
  }
}

function updateSelect() {
  if (G.mouseMoved && G.mouse) {
    for (var i = 0; i < 5; i++) if (inside(G.mouse, cardRect(i))) G.menu = i;
  }
  if (just.ArrowLeft || just.KeyA) { G.menu = (G.menu + 4) % 5; sfx.blip(); }
  if (just.ArrowRight || just.KeyD) { G.menu = (G.menu + 1) % 5; sfx.blip(); }
  if (just.Digit1) setDiff("intern");
  if (just.Digit2) setDiff("founder");
  if (just.Digit3) setDiff("agi");
  if (just.KeyQ) cycleDiff(-1);
  if (just.KeyE) cycleDiff(1);
  var pills = selectDiffPills();
  if (G.clicked && G.mouse) {
    for (i = 0; i < pills.length; i++) if (inside(G.mouse, pills[i])) setDiff(pills[i].id);
    for (i = 0; i < 5; i++) if (inside(G.mouse, cardRect(i))) { G.menu = i; confirmSelect(); }
  }
  if (just.Enter || just.NumpadEnter) confirmSelect();
  if (just.Escape || just.Backspace) {
    if (G.selPhase === 1) { G.selPhase = 0; G.menu = G.p1i; sfx.blip(); }
    else { G.mode = "title"; sfx.blip(); }
  }
}

function updateVS() {
  G.vsT++;
  if (just.ArrowLeft || just.KeyA) { cycleStage(-1); G.vsT = Math.min(G.vsT, 50); }
  if (just.ArrowRight || just.KeyD) { cycleStage(1); G.vsT = Math.min(G.vsT, 50); }
  if (G.vsT > 150 || (G.vsT > 18 && (just.Enter || just.NumpadEnter || G.clicked))) {
    G.mode = "fight";
    G.roundPhase = "intro";
    G.introT = 0;
    if (G.p1) { G.p1.x = 240; G.p1.y = FLOOR; }
    if (G.p2) { G.p2.x = 1580; G.p2.y = FLOOR; }
  }
}

function updateFight() {
  if (G.roundPhase === "intro") {
    updateIntro();
  } else if (G.roundPhase === "ko" || G.roundPhase === "draw") {
    updateRoundEnd();
  } else {
    if (!G.p1.cpu) readHuman(G.p1);
    if (!G.p2.cpu) readHuman(G.p2);
    simFrame();
    if (G.tutT > 0) {
      G.tutT--;
      if (G.tutT === 0) {
        G.showTut = false;
        try { localStorage.setItem("abf_tut_v1", "1"); } catch (e) {}
      }
    }
  }
  if (just.KeyM) G.mute = !G.mute;
  var target = (G.p1.x + G.p2.x) / 2;
  var dist = Math.abs(G.p1.x - G.p2.x);
  var z = 1;
  if (dist > 900) z = Math.max(0.78, 900 / dist);
  z = Math.min(1.22, z + (G.superZoom || 0) * 0.2);
  G.cam.z += (z - G.cam.z) * 0.1;
  G.cam.x += (target - G.cam.x) * 0.12;
  var viewW = VIEW_W / G.cam.z;
  var half = viewW / 2;
  var min = STAGE_L - 40 + half;
  var max = STAGE_R + 40 - half;
  if (min < max) G.cam.x = Math.max(min, Math.min(max, G.cam.x));
}

function updateMatchEnd() {
  var buttons = winButtons();
  if (G.mouseMoved && G.mouse) {
    for (var i = 0; i < buttons.length; i++) if (inside(G.mouse, buttons[i])) G.menu = i;
  }
  if (just.ArrowLeft || just.ArrowUp || just.KeyA) { G.menu = 0; sfx.blip(); }
  if (just.ArrowRight || just.ArrowDown || just.KeyD) { G.menu = 1; sfx.blip(); }
  var go = just.Enter || just.NumpadEnter;
  if (G.clicked && G.mouse) {
    for (i = 0; i < buttons.length; i++) if (inside(G.mouse, buttons[i])) { G.menu = i; go = true; }
  }
  if (go) {
    if (G.menu === 0) {
      var a = G.p1.id, b = G.p2.id, st = G.stage;
      setupMatch(a, b);
      G.stage = st;
      G.mode = "vs";
    } else {
      G.mode = "select";
      G.selPhase = 0;
      G.menu = CAST.indexOf(G.p1.id);
      if (G.menu < 0) G.menu = 0;
    }
  }
}

function updateParts() {
  var i;
  for (i = G.parts.length - 1; i >= 0; i--) {
    var p = G.parts[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.kind === "dust" || p.kind === "star" ? -0.02 : 0.14;
    p.life--;
    if (p.life <= 0) G.parts.splice(i, 1);
  }
  for (i = G.ghosts.length - 1; i >= 0; i--) {
    G.ghosts[i].life--;
    if (G.ghosts[i].life <= 0) G.ghosts.splice(i, 1);
  }
  for (i = G.fx.length - 1; i >= 0; i--) {
    G.fx[i].t++;
    if (G.fx[i].t > G.fx[i].life) G.fx.splice(i, 1);
  }
  if (G.ann) { G.ann.t++; if (G.ann.t > G.ann.life) G.ann = null; }
  if (G.callout) { G.callout.t++; if (G.callout.t > G.callout.life) G.callout = null; }
  if (G.combo && G.combo.t > 0) { G.combo.t--; if (G.combo.t <= 0) G.combo = null; }
  if (G.flash > 0.02) G.flash *= 0.86; else G.flash = 0;
  if (G.shake > 0.25) G.shake *= 0.86; else G.shake = 0;
  if (G.superZoom > 0.02) G.superZoom *= 0.95; else G.superZoom = 0;
  if (G.p1) { if (G.p1.dispHp > G.p1.hp) G.p1.dispHp -= Math.max(0.8, (G.p1.dispHp - G.p1.hp) * 0.1); else G.p1.dispHp = G.p1.hp; }
  if (G.p2) { if (G.p2.dispHp > G.p2.hp) G.p2.dispHp -= Math.max(0.8, (G.p2.dispHp - G.p2.hp) * 0.1); else G.p2.dispHp = G.p2.hp; }
  if ((G.mode === "fight" || G.mode === "title" || G.mode === "vs") && G.stage === "starship" && G.t % 5 === 0) {
    G.parts.push({ x: 430 + Math.random() * 30, y: FLOOR - 80, vx: (Math.random() - 0.5) * 0.4, vy: -0.7 - Math.random(), life: 48, max: 48, color: "rgba(226,236,242,0.45)", kind: "dust", size: 10, ch: "" });
  }
}

function update() {
  if (G.mode === "title") updateTitle();
  else if (G.mode === "controls") updateControls();
  else if (G.mode === "select") updateSelect();
  else if (G.mode === "vs") updateVS();
  else if (G.mode === "fight") updateFight();
  else if (G.mode === "matchend") updateMatchEnd();
  updateParts();
  G.t++;
  G.mouseMoved = false;
  G.clicked = false;
  for (var k in just) delete just[k];
  for (var v in vjust) delete vjust[v];
}

function runSelfTest() {
  var fails = 0;
  var log = [];
  function ok(name, cond, extra) {
    log.push((cond ? "PASS " : "FAIL ") + name + (extra ? " :: " + extra : ""));
    if (!cond) fails++;
  }
  freshGame();
  G.cpuOff = true;
  ok("qcf", endsWith([5, 2, 2, 3, 3, 6], [2, 3, 6]));
  ok("qcf lenient", endsWith([2, 5, 6], [2, 6]));
  ok("ff", hasFF([6, 5, 5, 6]) && !hasFF([6, 6, 6]) && !hasFF([2, 3, 6]));
  ok("qcb", endsWith([2, 1, 4], [2, 1, 4]));

  G.mode = "fight";
  G.roundPhase = "fight";
  G.timer = 99;
  G.tick = 0;
  G.p1 = makeFighter("elon", 700, 1);
  G.p2 = makeFighter("jensen", 770, -1);
  G.p1.cpu = false;
  G.p2.cpu = false;
  var before = G.p2.hp;
  startMove(G.p1, "lp");
  for (var i = 0; i < 30; i++) simFrame();
  ok("jab damages", G.p2.hp < before, "hp=" + G.p2.hp);

  G.p1 = makeFighter("elon", 700, 1);
  G.p2 = makeFighter("sam", 768, -1);
  G.p2.hold.back = true;
  G.p2.hold.block = true;
  G.p2.cpu = false;
  G.p1.cpu = false;
  startMove(G.p1, "lp");
  for (i = 0; i < 20; i++) {
    G.p2.hold.back = true;
    G.p2.hold.block = true;
    G.p2.vx = 0;
    simFrame();
    G.p2.hold.back = true;
    G.p2.hold.block = true;
  }
  ok("standing jab blocked", G.p2.hp === 1000, "hp=" + G.p2.hp + " state=" + G.p2.state);

  G.projs = [];
  G.p1 = makeFighter("elon", 500, 1);
  G.p2 = makeFighter("jensen", 980, -1);
  G.p1.cpu = G.p2.cpu = false;
  startMove(G.p1, "special1");
  var saw = false;
  for (i = 0; i < 90; i++) {
    if (G.projs.length) saw = true;
    simFrame();
  }
  ok("grok beam spawns and hits", saw && G.p2.hp < 1000, "hp=" + G.p2.hp + " saw=" + saw);

  G.projs = [];
  G.walls = [];
  G.p1 = makeFighter("elon", 600, 1);
  G.p2 = makeFighter("trump", 1100, -1);
  G.p1.cpu = G.p2.cpu = false;
  G.walls.push({ owner: G.p2, x: 820, y: FLOOR - 168, w: 38, h: 168, life: 72 });
  startMove(G.p1, "special1");
  for (i = 0; i < 80; i++) simFrame();
  ok("wall blocks beam", G.p2.hp === 1000, "hp=" + G.p2.hp);

  G.walls = [];
  G.projs = [];
  G.p1 = makeFighter("elon", 700, 1);
  G.p2 = makeFighter("jensen", 770, -1);
  G.p1.cpu = G.p2.cpu = false;
  G.p1.meter = 100;
  var meterBefore = G.p1.meter;
  startMove(G.p1, "super");
  ok("super spends meter", G.p1.meter === 0 && meterBefore === 100, "meter=" + G.p1.meter);
  for (i = 0; i < 100; i++) simFrame();
  ok("super deals damage", G.p2.hp < 800, "hp=" + G.p2.hp);

  G.p1 = makeFighter("elon", 700, 1);
  G.p2 = makeFighter("jensen", 768, -1);
  G.p1.cpu = G.p2.cpu = false;
  G.roundPhase = "fight";
  startMove(G.p1, "lp");
  var chained = false;
  for (i = 0; i < 24; i++) {
    simFrame();
    if (canCancel(G.p1)) { startMove(G.p1, "hp"); chained = true; break; }
  }
  for (i = 0; i < 30; i++) simFrame();
  ok("light chains into heavy", chained && G.p1.hits >= 2 && G.p2.hp < 1000 - 50, "hits=" + G.p1.hits + " hp=" + G.p2.hp + " chained=" + chained);

  G.p1 = makeFighter("elon", 700, 1);
  G.p2 = makeFighter("jensen", 770, -1);
  G.p1.cpu = G.p2.cpu = false;
  G.p2.hp = 30;
  G.roundPhase = "fight";
  G.p1.rounds = 0;
  startMove(G.p1, "hp");
  for (i = 0; i < 40; i++) simFrame();
  ok("KO awards a round", G.roundPhase === "ko" && G.p1.rounds === 1, "phase=" + G.roundPhase + " rounds=" + G.p1.rounds + " hp=" + G.p2.hp);

  G.p1.rounds = 2;
  G.winner = G.p1;
  G.roundPhase = "ko";
  G.how = "ko";
  G.koT = 107;
  G.mode = "fight";
  updateRoundEnd();
  ok("match ends at two rounds", G.mode === "matchend", "mode=" + G.mode);

  G.mode = "select";
  G.selPhase = 0;
  G.menu = 0;
  confirmSelect();
  ok("select locks player then cpu", G.selPhase === 1);
  G.menu = CAST.indexOf("jensen");
  confirmSelect();
  ok("elon vs jensen on GTC", G.mode === "vs" && G.p1.id === "elon" && G.p2.id === "jensen" && G.stage === "gtc", G.p1 && G.p2 ? (G.p1.id + " " + G.p2.id + " " + G.stage) : "missing");

  var aId = G.p1.id, bId = G.p2.id;
  G.p1.rounds = 2;
  G.mode = "matchend";
  G.winner = G.p1;
  setupMatch(aId, bId);
  ok("rematch clears rounds", G.p1.rounds === 0 && G.p2.rounds === 0);

  var smokeErr = null;
  try {
    setupMatch("elon", "jensen");
    G.mode = "fight";
    G.roundPhase = "fight";
    G.introT = 999;
    G.timer = 99;
    G.cpuOff = false;
    G.p1.cpu = true;
    G.p2.cpu = true;
    G.p1.x = 700;
    G.p2.x = 1000;
    for (i = 0; i < 60 * 12; i++) {
      if (G.roundPhase === "fight") simFrame();
      else if (G.roundPhase === "ko" || G.roundPhase === "draw") updateRoundEnd();
      else break;
      if (G.mode === "matchend") break;
    }
  } catch (e) { smokeErr = e && e.stack ? e.stack : String(e); }
  ok("cpu smoke 12s", !smokeErr, smokeErr || ("p1hp=" + G.p1.hp + " p2hp=" + G.p2.hp + " mode=" + G.mode));
  ok("cpu smoke dealt damage", smokeErr ? false : (G.p1.hp < 1000 || G.p2.hp < 1000 || G.mode === "matchend"));

  var mashErr = null;
  try {
    setupMatch("elon", "jensen");
    G.mode = "fight";
    G.roundPhase = "fight";
    G.diff = "intern";
    G.cpuOff = false;
    G.p1.cpu = false;
    G.p2.cpu = true;
    G.p1.x = 700;
    G.p2.x = 790;
    G.p1.facing = 1;
    G.p2.facing = -1;
    for (i = 0; i < 60 * 70 && G.mode === "fight"; i++) {
      if (G.roundPhase === "intro") {
        G.roundPhase = "fight";
        G.p1.x = 700;
        G.p2.x = 790;
        G.timer = 99;
      } else if (G.roundPhase === "ko" || G.roundPhase === "draw") {
        updateRoundEnd();
        if (G.roundPhase === "intro") {
          G.roundPhase = "fight";
          G.p1.x = 700;
          G.p2.x = 790;
          G.timer = 99;
        }
      } else {
        G.p1.facing = G.p2.x >= G.p1.x ? 1 : -1;
        G.p1.hold.fwd = true;
        G.p1.hold.back = false;
        G.p1.hold.block = false;
        G.p1.hold.down = false;
        if (i % 16 === 0) {
          if (canCancel(G.p1)) startMove(G.p1, "hp");
          else if (canAct(G.p1)) startMove(G.p1, Math.abs(G.p1.x - G.p2.x) < 120 ? "lp" : "special1");
        }
        simFrame();
      }
    }
  } catch (e2) { mashErr = e2 && e2.stack ? e2.stack : String(e2); }
  ok("intern loses to mashing", !mashErr && G.mode === "matchend" && G.winner === G.p1, mashErr || ("mode=" + G.mode + " r=" + (G.p1 && G.p1.rounds) + "-" + (G.p2 && G.p2.rounds) + " hp=" + (G.p1 && G.p1.hp) + "/" + (G.p2 && G.p2.hp)));

  return { ok: fails === 0, fails: fails, log: log.join("\n") };
}
