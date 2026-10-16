import {
  EXPLOSION_START,
  FORMATION_SECONDS,
  IMPACT_TIMES,
  makeMountainParticles,
  mountainPhaseAt,
} from "./mountain-model";
import type { MountainPhase } from "./scene-contracts";

type Controller = { pause(): void; resume(): void; dispose(): void };
const STRIDE = 8;
const TRAIL_POINTS = 28;
const RING_POINTS = 72;
const IMPACTS = [
  { start: [-3.6, 1.6, -0.4], end: [-1.0, 0.51, 0.03] },
  { start: [3.5, 1.85, -0.6], end: [0.0, 0.94, 0.02] },
  { start: [2.7, -0.6, 0.1], end: [1.18, 0.06, 0.05] },
] as const;

const VERTEX = [
  "#version 300 es",
  "precision highp float;",
  "layout(location=0) in vec3 aOrigin;",
  "layout(location=1) in vec3 aTarget;",
  "layout(location=2) in float aSize;",
  "layout(location=3) in float aRandom;",
  "uniform float uTime;",
  "uniform float uFormation;",
  "uniform float uDpr;",
  "uniform int uEffect;",
  "out float vBrightness;",
  "out float vOpacity;",
  "void main(){",
  "  if(aSize <= 0.001){ gl_Position = vec4(2.0,2.0,2.0,1.0); gl_PointSize = 0.0; vOpacity = 0.0; vBrightness = 0.0; return; }",
  "  float jitter = smoothstep(0.0, 1.0, uFormation * 1.09 - aRandom * 0.13);",
  "  vec3 p = mix(aOrigin, aTarget, jitter);",
  "  float burstTime = uTime - 3.21;",
  "  float burst = smoothstep(0.0, 0.23, burstTime) * (1.0 - smoothstep(0.4, 1.12, burstTime));",
  "  vec3 kick = normalize(vec3(sin(aRandom*53.1),cos(aRandom*71.3),sin(aRandom*91.7)) + vec3(0.01));",
  "  if(uEffect == 0) p += kick * burst * (0.12 + aRandom * 0.52);",
  "  float perspective = 1.0 + p.z * 0.055;",
  "  gl_Position = vec4((p.x + p.z * 0.19)/3.7 * perspective, (p.y + p.z * 0.18 + 0.28)/1.98, p.z/6.0, 1.0);",
  "  gl_PointSize = aSize * uDpr * (uEffect == 1 ? 2.4 : 1.1);",
  "  gl_PointSize *= uEffect == 1 ? 1.0 : (0.6 + 0.4*jitter);",
  "  vOpacity = uEffect == 1 ? 0.95 : (0.2 + 0.68*jitter);",
  "  vBrightness = uEffect == 1 ? 1.0 : (0.43 + 0.48 * (0.5 + 0.5*sin(p.x*8.2+p.z*4.2)) + burst*0.4);",
  "}",
].join("\n");

const FRAGMENT = [
  "#version 300 es",
  "precision mediump float;",
  "in float vBrightness;",
  "in float vOpacity;",
  "out vec4 outColor;",
  "void main(){",
  "  vec2 uv = gl_PointCoord - vec2(0.5);",
  "  float glow = 1.0 - smoothstep(0.04, 0.5, length(uv));",
  "  if (glow < 0.015) discard;",
  "  vec3 amber = mix(vec3(0.83,0.19,0.035),vec3(1.0,0.69,0.29),clamp(vBrightness,0.0,1.0));",
  "  outColor = vec4(amber,glow * vOpacity * 0.86);",
  "}",
].join("\n");

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Shader allocation failed");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const details = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(details || "Mountain shader compilation failed");
  }
  return shader;
}

function programFor(gl: WebGL2RenderingContext) {
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!program) throw new Error("Program allocation failed");
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const details = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(details || "Mountain program linking failed");
  }
  return program;
}

function bufferFor(gl: WebGL2RenderingContext, data: Float32Array, usage: number) {
  const vao = gl.createVertexArray();
  const buffer = gl.createBuffer();
  if (!vao || !buffer) throw new Error("Mountain buffer allocation failed");
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, usage);
  for (const [location, length, offset] of [[0, 3, 0], [1, 3, 3], [2, 1, 6], [3, 1, 7]] as const) {
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, length, gl.FLOAT, false, STRIDE * 4, offset * 4);
  }
  gl.bindVertexArray(null);
  return { vao, buffer };
}

function setPoint(
  data: Float32Array,
  slot: number,
  x: number,
  y: number,
  z: number,
  size: number,
  seed: number,
) {
  const offset = slot * STRIDE;
  data[offset] = x;
  data[offset + 1] = y;
  data[offset + 2] = z;
  data[offset + 3] = x;
  data[offset + 4] = y;
  data[offset + 5] = z;
  data[offset + 6] = size;
  data[offset + 7] = seed;
}

/** Three independent projectile trails plus expanding shock rings at impact. */
function updateImpacts(data: Float32Array, seconds: number) {
  data.fill(0);
  let slot = 0;
  for (let impact = 0; impact < 3; impact++) {
    const { start, end } = IMPACTS[impact]!;
    const hit = IMPACT_TIMES[impact]!;
    const launch = hit - 0.72;
    for (let j = 0; j < TRAIL_POINTS; j++, slot++) {
      const t = (seconds - launch) / 0.72 - j * 0.016;
      if (t < 0 || t > 1.07) continue;
      const clamped = Math.min(t, 1);
      const ease = clamped * clamped * (3 - 2 * clamped);
      const alpha = Math.max(0, 1 - j / TRAIL_POINTS);
      const fade = t > 1 ? Math.max(0, 1 - (t - 1) * 14) : 1;
      setPoint(
        data, slot,
        start[0] + (end[0] - start[0]) * ease,
        start[1] + (end[1] - start[1]) * ease,
        start[2] + (end[2] - start[2]) * ease,
        (j === 0 ? 7.5 : 3.3 * alpha) * fade,
        0.7 + alpha * 0.3,
      );
    }
    const age = seconds - hit;
    for (let j = 0; j < RING_POINTS; j++, slot++) {
      if (age < 0 || age > 0.72) continue;
      const theta = j / RING_POINTS * Math.PI * 2;
      const radius = age * 2.15;
      const fade = (1 - age / 0.72) ** 2;
      setPoint(
        data, slot,
        end[0] + Math.cos(theta) * radius,
        end[1] + Math.sin(theta) * radius * 0.42,
        end[2] + Math.sin(theta) * radius * 0.65,
        (2.5 + 2 * fade) * fade,
        fade,
      );
    }
  }
}

export function createMountainWebGL(
  canvas: HTMLCanvasElement,
  onPhase: (phase: MountainPhase) => void,
  quality: "low" | "high",
): Controller {
  const gl = canvas.getContext("webgl2", {
    alpha: true, antialias: false, powerPreference: quality === "low" ? "low-power" : "high-performance",
    premultipliedAlpha: false, depth: false, stencil: false,
  });
  if (!gl) throw new Error("WebGL2 unavailable");
  const program = programFor(gl);
  const particles = makeMountainParticles(quality === "low" ? 76 : 152, quality === "low" ? 49 : 94);
  const mountain = bufferFor(gl, particles, gl.STATIC_DRAW);
  const effectData = new Float32Array(3 * (TRAIL_POINTS + RING_POINTS) * STRIDE);
  const effects = bufferFor(gl, effectData, gl.DYNAMIC_DRAW);
  const uTime = gl.getUniformLocation(program, "uTime");
  const uFormation = gl.getUniformLocation(program, "uFormation");
  const uDpr = gl.getUniformLocation(program, "uDpr");
  const uEffect = gl.getUniformLocation(program, "uEffect");
  gl.useProgram(program);
  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  let elapsed = 0;
  let lastFrame: number | null = null;
  let frameId = 0;
  let running = false;
  let disposed = false;
  let lastPhase: MountainPhase | null = null;
  let lost = false;
  const onContextLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    running = false;
    cancelAnimationFrame(frameId);
    onPhase("poster");
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  const resize = () => {
    const bounds = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, quality === "low" ? 1.1 : 1.7);
    const width = Math.max(1, Math.round(bounds.width * dpr));
    const height = Math.max(1, Math.round(bounds.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, width, height);
    gl.uniform1f(uDpr, dpr);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  function draw(now: number) {
    if (!running || disposed || lost) return;
    if (lastFrame !== null) elapsed += Math.min(0.06, (now - lastFrame) / 1000);
    lastFrame = now;
    const phase = mountainPhaseAt(elapsed);
    if (phase !== lastPhase) {
      lastPhase = phase;
      onPhase(phase);
    }
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform1f(uTime, elapsed);
    gl.uniform1f(uFormation, Math.min(1, elapsed / FORMATION_SECONDS));
    gl.uniform1i(uEffect, 0);
    gl.bindVertexArray(mountain.vao);
    gl.drawArrays(gl.POINTS, 0, particles.length / STRIDE);
    if (elapsed >= IMPACT_TIMES[0] - 0.72 && elapsed <= EXPLOSION_START + 0.8) {
      updateImpacts(effectData, elapsed);
      gl.bindBuffer(gl.ARRAY_BUFFER, effects.buffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, effectData);
      gl.uniform1i(uEffect, 1);
      gl.bindVertexArray(effects.vao);
      gl.drawArrays(gl.POINTS, 0, effectData.length / STRIDE);
    }
    gl.bindVertexArray(null);
    frameId = requestAnimationFrame(draw);
  }
  resize();
  const controller: Controller = {
    pause() {
      running = false;
      cancelAnimationFrame(frameId);
      lastFrame = null;
    },
    resume() {
      if (disposed || lost || running) return;
      running = true;
      lastFrame = null;
      frameId = requestAnimationFrame(draw);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      controller.pause();
      observer.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      if (!lost) {
        gl.deleteBuffer(mountain.buffer);
        gl.deleteVertexArray(mountain.vao);
        gl.deleteBuffer(effects.buffer);
        gl.deleteVertexArray(effects.vao);
        gl.deleteProgram(program);
      }
    },
  };
  controller.resume();
  return controller;
}
