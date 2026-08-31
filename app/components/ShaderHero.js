"use client";

import { useEffect, useRef, useState } from "react";

// --- Vertex shader ---------------------------------------------------
// We don't need any real 3D geometry — just two triangles that cover
// the whole screen (a "fullscreen quad"). The vertex shader's only job
// is to pass those clip-space corner positions straight through.
const VERTEX_SRC = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// --- Fragment shader (this is the actual "shader" people mean) -------
const FRAGMENT_SRC = `
  precision mediump float;

  uniform vec2 u_resolution; // canvas size in pixels, so we can correct for aspect ratio
  uniform float u_time;      // seconds since start, drives the animation
  uniform vec2 u_mouse;      // mouse position in pixels

  // A cheap pseudo-random number generator. There's no true randomness
  // in GLSL, so we fake it by hashing a 2D coordinate into a "random"
  // looking float using sine + a large multiplier.
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // Value noise: instead of pure static (which is what hash() alone
  // gives you), we sample hash() at the 4 corners of a grid cell and
  // smoothly blend between them. That's what turns "random dots" into
  // soft, cloud-like shapes.
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f); // smoothstep-style easing curve

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  void main() {
    // gl_FragCoord.xy is the pixel we're currently drawing, in pixels.
    // Dividing by resolution gives us 0..1 "UV" coordinates.
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    // Correct for aspect ratio so the noise pattern isn't stretched
    // on wide screens.
    float aspect = u_resolution.x / u_resolution.y;
    vec2 aspectUv = vec2(uv.x * aspect, uv.y);

    vec2 mouseUv = u_mouse / u_resolution.xy;
    mouseUv.x *= aspect;

    // This is the "flow field": we scale up the UV space so the noise
    // has visible detail, then nudge it toward the mouse position.
    // That nudging is what makes the aurora lean toward the cursor.
    vec2 flow = aspectUv * 3.0;
    vec2 towardMouse = mouseUv - aspectUv;
    flow += towardMouse * 0.6;

    // Two noise layers at different scales/speeds, blended together.
    // One layer alone looks flat; two layers moving at different
    // speeds is what gives it that drifting, aurora-like motion.
    float n1 = noise(flow + u_time * 0.05);
    float n2 = noise(flow * 1.8 - u_time * 0.03 + 10.0);
    float n = n1 * 0.6 + n2 * 0.4;

    // Portfolio's identity-kit colors, converted from hex to 0..1 floats.
    vec3 cream    = vec3(1.000, 0.976, 0.961); // #FFF9F5
    vec3 sky      = vec3(0.494, 0.784, 0.890); // #7EC8E3
    vec3 lavender = vec3(0.722, 0.651, 0.878); // #B8A6E0
    vec3 plum     = vec3(0.165, 0.106, 0.188); // #2A1B30

    // Walk through the palette based on the noise value. smoothstep
    // gives soft transitions between bands instead of hard edges.
    vec3 color = mix(cream, sky, smoothstep(0.2, 0.55, n));
    color = mix(color, lavender, smoothstep(0.45, 0.75, n));
    color = mix(color, plum, smoothstep(0.75, 0.95, n));

    // Mouse glow: a soft, warm highlight centered on the cursor.
    // This is the clearest, most obvious proof the shader responds
    // to u_mouse — everything above this line only bends the flow
    // field slightly, which is too subtle to notice at a glance.
    float distToMouse = length(aspectUv - mouseUv);
    float glow = smoothstep(0.5, 0.0, distToMouse); // 1.0 right at the cursor, fading out
    color = mix(color, sky, glow * 0.35);

    // Film grain: a tiny bit of per-pixel, per-frame noise so the
    // gradient doesn't look flat/banded. Centered around 0 so it can
    // lighten or darken a pixel slightly.
    float grain = hash(gl_FragCoord.xy + u_time) * 0.05;
    color += grain - 0.025;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vertexSrc, fragmentSrc) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

// Caps how much of the screen's real pixel density we render at.
// A phone can report a devicePixelRatio of 3+ ; rendering a full-screen
// shader at that resolution every frame is expensive for no visual
// benefit here, so we clamp it.
const MAX_DPR = 1.5;

export default function ShaderHero() {
  const canvasRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect the user's reduced-motion preference, and keep watching it
  // in case they change it while the page is open.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const handleChange = (e) => setReducedMotion(e.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    // Reduced motion (or no canvas yet): skip WebGL entirely. The CSS
    // gradient in the markup below stays visible as the fallback.
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    // No WebGL support: do nothing and let the CSS gradient fallback show.
    if (!gl) return;

    const program = createProgram(gl, VERTEX_SRC, FRAGMENT_SRC);
    if (!program) return;
    gl.useProgram(program);

    // A fullscreen quad, as two triangles, in clip space (-1 to 1).
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");

    // Start the "cursor" in the middle of the canvas instead of (0,0)
    // (the bottom-left corner) — so the glow is visible immediately,
    // even before the user's first mousemove.
    const mouse = { x: canvas.clientWidth / 2, y: canvas.clientHeight / 2 };
    let rafId = null;
    let startTime = performance.now();
    let paused = false;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const width = Math.floor(canvas.clientWidth * dpr);
      const height = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    }

    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      mouse.x = (e.clientX - rect.left) * dpr;
      // Flip Y: browser mouse Y grows downward, WebGL's does not.
      mouse.y = (rect.height - (e.clientY - rect.top)) * dpr;
    }

    // Pausing on tab-hide saves battery/CPU for a purely decorative
    // background the user isn't even looking at.
    function handleVisibility() {
      paused = document.hidden;
      if (!paused) draw();
    }

    function draw() {
      if (paused) return;
      resize();
      const elapsed = (performance.now() - startTime) / 1000;

      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, elapsed);
      gl.uniform2f(mouseLoc, mouse.x, mouse.y);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(draw);
    }

    // Listen on the window, not just the canvas — this way the glow
    // still tracks the cursor even while it's over the text card that
    // sits on top of the canvas, instead of "freezing" at the last
    // position the cursor was directly over the canvas itself.
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("visibilitychange", handleVisibility);

    resize();
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, [reducedMotion]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/*
        Fallback layer: always in the DOM, sits behind the canvas.
        It's what reduced-motion users see (canvas is skipped entirely
        below), and it's also the safety net if WebGL isn't supported.
      */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #FFF9F5 0%, #7EC8E3 45%, #B8A6E0 75%, #2A1B30 100%)",
        }}
      />
      {!reducedMotion && (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      )}
    </div>
  );
}