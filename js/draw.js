/* SI BRO FIGHTER — drawing, screens, boot. */
function lerp(a, b, t) { return a + (b - a) * t; }
function easeOutBack(t) {
  var c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
function rr(ctx, x, y, w, h, r) {
  var rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}
function font(px, weight) {
  ctx.font = (weight || 900) + " " + px + "px Impact, Haettenschweiler, 'Arial Black', sans-serif";
}
function textStroke(text, x, y, fill, stroke, lw) {
  ctx.lineWidth = lw == null ? 6 : lw;
  ctx.strokeStyle = stroke || "#120c08";
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
}
function wrapText(text, x, y, maxW, lh) {
  var words = text.split(" ");
  var line = "";
  var yy = y;
  for (var i = 0; i < words.length; i++) {
    var test = line ? line + " " + words[i] : words[i];
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, yy);
      line = words[i];
      yy += lh;
    } else line = test;
  }
  if (line) ctx.fillText(line, x, yy);
  return yy;
}

function poseOf(f) {
  var t = f.anim || 0;
  var p = {
    bob: Math.sin(t * 0.16) * 2.2,
    crouch: 0,
    torso: (ROSTER[f.id].lean || 0),
    lAng: 0.22, lBend: 0.38,
    rAng: -0.18, rBend: 0.32,
    fU: 0.15, fB: 1.05,
    bU: 2.35, bB: -0.45,
    expr: "idle",
    headX: 4,
    punch: 0
  };
  if (f.id === "elon") { p.torso = 0.18; p.lAng = 0.28; p.rAng = -0.05; p.fU = 0.05; p.fB = 1.2; }
  if (f.id === "sam") { p.fU = 0.45; p.fB = 0.75; p.bU = 2.05; p.torso = 0.02; }
  if (f.id === "dario") { p.fU = -0.35; p.fB = 1.2; p.torso = -0.06; p.expr = "focus"; }
  if (f.id === "jensen") { p.crouch = 0.14; p.lAng = 0.5; p.rAng = -0.42; p.fU = 0.25; p.fB = 0.95; }
  if (f.id === "trump") { p.lAng = 0.55; p.rAng = -0.5; p.fU = 0.55; p.fB = 0.65; p.expr = "smile"; }

  var st = f.state;
  if (st === "walk") {
    var s = Math.sin(t * 0.55);
    p.lAng = 0.15 + s * 0.55;
    p.rAng = -0.12 - s * 0.55;
    p.lBend = 0.45 + Math.max(0, s) * 0.25;
    p.rBend = 0.4 + Math.max(0, -s) * 0.25;
    p.bob = -Math.abs(s) * 3;
    p.fU += s * 0.25;
    p.bU -= s * 0.2;
  }
  var crouching = st === "crouch" || (f.hold && f.hold.down && f.onGround && (st === "idle" || st === "walk" || st === "block" || st === "attack"));
  if (crouching && st !== "launch" && st !== "down" && st !== "ko") {
    p.crouch = Math.max(p.crouch, st === "attack" ? 0.55 : 1);
    p.lAng = 0.85; p.rAng = -0.55; p.lBend = 1.15; p.rBend = 1.05;
    p.torso += 0.18;
  }
  if (st === "jump") {
    var rise = (f.vy || -1) < 0;
    p.lBend = rise ? 1.2 : 0.35;
    p.rBend = rise ? 1.1 : 0.3;
    p.lAng = rise ? 0.5 : 0.12;
    p.rAng = rise ? -0.4 : 0.02;
    p.fU = rise ? -2.35 : -1.05;
    p.bU = rise ? -2.15 : 1.7;
    p.fB = 0.7;
    p.bob = 0;
  }
  if (st === "hit" || st === "thrown") {
    p.torso = 0.62; p.expr = "hit"; p.headX = 10; p.fU = 0.55; p.bU = 1.15; p.bob = 0;
    p.lAng = 0.4; p.rAng = -0.2;
  }
  if (st === "block") {
    p.torso = -0.42; p.expr = "block"; p.fU = -1.75; p.bU = -2.0; p.fB = 0.85; p.bB = 0.55; p.bob = 0;
    if (f.hold && f.hold.down) p.crouch = 1;
  }
  if (st === "launch" || st === "cine") {
    p.torso = 1.0; p.expr = "hit"; p.fU = -2.3; p.bU = -2.05; p.lAng = 0.8; p.rAng = -1.0;
    p.lBend = 0.4; p.rBend = 0.2; p.bob = 0;
  }
  if (st === "down" || st === "ko" || st === "lose") {
    p.crouch = 1; p.torso = 1.25; p.expr = "ko";
    p.lAng = 1.4; p.rAng = 1.2; p.lBend = 0.15; p.rBend = 0.1;
    p.fU = 1.0; p.bU = 1.15; p.bob = 0; p.headX = 8;
  }
  if (st === "getup") { p.crouch = 0.5; p.torso = 0.45; p.expr = "hit"; }
  if (st === "win") {
    p.fU = -2.6; p.bU = -2.5; p.fB = 0.15; p.bB = 0.1;
    p.expr = "smile"; p.torso = -0.1; p.bob = Math.sin(t * 0.22) * 3;
  }
  if (f.state === "attack" && f.attack) {
    var a = f.attack;
    var wind = Math.min(1, f.frame / Math.max(1, a.startup || 1));
    var snap = f.frame > (a.startup || 1) ? 1 : wind;
    if (a.anim === "punch" || a.anim === "counter" || a.anim === "wall") {
      p.fU = lerp(-1.05, -0.02, snap);
      p.fB = lerp(1.25, 0.02, snap);
      p.torso = lerp(p.torso, f.id === "elon" ? 0.34 : 0.24, snap);
      p.punch = snap;
    }
    if (a.anim === "kick") {
      var heavy = f.moveId === "hk" || f.moveId === "airk" || f.moveId === "special2";
      p.rAng = lerp(p.rAng, heavy ? -1.45 : -1.12, snap);
      p.rBend = lerp(0.3, 0.04, snap);
      p.torso = lerp(p.torso, heavy ? -0.38 : -0.18, snap);
      p.lAng = lerp(p.lAng, 0.4, snap);
      p.fU = -1.9; p.bU = 0.4;
    }
    if (f.moveId === "special2" && f.id === "elon") {
      p.torso = -0.7; p.crouch = 0.22; p.fU = -1.85; p.bU = -1.7; p.punch = 0.2;
      p.lAng = 0.7; p.rAng = -0.2;
    }
    if (a.anim === "super" || f.moveId === "super") {
      var u = Math.min(1, f.frame / 12);
      if (f.id === "elon") {
        p.fU = lerp(0.8, -2.7, u);
        p.torso = lerp(0.4, -0.85, u);
        p.expr = "yell";
        p.crouch = u < 0.45 ? 0.35 : 0;
      } else if (f.id === "jensen") {
        p.fU = -2.4; p.bU = -2.3; p.expr = "yell"; p.torso = -0.2;
      } else if (f.id === "trump") {
        p.torso = u > 0.55 ? -0.55 : 0.1;
        p.fU = -0.2; p.punch = u > 0.55 ? 1 : 0;
        p.expr = "yell";
      } else {
        p.fU = -2.2; p.bU = -1.4; p.expr = "yell"; p.torso = -0.15;
      }
    }
    if (a.anim === "grab") { p.fU = -0.35; p.fB = 0.85; p.torso = 0.22; p.expr = "yell"; p.punch = 0.6; }
    if (f.moveId === "counter") { p.fU = -1.85; p.bU = -2.05; p.torso = -0.25; p.expr = "focus"; p.punch = 0; }
  }
  if ((t % 200) > 193 && (p.expr === "idle" || p.expr === "smile" || p.expr === "focus")) p.expr = "blink";
  return p;
}

function bone(x1, y1, x2, y2, w, fill) {
  var ang = Math.atan2(y2 - y1, x2 - x1);
  var len = Math.hypot(x2 - x1, y2 - y1);
  ctx.save();
  ctx.translate(x1, y1);
  ctx.rotate(ang);
  ctx.fillStyle = fill;
  ctx.strokeStyle = "#140c08";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, w / 2, Math.PI / 2, -Math.PI / 2);
  ctx.arc(Math.max(0.1, len), 0, w * 0.46, -Math.PI / 2, Math.PI / 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
function downPt(ang, len) { return [Math.sin(ang) * len, Math.cos(ang) * len]; }
function fwdPt(ang, len) { return [Math.cos(ang) * len, Math.sin(ang) * len]; }

function drawLeg(hx, hy, ang, bend, pal, w, short) {
  var thigh = short ? 22 : 34, shin = short ? 20 : 32;
  var k = downPt(ang, thigh);
  var footAng = ang + bend;
  var s = downPt(footAng, shin);
  var kx = hx + k[0], ky = hy + k[1];
  var fx = kx + s[0], fy = ky + s[1];
  bone(hx, hy, kx, ky, w, pal.pants);
  bone(kx, ky, fx, fy, w * 0.82, pal.pants);
  ctx.fillStyle = pal.shoe;
  ctx.strokeStyle = "#140c08";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(fx + 7, fy + 1, 13, 6, ang * 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}
function drawArm(sx, sy, uAng, bend, upper, lower, fist, w) {
  var ua = fwdPt(uAng, 30);
  var ex = sx + ua[0], ey = sy + ua[1];
  var fa = fwdPt(uAng + bend, 28);
  var fx = ex + fa[0], fy = ey + fa[1];
  bone(sx, sy, ex, ey, w, upper);
  bone(ex, ey, fx, fy, w * 0.82, lower);
  ctx.fillStyle = fist;
  ctx.strokeStyle = "#140c08";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(fx + Math.cos(uAng + bend) * 4, fy + Math.sin(uAng + bend) * 4, w * 0.62, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  return [fx, fy];
}

function drawHead(id, pal, pose, x, y) {
  ctx.save();
  ctx.translate(x, y);
  var R = id === "trump" ? 30 : id === "jensen" ? 27 : 26;
  if (id === "sam") {
    var og = ctx.createRadialGradient(-8, 8, 4, -18, 10, 70);
    og.addColorStop(0, "rgba(120,255,220,0.9)");
    og.addColorStop(1, "rgba(80,220,190,0)");
    ctx.fillStyle = og;
    ctx.beginPath();
    ctx.arc(-6, 18, 58, 0, Math.PI * 2);
    ctx.fill();
  }
  if (id === "sam") {
    ctx.fillStyle = pal.cloth;
    ctx.strokeStyle = "#140c08";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(-4, 8, 30, 28, -0.2, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
  }
  ctx.fillStyle = pal.skin;
  ctx.strokeStyle = "#140c08";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.ellipse(2, 0, R, R + 2, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = pal.skin2;
  ctx.beginPath();
  ctx.ellipse(-8, 6, R * 0.55, R * 0.72, 0.2, 0, Math.PI * 2);
  ctx.fill();

  if (id === "elon") {
    ctx.fillStyle = pal.hair;
    ctx.beginPath();
    ctx.moveTo(-16, -6);
    ctx.lineTo(-12, -30); ctx.lineTo(-2, -10); ctx.lineTo(4, -34);
    ctx.lineTo(12, -8); ctx.lineTo(16, -28); ctx.lineTo(18, -4);
    ctx.quadraticCurveTo(0, -16, -16, -6);
    ctx.fill(); ctx.stroke();
  } else if (id === "sam") {
    ctx.fillStyle = pal.hair;
    ctx.beginPath();
    ctx.ellipse(-18, 4, 10, 18, 0.3, 0, Math.PI * 2);
    ctx.ellipse(16, 6, 8, 14, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.ellipse(4, -14, 8, 5, 0.4, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === "dario") {
    ctx.fillStyle = pal.hair;
    ctx.beginPath();
    ctx.ellipse(0, -10, 24, 16, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(-22, -12, 44, 10);
  } else if (id === "jensen") {
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -6, 12, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.fillStyle = pal.skin2;
    ctx.fillRect(-16, -8, 34, 6);
  } else if (id === "trump") {
    ctx.fillStyle = pal.hair;
    ctx.beginPath();
    ctx.moveTo(-28, 4);
    ctx.quadraticCurveTo(-8, -42, 30, -16);
    ctx.quadraticCurveTo(36, -6, 18, -2);
    ctx.quadraticCurveTo(4, -22, -26, 2);
    ctx.fill();
    ctx.strokeStyle = "#140c08";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  var blink = pose.expr === "blink" || pose.expr === "ko";
  var hit = pose.expr === "hit" || pose.expr === "ko";
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#140c08";
  ctx.lineWidth = 2;
  if (!blink) {
    ctx.beginPath();
    ctx.ellipse(10, -2, 7, hit ? 3 : 6, 0, 0, Math.PI * 2);
    ctx.ellipse(-6, -2, 6.5, hit ? 3 : 5.5, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#1a120c";
    ctx.beginPath();
    ctx.arc(12, -1, id === "elon" ? 2.2 : 3, 0, Math.PI * 2);
    ctx.arc(-4, -1, id === "elon" ? 2.2 : 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillRect(13, -3, 2, 2);
  } else {
    ctx.strokeStyle = "#140c08";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(4, -2); ctx.lineTo(16, -2);
    ctx.moveTo(-12, -2); ctx.lineTo(0, -2);
    ctx.stroke();
  }
  ctx.strokeStyle = "#2a1a14";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  if (pose.expr === "yell" || pose.expr === "smile" || id === "trump") {
    ctx.arc(6, 10, 7, 0.1, Math.PI - 0.1);
  } else if (hit) {
    ctx.arc(6, 14, 6, Math.PI + 0.2, -0.2);
  } else if (id === "sam") {
    ctx.arc(6, 9, 6, 0.15, Math.PI - 0.4);
  } else {
    ctx.moveTo(0, 12); ctx.lineTo(14, 12);
  }
  ctx.stroke();
  if (id === "elon" || id === "dario" || pose.expr === "focus" || pose.expr === "block") {
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-12, -12); ctx.lineTo(-2, -14);
    ctx.moveTo(4, -15); ctx.lineTo(18, -11);
    ctx.stroke();
  }
  if (id === "dario") {
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 3;
    ctx.strokeRect(-2, -8, 16, 12);
    ctx.strokeRect(-18, -8, 14, 12);
    ctx.beginPath();
    ctx.moveTo(-4, -2); ctx.lineTo(-2, -2);
    ctx.moveTo(-20, -2); ctx.lineTo(-28, 0);
    ctx.moveTo(14, -2); ctx.lineTo(24, 0);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillRect(2, -6, 5, 3);
  }
  ctx.restore();
}

function drawFighter(f, ox, oy) {
  if (!f) return;
  var pal = ROSTER[f.id].pal;
  var pose = poseOf(f);
  var scx = (f.facing || 1) * (ROSTER[f.id].wide || 1);
  var scy = (ROSTER[f.id].tall || 1) * (f.squash || 1);
  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(scx, scy);
  if (f.flash > 0) ctx.filter = "brightness(1.7)";
  var hipY = -70 + pose.crouch * 30 + pose.bob;
  var armW = f.id === "jensen" ? 15 : f.id === "elon" ? 8.5 : f.id === "trump" ? 13 : 11;
  var legW = f.id === "jensen" ? 16 : f.id === "elon" ? 9 : f.id === "trump" ? 14 : 12;
  var shortLeg = pose.crouch > 0.55;
  drawLeg(-12, hipY, pose.lAng, pose.lBend, pal, legW, shortLeg);
  var shY = hipY - 50;
  drawArm(-16, shY, pose.bU, pose.bB, pal.cloth2, pal.skin2, pal.skin2, armW * 0.9);
  ctx.save();
  ctx.translate(0, hipY);
  ctx.rotate(pose.torso);
  var top = f.id === "trump" ? 58 : f.id === "jensen" ? 54 : f.id === "elon" ? 40 : 48;
  var bot = top - 14;
  var h = f.id === "jensen" ? 48 : 56;
  ctx.fillStyle = pal.cloth;
  ctx.strokeStyle = "#140c08";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-bot / 2, 0);
  ctx.lineTo(-top / 2, -h);
  ctx.quadraticCurveTo(0, -h - 10, top / 2, -h);
  ctx.lineTo(bot / 2, 0);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.moveTo(-bot / 2 + 4, -2);
  ctx.lineTo(-top / 2 + 6, -h + 6);
  ctx.lineTo(-4, -h + 8);
  ctx.lineTo(-2, -2);
  ctx.fill();
  if (f.id === "elon") {
    ctx.fillStyle = pal.accent;
    ctx.fillRect(-6, -h + 6, 8, h - 10);
    ctx.fillStyle = "#f2f2f2";
    ctx.fillRect(-4, -h + 8, 3, h - 16);
    ctx.strokeStyle = pal.metal;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-top / 2 + 2, -h + 8);
    ctx.lineTo(-2, -h + 18);
    ctx.lineTo(-top / 2 + 6, -h + 28);
    ctx.stroke();
  } else if (f.id === "sam") {
    ctx.fillStyle = pal.cloth2;
    ctx.fillRect(-16, -18, 32, 16);
    ctx.strokeStyle = pal.accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-8, -h + 4); ctx.lineTo(-8, -h + 22);
    ctx.moveTo(10, -h + 4); ctx.lineTo(10, -h + 22);
    ctx.stroke();
  } else if (f.id === "dario") {
    ctx.fillStyle = pal.tee || "#f4f1ea";
    ctx.beginPath();
    ctx.moveTo(-10, -h + 2); ctx.lineTo(10, -h + 2); ctx.lineTo(4, -18); ctx.lineTo(-4, -18);
    ctx.fill();
    ctx.fillStyle = pal.accent;
    ctx.fillRect(top / 2 - 16, -h + 14, 10, 8);
  } else if (f.id === "jensen") {
    ctx.strokeStyle = pal.accent;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-top / 2 + 2, -h + 4); ctx.lineTo(top / 2 - 2, -h + 4);
    ctx.moveTo(-top / 2 + 4, -h + 14); ctx.lineTo(-6, -h + 14);
    ctx.moveTo(6, -h + 14); ctx.lineTo(top / 2 - 4, -h + 14);
    ctx.stroke();
    ctx.fillStyle = pal.accent;
    for (var chip = 0; chip < 3; chip++) ctx.fillRect(-12 + chip * 9, -28, 6, 8);
  } else if (f.id === "trump") {
    ctx.fillStyle = pal.tee;
    ctx.beginPath();
    ctx.moveTo(-12, -h); ctx.lineTo(12, -h); ctx.lineTo(6, -16); ctx.lineTo(-6, -16);
    ctx.fill();
    ctx.strokeStyle = "#140c08";
    ctx.stroke();
    var tieLen = 54 + (pose.punch || 0) * 46;
    ctx.fillStyle = pal.accent;
    ctx.beginPath();
    ctx.moveTo(-6, -h + 8);
    ctx.lineTo(6, -h + 8);
    ctx.lineTo(3 + pose.punch * 10, -h + 8 + tieLen);
    ctx.lineTo(-3, -h + 8 + tieLen);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = pal.metal;
    ctx.beginPath();
    ctx.arc(top / 2 - 12, -h + 16, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  drawHead(f.id, pal, pose, pose.headX + 2, -h - 24);
  var fist = drawArm(top * 0.28, -h + 8, pose.fU, pose.fB, f.id === "sam" ? pal.cloth : pal.cloth, pal.skin, pal.skin, armW);
  if (f.id === "elon" && f.moveId === "super") {
    ctx.save();
    ctx.translate(fist[0], fist[1]);
    ctx.rotate(-0.8);
    ctx.fillStyle = "#d0d6df";
    ctx.strokeStyle = "#140c08";
    ctx.lineWidth = 3;
    rr(ctx, -8, -10, 46, 20, 6);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = pal.fx;
    ctx.beginPath();
    ctx.moveTo(38, -10); ctx.lineTo(58, 0); ctx.lineTo(38, 10);
    ctx.fill();
    ctx.restore();
  }
  if (f.id === "elon" && f.moveId === "special2") {
    ctx.fillStyle = pal.metal;
    ctx.beginPath();
    ctx.moveTo(20, -20); ctx.lineTo(78, -8); ctx.lineTo(78, 16); ctx.lineTo(16, 8);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#20242c";
    ctx.fillRect(48, -2, 18, 8);
  }
  ctx.restore();
  drawLeg(14, hipY, pose.rAng, pose.rBend, pal, legW, shortLeg);
  ctx.restore();
}

function dummyFighter(id, facing, state) {
  return {
    id: id, facing: facing || 1, state: state || "idle", frame: 8, anim: (G && G.t) || 0,
    moveId: null, attack: null, hold: { down: false }, onGround: true, vy: 0,
    flash: 0, squash: 1, thrownKind: null
  };
}

function drawStage(id) {
  var cam = G.cam.x;
  var sky = ctx.createLinearGradient(0, -200, 0, FLOOR);
  if (id === "starship") {
    sky.addColorStop(0, "#050814"); sky.addColorStop(0.55, "#123055"); sky.addColorStop(1, "#1c4d6a");
  } else if (id === "orb") {
    sky.addColorStop(0, "#f4f7fb"); sky.addColorStop(1, "#d5dbe6");
  } else if (id === "library") {
    sky.addColorStop(0, "#3a2418"); sky.addColorStop(1, "#6a4630");
  } else if (id === "gtc") {
    sky.addColorStop(0, "#050605"); sky.addColorStop(0.7, "#0c120c"); sky.addColorStop(1, "#101810");
  } else if (id === "tower") {
    sky.addColorStop(0, "#87b7e8"); sky.addColorStop(1, "#d7ecff");
  } else {
    sky.addColorStop(0, "#1a1030"); sky.addColorStop(1, "#3a2a58");
  }
  ctx.fillStyle = sky;
  ctx.fillRect(cam - 1100, -520, 2200, FLOOR + 560);

  var i;
  if (id === "starship") {
    for (i = 0; i < 40; i++) {
      var sx = ((i * 173) % 1800) + cam * 0.15 - 200;
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.fillRect(sx, 40 + (i * 47) % 280, (i % 3) + 1, (i % 3) + 1);
    }
    ctx.fillStyle = "#0c3c56";
    ctx.fillRect(cam * 0.25 - 200, FLOOR - 90, 2200, 120);
    ctx.fillStyle = "#12324a";
    var tx = 380 + cam * 0.15;
    ctx.fillRect(tx, FLOOR - 340, 36, 340);
    ctx.fillRect(tx + 70, FLOOR - 420, 28, 420);
    ctx.fillRect(tx - 40, FLOOR - 180, 160, 18);
    ctx.fillStyle = "#e8eef2";
    ctx.fillRect(tx + 74, FLOOR - 470, 18, 52);
    ctx.fillStyle = "rgba(180,220,230,0.25)";
    ctx.beginPath();
    ctx.moveTo(tx + 20, FLOOR - 20);
    ctx.lineTo(tx + 80, FLOOR - 160);
    ctx.lineTo(tx + 140, FLOOR - 10);
    ctx.fill();
  } else if (id === "orb") {
    ctx.strokeStyle = "rgba(190,200,214,0.8)";
    ctx.lineWidth = 2;
    for (i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(cam * 0.2 - 100, 80 + i * 70);
      ctx.lineTo(cam * 0.2 + 1700, 80 + i * 70);
      ctx.stroke();
    }
    var orb = ctx.createRadialGradient(cam, FLOOR - 280, 20, cam, FLOOR - 280, 180);
    orb.addColorStop(0, "#ffffff");
    orb.addColorStop(0.4, "#b8fff0");
    orb.addColorStop(1, "rgba(180,255,240,0)");
    ctx.fillStyle = orb;
    ctx.beginPath();
    ctx.arc(cam, FLOOR - 280, 180, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f7fbff";
    ctx.beginPath();
    ctx.arc(cam, FLOOR - 280, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#9fd";
    ctx.lineWidth = 4;
    ctx.stroke();
  } else if (id === "library") {
    for (i = 0; i < 7; i++) {
      var bx = 180 + i * 200 + cam * 0.2;
      ctx.fillStyle = "#4a2e22";
      ctx.fillRect(bx, FLOOR - 360, 150, 360);
      for (var row = 0; row < 8; row++) {
        for (var col = 0; col < 6; col++) {
          ctx.fillStyle = ["#f0c14a", "#e07a3d", "#6a8caf", "#d8d0c4", "#8c3a32", "#2f4a3c"][(row + col + i) % 6];
          ctx.fillRect(bx + 8 + col * 22, FLOOR - 340 + row * 40, 16, 30);
        }
      }
    }
    ctx.fillStyle = "rgba(255,220,160,0.15)";
    ctx.beginPath();
    ctx.arc(cam - 200, FLOOR - 300, 80, 0, Math.PI * 2);
    ctx.arc(cam + 220, FLOOR - 260, 60, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === "gtc") {
    var wallX = cam * 0.2 + 200;
    ctx.fillStyle = "#070a07";
    ctx.fillRect(wallX, FLOOR - 460, 980, 460);
    for (i = 0; i < 14; i++) {
      for (var j = 0; j < 8; j++) {
        ctx.fillStyle = (i + j) % 2 === 0 ? "#16330a" : "#0e2208";
        ctx.fillRect(wallX + 20 + i * 66, FLOOR - 430 + j * 48, 58, 40);
        ctx.fillStyle = "rgba(118,185,0,0.85)";
        ctx.fillRect(wallX + 28 + i * 66, FLOOR - 422 + j * 48, 18, 6);
      }
    }
    ctx.fillStyle = "rgba(118,185,0,0.08)";
    ctx.beginPath();
    ctx.moveTo(cam - 200, -100);
    ctx.lineTo(cam - 40, FLOOR);
    ctx.lineTo(cam + 80, FLOOR);
    ctx.lineTo(cam - 80, -100);
    ctx.fill();
  } else if (id === "tower") {
    var gx = cam * 0.25;
    ctx.fillStyle = "#e6c34a";
    ctx.fillRect(gx + 80, FLOOR - 460, 520, 460);
    ctx.fillStyle = "#f0d56a";
    ctx.fillRect(gx + 80, FLOOR - 480, 520, 24);
    for (i = 0; i < 8; i++) for (var k = 0; k < 6; k++) {
      ctx.fillStyle = (i + k) % 2 ? "#8fd0ff" : "#dff4ff";
      ctx.fillRect(gx + 110 + i * 58, FLOOR - 430 + k * 64, 36, 44);
    }
    ctx.fillStyle = "#c41230";
    ctx.fillRect(gx + 640, FLOOR - 360, 8, 200);
    ctx.fillRect(gx + 648, FLOOR - 360, 54, 32);
    ctx.fillStyle = "#1c2c55";
    ctx.fillRect(gx + 648, FLOOR - 328, 54, 18);
  } else {
    ctx.fillStyle = "#12081f";
    ctx.fillRect(cam * 0.3, FLOOR - 300, 900, 300);
    ctx.fillStyle = "#f2efe6";
    font(42);
    ctx.fillStyle = "#f7f4ea";
    ctx.fillText("COMPUTE SUMMIT", cam * 0.3 + 450, FLOOR - 240);
    var marks = ["#ffb020", "#5ddec4", "#e38a45", "#76b900", "#ffd24a"];
    for (i = 0; i < 5; i++) {
      ctx.fillStyle = marks[i];
      ctx.beginPath();
      ctx.arc(cam * 0.3 + 160 + i * 140, FLOOR - 160, 22, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  var floorCol = id === "orb" ? "#c5ced8" : id === "library" ? "#5a3a28" : id === "gtc" ? "#2a2a2a" : id === "tower" ? "#d9d3c4" : id === "summit" ? "#241838" : "#1a3344";
  ctx.fillStyle = floorCol;
  ctx.fillRect(STAGE_L - 220, FLOOR, STAGE_R - STAGE_L + 440, 260);
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  for (i = 0; i < 18; i++) ctx.fillRect(STAGE_L + i * 90, FLOOR, 2, 70);
  ctx.strokeStyle = id === "gtc" ? "#76b900" : id === "orb" ? "#9fd" : "rgba(255,255,255,0.28)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(STAGE_L - 120, FLOOR);
  ctx.lineTo(STAGE_R + 120, FLOOR);
  ctx.stroke();
}

function drawCrowdScreen() {
  ctx.save();
  for (var i = 0; i < 18; i++) {
    var x = i * 76 - (G.t % 76);
    var h = 46 + (i % 3) * 8;
    var wave = Math.sin(G.t * 0.08 + i) * 4;
    ctx.fillStyle = "rgba(8,10,16,0.82)";
    ctx.beginPath();
    ctx.ellipse(x + 30, 690 - h + wave, 16, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    rr(ctx, x + 12, 688 - h + 12 + wave, 36, h, 8);
    ctx.fill();
  }
  ctx.restore();
}

function drawProjectile(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  if (p.kind === "beam") {
    var g = ctx.createLinearGradient(-p.w / 2, 0, p.w / 2, 0);
    g.addColorStop(0, "rgba(255,176,32,0)");
    g.addColorStop(0.3, "#fff6d8");
    g.addColorStop(1, "#ffb020");
    ctx.fillStyle = g;
    rr(ctx, -p.w / 2, -8, p.w, 16, 8);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillRect(-10, -12, 28, 24);
    ctx.fillStyle = "#222";
    ctx.fillRect(-6, -8, 18, 2);
    ctx.fillRect(-6, -3, 14, 2);
    ctx.fillRect(-6, 2, 16, 2);
  } else if (p.kind === "text" || p.kind === "text2") {
    ctx.fillStyle = "rgba(245,250,248,0.92)";
    ctx.strokeStyle = "#123";
    ctx.lineWidth = 3;
    rr(ctx, -p.w / 2, -p.h / 2, p.w, p.h, 4);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#1fbf8f";
    for (var i = 0; i < 4; i++) ctx.fillRect(-p.w / 2 + 6, -p.h / 2 + 6 + i * 8, Math.max(8, p.w - 16 - (i % 2) * 10), 3);
  } else if (p.kind === "gold") {
    ctx.fillStyle = "#ffd56a";
    rr(ctx, -p.w / 2, -p.h / 2, p.w, p.h, 8);
    ctx.fill();
    ctx.fillStyle = "#fff6d0";
    ctx.fillRect(-p.w / 4, -3, p.w / 2, 6);
  } else if (p.kind === "ray") {
    if (p.delay > 0) ctx.globalAlpha = 0.4;
    ctx.fillStyle = "rgba(180,255,80,0.35)";
    ctx.fillRect(-p.w / 2, -10, p.w, 20);
    ctx.fillStyle = "#eaffb0";
    ctx.fillRect(-p.w / 2, -2, p.w, 4);
  }
  ctx.restore();
}

function drawWall(w) {
  ctx.save();
  ctx.fillStyle = "#b7b1a4";
  ctx.strokeStyle = "#2a261f";
  ctx.lineWidth = 4;
  ctx.fillRect(w.x, w.y, w.w, w.h);
  ctx.strokeRect(w.x, w.y, w.w, w.h);
  ctx.strokeStyle = "#8d877c";
  ctx.beginPath();
  ctx.moveTo(w.x + 6, w.y + 20); ctx.lineTo(w.x + w.w - 4, w.y + 40);
  ctx.moveTo(w.x + 4, w.y + 90); ctx.lineTo(w.x + 20, w.y + 120);
  ctx.stroke();
  font(14);
  ctx.fillStyle = "#2a261f";
  ctx.textAlign = "center";
  ctx.fillText("WALL", w.x + w.w / 2, w.y + 24);
  ctx.restore();
}

function drawFX() {
  var i, fx, c;
  for (i = 0; i < G.fx.length; i++) {
    fx = G.fx[i];
    if (fx.kind === "book") {
      ctx.fillStyle = "#f4efe0";
      ctx.strokeStyle = "#2a2118";
      ctx.lineWidth = 4;
      rr(ctx, fx.x - 70, FLOOR - 150, 140, 100, 6);
      ctx.fill(); ctx.stroke();
      font(16);
      ctx.fillStyle = "#243156";
      ctx.textAlign = "center";
      ctx.fillText("CONSTITUTION", fx.x, FLOOR - 100);
    } else if (fx.kind === "elev") {
      ctx.fillStyle = "#e6c34a";
      ctx.strokeStyle = "#2a2208";
      ctx.lineWidth = 4;
      rr(ctx, fx.x - 28, FLOOR - 90, 56, 78, 4);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#fff3c4";
      ctx.fillRect(fx.x - 16, FLOOR - 78, 32, 40);
    }
  }
  c = G.cine;
  if (!c) return;
  if (c.kind === "cage" && c.who) {
    ctx.strokeStyle = "#7dffe0";
    ctx.lineWidth = 6;
    ctx.strokeRect(c.x - 46, FLOOR - 188, 92, 188);
    ctx.strokeStyle = "rgba(125,255,224,0.5)";
    ctx.strokeRect(c.x - 36, FLOOR - 176, 72, 170);
  } else if (c.kind === "essay" && c.who) {
    var grow = Math.min(1, c.t / 20);
    ctx.save();
    ctx.translate(c.who.x, c.who.y - 110);
    ctx.scale(0.4 + grow, 0.4 + grow);
    ctx.fillStyle = "rgba(247,242,226,0.92)";
    ctx.strokeStyle = "#2a2418";
    ctx.lineWidth = 3;
    rr(ctx, -70, -90, 140, 110, 4);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#445";
    for (i = 0; i < 5; i++) ctx.fillRect(-56, -70 + i * 14, 100 - (i % 2) * 20, 4);
    if (c.stamp) {
      ctx.strokeStyle = "#b42318";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(10, -20, 36, 0, Math.PI * 2);
      ctx.stroke();
      font(22);
      ctx.fillStyle = "#b42318";
      ctx.textAlign = "center";
      ctx.fillText("PBC", 10, -12);
    }
    ctx.restore();
  } else if (c.kind === "gpu") {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.fillStyle = "#101410";
    ctx.strokeStyle = "#76b900";
    ctx.lineWidth = 6;
    ctx.fillRect(-70, -160, 140, 200);
    ctx.strokeRect(-70, -160, 140, 200);
    for (i = 0; i < 5; i++) {
      ctx.fillStyle = i % 2 ? "#76b900" : "#dfffb0";
      ctx.fillRect(-50, -140 + i * 28, 100, 12);
    }
    font(18);
    ctx.fillStyle = "#d8ff9a";
    ctx.textAlign = "center";
    ctx.fillText("GPU", 0, -168);
    ctx.restore();
  }
}

function drawParts() {
  for (var i = 0; i < G.parts.length; i++) {
    var p = G.parts[i];
    ctx.globalAlpha = Math.max(0, p.life / (p.max || 30));
    ctx.fillStyle = p.color || "#fff";
    if (p.kind === "star") {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.life);
      ctx.fillRect(-p.size, -1.5, p.size * 2, 3);
      ctx.fillRect(-1.5, -p.size, 3, p.size * 2);
      ctx.restore();
    } else if (p.kind === "token") {
      font(12);
      ctx.textAlign = "center";
      ctx.fillText(p.ch || "T", p.x, p.y);
    } else if (p.kind === "page" || p.kind === "shard" || p.kind === "confetti") {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.life * 0.2);
      ctx.fillRect(-p.size, -p.size * 0.6, p.size * 2, p.size * 1.2);
      ctx.restore();
    } else if (p.kind === "coin") {
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size, p.size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (p.kind === "dust" ? 1.4 : 0.7), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

function worldToScreen(x, y) {
  var z = G.cam.z || 1;
  return {
    x: VIEW_W / 2 + (x - G.cam.x) * z,
    y: 650 + (y - FLOOR) * z
  };
}

function drawWorld() {
  var shx = G.shake ? (Math.random() - 0.5) * G.shake * 2 : 0;
  var shy = G.shake ? (Math.random() - 0.5) * G.shake * 2 : 0;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, VIEW_W, VIEW_H);
  ctx.clip();
  ctx.translate(VIEW_W / 2 + shx, 650 + shy);
  ctx.scale(G.cam.z || 1, G.cam.z || 1);
  ctx.translate(-G.cam.x, -FLOOR);
  drawStage(G.stage || "gtc");
  var i;
  for (i = 0; i < G.ghosts.length; i++) {
    ctx.globalAlpha = Math.max(0.12, G.ghosts[i].life / 18);
    var g = G.ghosts[i].f;
    drawFighter(g, g.x, g.y);
    ctx.globalAlpha = 1;
  }
  if (G.p1 && G.p2) {
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(G.p1.x, FLOOR + 2, 40, 10, 0, 0, Math.PI * 2);
    ctx.ellipse(G.p2.x, FLOOR + 2, 40, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  for (i = 0; i < G.projs.length; i++) if (G.projs[i].kind !== "ray") drawProjectile(G.projs[i]);
  for (i = 0; i < G.walls.length; i++) drawWall(G.walls[i]);
  if (G.p2) drawFighter(G.p2, G.p2.x, G.p2.y);
  if (G.p1) drawFighter(G.p1, G.p1.x, G.p1.y);
  for (i = 0; i < G.projs.length; i++) if (G.projs[i].kind === "ray") drawProjectile(G.projs[i]);
  drawFX();
  drawParts();
  if (G.boxes && G.p1) {
    ctx.strokeStyle = "rgba(0,255,180,0.8)";
    var hb = hurtBox(G.p1);
    ctx.strokeRect(hb.x, hb.y, hb.w, hb.h);
    hb = hurtBox(G.p2);
    ctx.strokeStyle = "rgba(255,80,80,0.8)";
    ctx.strokeRect(hb.x, hb.y, hb.w, hb.h);
    if (G.p1.attack && G.p1.attack.hb) {
      var b = worldBox(G.p1, G.p1.attack.hb);
      ctx.strokeStyle = "yellow";
      ctx.strokeRect(b.x, b.y, b.w, b.h);
    }
  }
  ctx.restore();
  drawCrowdScreen();
}

function bar(x, y, w, h, frac, back, col) {
  rr(ctx, x, y, w, h, 5);
  ctx.fillStyle = "#1a0c10";
  ctx.fill();
  ctx.fillStyle = back;
  ctx.save();
  ctx.beginPath();
  rr(ctx, x, y, w, h, 5);
  ctx.clip();
  ctx.fillRect(x, y, Math.max(0, w * frac), h);
  ctx.fillStyle = col;
  ctx.fillRect(x, y, Math.max(0, w * Math.min(1, frac)), h);
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.fillRect(x, y, Math.max(0, w * Math.min(1, frac)), 5);
  ctx.restore();
  ctx.strokeStyle = "#f4f7ff";
  ctx.lineWidth = 2;
  rr(ctx, x, y, w, h, 5);
  ctx.stroke();
}

function drawPortraitCard(id, x, y, w, h, facing) {
  var pal = ROSTER[id].pal;
  ctx.save();
  rr(ctx, x, y, w, h, 12);
  ctx.clip();
  var g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, pal.cloth);
  g.addColorStop(1, "#07080c");
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  ctx.translate(x + w * 0.5, y + h * 0.92);
  ctx.scale(1.15, 1.15);
  drawFighter(dummyFighter(id, facing, "idle"), 0, 0);
  ctx.restore();
  ctx.strokeStyle = pal.fx;
  ctx.lineWidth = 4;
  rr(ctx, x, y, w, h, 12);
  ctx.stroke();
}

function drawHUD() {
  if (G.hideHud) return;
  if (!G.p1 || !G.p2) return;
  var p1 = G.p1, p2 = G.p2;
  var r1 = ROSTER[p1.id], r2 = ROSTER[p2.id];
  ctx.save();
  rr(ctx, 16, 14, 64, 64, 8);
  ctx.save();
  rr(ctx, 16, 14, 64, 64, 8);
  ctx.clip();
  ctx.fillStyle = r1.pal.cloth;
  ctx.fillRect(16, 14, 64, 64);
  ctx.translate(48, 78);
  ctx.scale(0.42, 0.42);
  drawFighter(dummyFighter(p1.id, 1), 0, 0);
  ctx.restore();
  ctx.strokeStyle = r1.pal.fx;
  ctx.lineWidth = 3;
  rr(ctx, 16, 14, 64, 64, 8);
  ctx.stroke();

  ctx.save();
  ctx.translate(VIEW_W - 16, 0);
  ctx.scale(-1, 1);
  rr(ctx, 16, 14, 64, 64, 8);
  ctx.clip();
  ctx.fillStyle = r2.pal.cloth;
  ctx.fillRect(16, 14, 64, 64);
  ctx.translate(48, 78);
  ctx.scale(0.42, 0.42);
  drawFighter(dummyFighter(p2.id, 1), 0, 0);
  ctx.restore();
  ctx.strokeStyle = r2.pal.fx;
  ctx.lineWidth = 3;
  rr(ctx, VIEW_W - 80, 14, 64, 64, 8);
  ctx.stroke();

  font(22);
  ctx.textAlign = "left";
  ctx.fillStyle = "#fff";
  ctx.fillText(r1.name, 90, 28);
  font(13);
  ctx.fillStyle = "#d5d8e6";
  ctx.fillText(r1.epithet, 90, 86);
  font(22);
  ctx.textAlign = "right";
  ctx.fillStyle = "#fff";
  ctx.fillText(r2.name, VIEW_W - 90, 28);
  font(13);
  ctx.fillStyle = "#d5d8e6";
  ctx.fillText(r2.epithet, VIEW_W - 90, 86);

  var low = Math.sin(G.t * 0.3) > 0;
  bar(90, 36, 420, 22, p1.dispHp / p1.maxHp, "#ffd166", p1.hp < 280 && low ? "#ff4d4d" : "#ff3b3b");
  ctx.save();
  ctx.translate(VIEW_W - 90, 0);
  ctx.scale(-1, 1);
  bar(0, 36, 420, 22, p2.dispHp / p2.maxHp, "#ffd166", p2.hp < 280 && low ? "#ff4d4d" : "#ff3b3b");
  ctx.restore();

  ctx.fillStyle = "#2a2410";
  ctx.fillRect(90, 64, 420, 8);
  ctx.fillStyle = r1.pal.fx;
  ctx.fillRect(90, 64, 420 * Math.max(0, Math.min(1, p1.meter / 100)), 8);
  ctx.strokeStyle = "#f4f7ff";
  ctx.strokeRect(90, 64, 420, 8);
  ctx.fillStyle = "#2a2410";
  ctx.fillRect(VIEW_W - 510, 64, 420, 8);
  ctx.fillStyle = r2.pal.fx;
  ctx.fillRect(VIEW_W - 510, 64, 420 * Math.max(0, Math.min(1, p2.meter / 100)), 8);
  ctx.strokeRect(VIEW_W - 510, 64, 420, 8);

  for (var i = 0; i < 2; i++) {
    ctx.beginPath();
    ctx.arc(92 + i * 16, 100, 5, 0, Math.PI * 2);
    ctx.fillStyle = p1.rounds > i ? r1.pal.fx : "#333";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(VIEW_W - 92 - i * 16, 100, 5, 0, Math.PI * 2);
    ctx.fillStyle = p2.rounds > i ? r2.pal.fx : "#333";
    ctx.fill();
  }

  font(48);
  ctx.textAlign = "center";
  var timeCol = G.timer <= 10 ? "#ff5a5a" : "#fff";
  textStroke(String(G.timer == null ? 99 : G.timer), VIEW_W / 2, 58, timeCol, "#140c08", 6);
  font(14);
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.fillText(STAGE_NAME[G.stage] || "", VIEW_W / 2, 104);
  font(12);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  if (!G.trailer) ctx.fillText((G.diff || "founder").toUpperCase() + "  CPU", VIEW_W / 2, 120);

  if (G.combo && G.combo.who && G.combo.n >= 2) {
    var sp = worldToScreen(G.combo.who.x, G.combo.who.y - 200);
    font(40 + Math.min(16, G.combo.n * 2));
    textStroke(G.combo.n + " HIT", sp.x, sp.y, "#ffe566", "#1a1004", 6);
  }
  if (G.tutT > 0) {
    ctx.globalAlpha = G.tutT < 30 ? G.tutT / 30 : 0.92;
    rr(ctx, 280, 640, 720, 36, 8);
    ctx.fillStyle = "rgba(8,10,16,0.8)";
    ctx.fill();
    font(16);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("J PUNCH    K HEAVY    L KICK    HOLD BACK TO BLOCK", VIEW_W / 2, 664);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

function drawAnnouncer() {
  if (G.callout && !G.ann) {
    font(28);
    ctx.textAlign = "center";
    ctx.globalAlpha = G.callout.t > G.callout.life - 8 ? (G.callout.life - G.callout.t) / 8 : 1;
    textStroke(G.callout.text, VIEW_W / 2, 168, G.callout.color || "#fff", "#140c08", 5);
    ctx.globalAlpha = 1;
  }
  if (!G.ann) return;
  var u = Math.min(1, G.ann.t / 7);
  var s = 1.55 - 0.55 * Math.min(1, u);
  var fade = G.ann.t > G.ann.life - 10 ? (G.ann.life - G.ann.t) / 10 : 1;
  ctx.save();
  ctx.globalAlpha = Math.max(0, fade);
  ctx.translate(VIEW_W / 2, 250);
  ctx.scale(s, s);
  font(86);
  ctx.textAlign = "center";
  ctx.lineJoin = "round";
  textStroke(G.ann.text, 0, 0, G.ann.color || "#fff", "#140c08", 10);
  ctx.restore();
}

function superTint() {
  var on = G.freeze > 0 || (G.superZoom > 0.08);
  if (!on) return;
  ctx.fillStyle = G.superTint || "#fff";
  ctx.globalAlpha = G.freeze > 0 ? 0.28 : 0.14 * (G.superZoom || 0);
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  ctx.globalAlpha = 1;
}

function chromeText(text, x, y, size) {
  ctx.save();
  ctx.textAlign = "center";
  font(size);
  ctx.lineJoin = "round";
  ctx.lineWidth = 10;
  ctx.strokeStyle = "#041018";
  ctx.strokeText(text, x, y);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(255,70,180,0.85)";
  ctx.strokeText(text, x - 2, y);
  ctx.strokeStyle = "rgba(80,220,255,0.9)";
  ctx.strokeText(text, x + 2, y);
  var g = ctx.createLinearGradient(0, y - size * 0.7, 0, y + size * 0.2);
  g.addColorStop(0, "#ffffff");
  g.addColorStop(0.35, "#d7f4ff");
  g.addColorStop(0.55, "#7fd0ff");
  g.addColorStop(0.8, "#f4fbff");
  g.addColorStop(1, "#9eb4ff");
  ctx.fillStyle = g;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function menuButton(b, on) {
  ctx.save();
  rr(ctx, b.x, b.y, b.w, b.h, 8);
  if (on) {
    var g = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.h);
    g.addColorStop(0, "#fff");
    g.addColorStop(1, "#8fd8ff");
    ctx.fillStyle = g;
    ctx.fill();
    ctx.fillStyle = "#10141c";
  } else {
    ctx.fillStyle = "rgba(8,12,20,0.72)";
    ctx.fill();
    ctx.strokeStyle = "#9fd7ff";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#e9f6ff";
  }
  font(28);
  ctx.textAlign = "center";
  ctx.fillText(b.label, b.x + b.w / 2, b.y + 36);
  ctx.restore();
}

function renderTitle() {
  var g = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  g.addColorStop(0, "#070814");
  g.addColorStop(0.5, "#10182e");
  g.addColorStop(1, "#1a0e18");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  for (var i = 0; i < 30; i++) {
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillRect((i * 97 + G.t) % VIEW_W, (i * 53) % 220, 2, 2);
  }
  ctx.fillStyle = "#12151f";
  ctx.fillRect(0, 560, VIEW_W, 160);
  ctx.fillStyle = "#080a10";
  ctx.fillRect(0, 548, VIEW_W, 14);
  for (i = 0; i < CAST.length; i++) {
    ctx.save();
    ctx.translate(140 + i * 250, 700);
    ctx.scale(0.85, 0.85);
    drawFighter(dummyFighter(CAST[i], i < 2 ? 1 : -1, "idle"), 0, 0);
    ctx.restore();
  }
  var bob = Math.sin(G.t * 0.06) * 4;
  chromeText("SI BRO FIGHTER", VIEW_W / 2, 150 + bob, 92);
  font(22);
  ctx.textAlign = "center";
  ctx.fillStyle = "#9ae7ff";
  var sub = "THE COMPUTE WARS";
  var shown = "";
  for (i = 0; i < sub.length; i++) shown += sub[i] + " ";
  ctx.fillText(shown, VIEW_W / 2, 196);
  var buttons = titleButtons();
  for (i = 0; i < buttons.length; i++) menuButton(buttons[i], i === G.menu);
  var pills = titleDiffPills();
  for (i = 0; i < pills.length; i++) {
    var on = pills[i].id === G.diff;
    ctx.fillStyle = on ? "#ffb703" : "rgba(255,255,255,0.08)";
    rr(ctx, pills[i].x, pills[i].y, pills[i].w, pills[i].h, 8);
    ctx.fill();
    ctx.strokeStyle = on ? "#fff" : "#667";
    ctx.stroke();
    font(16);
    ctx.fillStyle = on ? "#1a1204" : "#d7dbe8";
    ctx.textAlign = "center";
    ctx.fillText(pills[i].id.toUpperCase(), pills[i].x + pills[i].w / 2, pills[i].y + 26);
  }
  font(14);
  ctx.fillStyle = "#9fd0ea";
  ctx.fillText("LEFT / RIGHT  DIFFICULTY      ENTER CONFIRM      M MUTE", VIEW_W / 2, 236);
  drawAnnouncer();
}

function renderControls() {
  ctx.fillStyle = "rgba(6,8,14,0.94)";
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  chromeText("CONTROLS", VIEW_W / 2, 78, 64);
  var lines = [
    "MOVE    A / D     or arrows          JUMP  W          CROUCH  S",
    "LIGHT PUNCH  J     HEAVY PUNCH  K     LIGHT KICK  L     HEAVY KICK  I or ;",
    "BLOCK   hold U, or hold back while they attack. Crouch blocks lows.",
    "THROW   walk in close and press K if they are not attacking.",
    "EASY SPECIALS    J+K  special 1     K+L  special 2     J+K+L  SUPER",
    "SUPER also fires if you press J+K with a full meter. Quarter-circles still work at full meter.",
    "MOTIONS are relative to the way you face. Down, down-forward, forward + punch is a quarter-circle.",
    "METER builds when you hit and when you get hit. One super stock.",
    "BEST OF 3. Timer 0 goes to higher health. Touch buttons sit under the screen on a phone.",
    "",
    "ELON   beam QCF+P    ram FF+P          SAM   text QCF+P    pivot back+K",
    "DARIO  counter DB+P while blocking     book QCB+P",
    "JENSEN cuda QCF+K     ray punch forward+P     TRUMP  wall DB+P    grab QCB+P",
    "",
    "1 / 2 / 3   INTERN / FOUNDER / AGI        Q / E on the select screen too.",
    "ENTER + SPACE mashed together on the title: a secret."
  ];
  font(18);
  ctx.textAlign = "left";
  ctx.fillStyle = "#e7eef8";
  for (var i = 0; i < lines.length; i++) ctx.fillText(lines[i], 70, 130 + i * 32);
  font(20);
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffb703";
  ctx.fillText("ENTER OR CLICK TO RETURN", VIEW_W / 2, 680);
}

function renderSelect() {
  ctx.fillStyle = "#0c1018";
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  font(36);
  ctx.textAlign = "left";
  textStroke(G.selPhase === 0 ? "SELECT YOUR FIGHTER" : "SELECT CPU OPPONENT", 24, 48, "#fff", "#140c08", 5);
  var pills = selectDiffPills();
  for (var i = 0; i < pills.length; i++) {
    var on = pills[i].id === G.diff;
    ctx.fillStyle = on ? "#ffb703" : "rgba(255,255,255,0.06)";
    rr(ctx, pills[i].x, pills[i].y, pills[i].w, pills[i].h, 6);
    ctx.fill();
    font(14);
    ctx.fillStyle = on ? "#1a1204" : "#ccd";
    ctx.textAlign = "center";
    ctx.fillText(pills[i].id.toUpperCase(), pills[i].x + pills[i].w / 2, pills[i].y + 24);
  }
  for (i = 0; i < CAST.length; i++) {
    var r = cardRect(i);
    var sel = i === G.menu;
    var mine = G.selPhase === 1 && i === G.p1i;
    ctx.save();
    if (sel) { ctx.translate(r.x + r.w / 2, r.y + r.h / 2); ctx.scale(1.04, 1.04); ctx.translate(-(r.x + r.w / 2), -(r.y + r.h / 2)); }
    drawPortraitCard(CAST[i], r.x, r.y, r.w, r.h, 1);
    if (sel) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 4;
      rr(ctx, r.x - 3, r.y - 3, r.w + 6, r.h + 6, 14);
      ctx.stroke();
    }
    font(18);
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.fillText(ROSTER[CAST[i]].name, r.x + r.w / 2, r.y + r.h - 14);
    if (mine) {
      font(14);
      ctx.fillStyle = "#9ae7ff";
      ctx.fillText("1P", r.x + 24, r.y + 22);
    }
    if (sel && G.selPhase === 1) {
      font(14);
      ctx.fillStyle = "#ffb703";
      ctx.fillText("CPU", r.x + r.w - 28, r.y + 22);
    }
    ctx.restore();
  }
  var id = CAST[G.menu];
  var R = ROSTER[id];
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(0, 424, VIEW_W, 296);
  font(42);
  ctx.textAlign = "left";
  ctx.fillStyle = R.pal.fx;
  ctx.fillText(R.name, 36, 478);
  font(22);
  ctx.fillStyle = "#fff";
  ctx.fillText(R.epithet, 36, 508);
  font(18);
  ctx.fillStyle = "#d5dbea";
  ctx.fillText(R.specials[0][0] + "  —  " + R.specials[0][1], 36, 548);
  ctx.fillText(R.specials[1][0] + "  —  " + R.specials[1][1], 36, 576);
  ctx.fillStyle = R.pal.fx;
  ctx.fillText("SUPER  " + R.super[0] + "  —  " + R.super[1], 36, 612);
  font(15);
  ctx.fillStyle = "#9ab";
  ctx.fillText("A / D MOVE     ENTER CONFIRM     1 2 3 OR Q / E DIFFICULTY     ESC BACK", 36, 660);
  ctx.textAlign = "right";
  ctx.fillStyle = "#fff";
  font(16);
  ctx.fillText(G.selPhase === 0 ? "PLAYER" : "CPU", VIEW_W - 36, 478);
}

function renderVS() {
  drawWorld();
  ctx.fillStyle = "rgba(4,6,12,0.45)";
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  var t = Math.min(1, G.vsT / 18);
  var e = easeOutBack(Math.max(0, Math.min(1, t)));
  var left = lerp(-420, 80, e);
  var right = lerp(VIEW_W + 80, VIEW_W - 500, e);
  drawPortraitCard(G.p1.id, left, 150, 420, 380, 1);
  drawPortraitCard(G.p2.id, right, 150, 420, 380, -1);
  if (G.vsT > 8) {
    chromeText("VS", VIEW_W / 2, 340, 120);
    font(26);
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    var taunt = ROSTER[G.p2.id].taunt;
    ctx.globalAlpha = Math.min(1, (G.vsT - 8) / 12);
    textStroke(taunt, VIEW_W / 2, 470, "#fff6d8", "#140c08", 5);
    ctx.globalAlpha = 1;
    font(18);
    ctx.fillStyle = "#9ae7ff";
    ctx.fillText(G.trailer ? STAGE_NAME[G.stage] : STAGE_NAME[G.stage] + "    LEFT / RIGHT TO CYCLE STAGE", VIEW_W / 2, 530);
    font(16);
    ctx.fillStyle = "#c9d4e4";
    ctx.fillText(ROSTER[G.p1.id].name + "   vs   CPU " + ROSTER[G.p2.id].name, VIEW_W / 2, 600);
  }
}

function renderFight() {
  if (!G.cam.z) G.cam.z = 1;
  if (!G.cam.x) G.cam.x = 900;
  drawWorld();
  superTint();
  if (G.flash) {
    ctx.fillStyle = "#fff";
    ctx.globalAlpha = Math.min(0.7, G.flash);
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.globalAlpha = 1;
  }
  var vg = ctx.createRadialGradient(640, 380, 220, 640, 400, 820);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.38)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  drawHUD();
  drawAnnouncer();
  if (G.mute && !G.trailer) {
    font(14);
    ctx.fillStyle = "#ffb703";
    ctx.textAlign = "left";
    ctx.fillText("MUTE", 16, VIEW_H - 16);
  }
}

function renderMatch() {
  ctx.fillStyle = "#07080e";
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  if (G.p1 && G.p2 && G.winner) {
    ctx.save();
    ctx.translate(280, 560);
    ctx.scale(1.35, 1.35);
    var winner = G.winner === G.p1 ? G.p1 : G.p2;
    var poseF = dummyFighter(winner.id, 1, "win");
    poseF.anim = G.t;
    drawFighter(poseF, 0, 0);
    ctx.restore();
  }
  var playerWon = G.winner === G.p1;
  chromeText(playerWon ? "YOU WIN" : "YOU LOSE", 860, 150, 78);
  var who = G.winner ? ROSTER[G.winner.id] : ROSTER[G.p1.id];
  font(28);
  ctx.textAlign = "center";
  ctx.fillStyle = who.pal.fx;
  ctx.fillText(who.name, 860, 210);
  font(20);
  ctx.fillStyle = "#dfe7f4";
  ctx.font = "italic 28px Georgia, 'Palatino Linotype', serif";
  wrapText("“" + who.win + "”", 860, 280, 520, 36);
  var buttons = winButtons();
  ctx.font = "900 28px Impact, Haettenschweiler, 'Arial Black', sans-serif";
  for (var i = 0; i < buttons.length; i++) menuButton(buttons[i], i === G.menu);
  font(15);
  ctx.fillStyle = "#9ab";
  ctx.textAlign = "center";
  ctx.fillText((G.p1.rounds || 0) + "  —  " + (G.p2.rounds || 0) + "     ENTER CONFIRMS", VIEW_W / 2, 680);
  drawAnnouncer();
}

function renderTest() {
  ctx.fillStyle = "#05060a";
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  font(42);
  ctx.textAlign = "left";
  ctx.fillStyle = G._test && G._test.ok ? "#9dff9a" : "#ff8080";
  ctx.fillText(G._test && G._test.ok ? "TESTS PASSED" : "TESTS FAILED", 40, 70);
  ctx.font = "16px ui-monospace, monospace";
  ctx.fillStyle = "#d7ffe0";
  var lines = (G._test && G._test.log ? G._test.log : "").split("\n");
  for (var i = 0; i < lines.length; i++) ctx.fillText(lines[i], 40, 110 + i * 20);
}

function render() {
  if (!ctx) return;
  var dpr = G.dpr || 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  var w = canvas.clientWidth || VIEW_W;
  var h = canvas.clientHeight || VIEW_H;
  var sc = Math.min(w / VIEW_W, h / VIEW_H);
  var ox = (w - VIEW_W * sc) / 2;
  var oy = (h - VIEW_H * sc) / 2;
  if (h > w) oy = 8;
  G.layout = { ox: ox, oy: oy, sc: sc };
  ctx.fillStyle = "#05060a";
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(sc, sc);
  ctx.beginPath();
  ctx.rect(0, 0, VIEW_W, VIEW_H);
  ctx.clip();
  try {
    if (G.mode === "title") renderTitle();
    else if (G.mode === "controls") renderControls();
    else if (G.mode === "select") renderSelect();
    else if (G.mode === "vs") renderVS();
    else if (G.mode === "fight") renderFight();
    else if (G.mode === "matchend") renderMatch();
    else if (G.mode === "testresult") renderTest();
    else renderTitle();
  } catch (err) {
    ctx.fillStyle = "#ff8080";
    ctx.font = "16px monospace";
    ctx.textAlign = "left";
    ctx.fillText(String(err && err.message || err), 20, 40);
    G._err = err && err.stack ? err.stack : String(err);
  }
  ctx.restore();
}

var canvas, ctx;
function landscapePhone() {
  return window.matchMedia("(orientation: landscape) and (max-height: 520px)").matches;
}
function fitViewport() {
  var vv = window.visualViewport;
  var root = document.documentElement.style;
  if (vv && landscapePhone()) {
    root.setProperty("--vvw", vv.width + "px");
    root.setProperty("--vvh", vv.height + "px");
    root.setProperty("--vv-top", vv.offsetTop + "px");
    root.setProperty("--vv-left", vv.offsetLeft + "px");
  } else {
    root.removeProperty("--vvw");
    root.removeProperty("--vvh");
    root.removeProperty("--vv-top");
    root.removeProperty("--vv-left");
  }
  resize();
}
function resize() {
  var dpr = Math.min(2, window.devicePixelRatio || 1);
  var w = canvas.clientWidth || window.innerWidth;
  var h = canvas.clientHeight || window.innerHeight;
  canvas.width = Math.max(1, Math.floor(w * dpr));
  canvas.height = Math.max(1, Math.floor(h * dpr));
  G.dpr = dpr;
}
function toGame(e) {
  var r = canvas.getBoundingClientRect();
  var x = ((e.clientX - r.left) / r.width) * (canvas.clientWidth || r.width);
  var y = ((e.clientY - r.top) / r.height) * (canvas.clientHeight || r.height);
  var L = G.layout || { ox: 0, oy: 0, sc: 1 };
  return { x: (x - L.ox) / L.sc, y: (y - L.oy) / L.sc };
}
function loop() {
  try { update(); render(); }
  catch (err) {
    console.error(err);
    if (ctx && canvas) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#300";
      ctx.fillRect(0, 0, canvas.width, 80);
      ctx.fillStyle = "#fff";
      ctx.font = "16px monospace";
      ctx.fillText(String(err.message || err), 12, 30);
    }
  }
  requestAnimationFrame(loop);
}

function boot() {
  canvas = document.getElementById("c");
  ctx = canvas.getContext("2d");
  freshGame();
  var q = new URLSearchParams(location.search);
  if (q.has("box")) G.boxes = true;
  if (q.get("diff") && DIFFS[q.get("diff")]) G.diff = q.get("diff");
  if (q.has("test")) {
    var result = runSelfTest();
    freshGame();
    G.mode = "testresult";
    G._test = result;
    document.title = result.ok ? "ABF_TEST_PASS" : "ABF_TEST_FAIL";
    var pre = document.getElementById("testlog");
    pre.hidden = false;
    pre.textContent = result.log;
  } else if (q.get("demo") === "fight" || q.get("demo") === "pose" || q.get("demo") === "select" || q.get("demo") === "win") {
    var demo = q.get("demo");
    if (demo === "select") {
      G.mode = "select";
    } else if (demo === "win") {
      setupMatch(q.get("p1") || "elon", q.get("p2") || "jensen");
      G.p1.rounds = 2;
      G.p2.rounds = 0;
      G.winner = G.p1;
      G.mode = "matchend";
      G.p1.x = 700;
      G.p2.x = 1000;
    } else {
      setupMatch(q.get("p1") || "elon", q.get("p2") || "jensen");
      G.mode = "fight";
      G.roundPhase = "fight";
      G.timer = 88;
      G.p1.x = 640;
      G.p2.x = 980;
      G.p1.meter = demo === "pose" ? 100 : 40;
      G.cam.x = 810;
      G.cam.z = 1;
      if (demo === "pose") {
        var mv = q.get("move") || "hp";
        startMove(G.p1, mv);
        G.freeze = 0;
        G.p1.frame = +(q.get("f") || 10);
      }
    }
  }
  fitViewport();
  canvas.focus();
  window.addEventListener("resize", fitViewport);
  window.addEventListener("orientationchange", fitViewport);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", fitViewport);
    window.visualViewport.addEventListener("scroll", fitViewport);
  }
  var blockKeys = { Space: 1, ArrowUp: 1, ArrowDown: 1, ArrowLeft: 1, ArrowRight: 1, KeyW: 1, KeyA: 1, KeyS: 1, KeyD: 1 };
  window.addEventListener("keydown", function (e) {
    if (blockKeys[e.code]) e.preventDefault();
    if (e.repeat) return;
    if (!keys[e.code]) just[e.code] = true;
    keys[e.code] = true;
    unlockAudio();
  });
  window.addEventListener("keyup", function (e) { keys[e.code] = false; });
  canvas.addEventListener("pointerdown", function (e) {
    G.mouse = toGame(e);
    G.clicked = true;
    unlockAudio();
  });
  canvas.addEventListener("pointermove", function (e) {
    G.mouse = toGame(e);
    G.mouseMoved = true;
  });
  canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  var pads = document.querySelectorAll("#touch button");
  for (var i = 0; i < pads.length; i++) {
    (function (btn) {
      function down(e) {
        e.preventDefault();
        btn.classList.add("held");
        var k = btn.getAttribute("data-k");
        vkeys[k] = true;
        vjust[k] = true;
        unlockAudio();
      }
      function up(e) {
        btn.classList.remove("held");
        vkeys[btn.getAttribute("data-k")] = false;
      }
      btn.addEventListener("pointerdown", down);
      btn.addEventListener("pointerup", up);
      btn.addEventListener("pointercancel", up);
      btn.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") return; up(e); });
    })(pads[i]);
  }
  if (q.has("trailer")) {
    G.trailer = true;
    G.mute = true;
    G.capture = q.has("capture");
    G.dpr = 1;
    canvas.width = 1080;
    canvas.height = 1920;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.objectFit = "contain";
    if (window.__startTrailer) window.__startTrailer();
    if (G.capture) return;
    requestAnimationFrame(window.__trailerLoop || loop);
    return;
  }
  render();
  requestAnimationFrame(loop);
}

window.addEventListener("load", boot);
