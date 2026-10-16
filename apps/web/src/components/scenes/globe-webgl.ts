import { createSphereGeometry, orbitAt } from "./globe-model";
import { sceneAssets } from "./scene-contracts";

export type GlobeController = {
  pause(): void;
  resume(): void;
  dispose(): void;
};
type Quality = "low" | "high";

const VERTEX_SHADER = [
  "#version 300 es",
  "precision highp float;",
  "layout(location=0) in vec3 aPosition;",
  "layout(location=1) in vec2 aUv;",
  "uniform vec2 uScale;",
  "uniform float uYaw;",
  "uniform float uPitch;",
  "out vec2 vUv;",
  "out vec3 vNormal;",
  "void main() {",
  "  float sy = sin(uYaw), cy = cos(uYaw);",
  "  vec3 p = vec3(aPosition.x * cy + aPosition.z * sy, aPosition.y, -aPosition.x * sy + aPosition.z * cy);",
  "  float sx = sin(uPitch), cx = cos(uPitch);",
  "  vec3 n = vec3(p.x, p.y * cx - p.z * sx, p.y * sx + p.z * cx);",
  "  vNormal = normalize(n);",
  "  vUv = aUv;",
  "  gl_Position = vec4(n.xy * uScale, -n.z * 0.1, 1.0);",
  "}",
].join("\n");

const FRAGMENT_SHADER = [
  "#version 300 es",
  "precision highp float;",
  "in vec2 vUv;",
  "in vec3 vNormal;",
  "uniform sampler2D uSurface;",
  "uniform sampler2D uLandMask;",
  "uniform float uTime;",
  "out vec4 outColor;",
  "void main() {",
  "  vec3 n = normalize(vNormal);",
  "  float facing = max(n.z, 0.0);",
  "  vec3 tex = texture(uSurface, vUv).rgb;",
  "  float land = smoothstep(0.14, 0.68, texture(uLandMask, vUv).r);",
  "  float sun = max(dot(n, normalize(vec3(-0.5, 0.7, 0.85))), 0.0);",
  "  float light = 0.30 + 0.78 * sun;",
  "  vec3 ocean = vec3(0.012, 0.025, 0.046) + tex * 0.16;",
  "  vec3 continent = vec3(0.26, 0.066, 0.018) + tex * 0.74;",
  "  vec3 color = mix(ocean, continent, land) * light;",
  "  float rim = pow(1.0 - facing, 3.0);",
  "  float pulse = 0.92 + 0.08 * sin(uTime * 0.8);",
  "  color += vec3(0.96, 0.30, 0.08) * rim * (0.48 * pulse);",
  "  color += vec3(0.26, 0.065, 0.015) * land * pow(max(sun, 0.0), 5.0);",
  "  outColor = vec4(min(color, vec3(1.0)), 1.0);",
  "}",
].join("\n");

function shader(gl: WebGL2RenderingContext, kind: number, source: string) {
  const item = gl.createShader(kind);
  if (!item) throw new Error("Globe shader allocation failed");
  gl.shaderSource(item, source);
  gl.compileShader(item);
  if (!gl.getShaderParameter(item, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(item);
    gl.deleteShader(item);
    throw new Error(error || "Globe shader failed to compile");
  }
  return item;
}

function createProgram(gl: WebGL2RenderingContext) {
  const vertex = shader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = shader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!program) throw new Error("Globe program allocation failed");
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(error || "Globe program failed to link");
  }
  return program;
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Globe image could not be loaded"));
    image.src = source;
  });
}

function createTexture(gl: WebGL2RenderingContext, image: HTMLImageElement) {
  const texture = gl.createTexture();
  if (!texture) throw new Error("Globe texture allocation failed");
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.generateMipmap(gl.TEXTURE_2D);
  return texture;
}

/** GPU sphere, pointer parallax and independent, depth-sorted DOM platform orbits. */
export async function createGlobeWebGL(
  canvas: HTMLCanvasElement,
  stage: HTMLElement,
  quality: Quality,
  onFallback: () => void,
): Promise<GlobeController> {
  const context = canvas.getContext("webgl2", {
    alpha: true,
    antialias: quality === "high",
    depth: false,
    stencil: false,
    powerPreference: quality === "low" ? "low-power" : "high-performance",
  });
  if (!context) throw new Error("WebGL2 unavailable");
  const gl: WebGL2RenderingContext = context;
  const [surfaceImage, maskImage] = await Promise.all([
    loadImage(sceneAssets.earthSurface),
    loadImage(sceneAssets.earthMask),
  ]);
  const program = createProgram(gl);
  const geometry = createSphereGeometry(quality === "low" ? 64 : 112, quality === "low" ? 36 : 64);
  const vao = gl.createVertexArray();
  const buffer = gl.createBuffer();
  if (!vao || !buffer) {
    gl.deleteProgram(program);
    throw new Error("Globe mesh allocation failed");
  }
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, geometry, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 20, 0);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 20, 12);
  gl.bindVertexArray(null);
  const surface = createTexture(gl, surfaceImage);
  const mask = createTexture(gl, maskImage);
  const yawLocation = gl.getUniformLocation(program, "uYaw");
  const pitchLocation = gl.getUniformLocation(program, "uPitch");
  const scaleLocation = gl.getUniformLocation(program, "uScale");
  const timeLocation = gl.getUniformLocation(program, "uTime");
  gl.useProgram(program);
  gl.uniform1i(gl.getUniformLocation(program, "uSurface"), 0);
  gl.uniform1i(gl.getUniformLocation(program, "uLandMask"), 1);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.disable(gl.DEPTH_TEST);

  const icons = [...stage.querySelectorAll<HTMLElement>(".orbit-platform")];
  let width = 1, height = 1, lastFrame: number | null = null, elapsed = 0;
  let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
  let requestId = 0, running = false, disposed = false, lost = false;
  const resize = () => {
    const { width: w, height: h } = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, quality === "low" ? 1.2 : 1.8);
    width = Math.max(1, w); height = Math.max(1, h);
    const pixelWidth = Math.max(1, Math.round(width * dpr));
    const pixelHeight = Math.max(1, Math.round(height * dpr));
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    gl.viewport(0, 0, pixelWidth, pixelHeight);
    const diameter = Math.min(width, height) * 0.76;
    gl.useProgram(program);
    gl.uniform2f(scaleLocation, diameter / width, diameter / height);
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  const pointerMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    const bounds = stage.getBoundingClientRect();
    targetX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    targetY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
  };
  const pointerOut = () => { targetX = 0; targetY = 0; };
  stage.addEventListener("pointermove", pointerMove, { passive: true });
  stage.addEventListener("pointerleave", pointerOut);
  const contextLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    running = false;
    cancelAnimationFrame(requestId);
    onFallback();
  };
  canvas.addEventListener("webglcontextlost", contextLost);

  function positionIcons(time: number) {
    const span = Math.min(width, height) * 0.455;
    for (let index = 0; index < icons.length; index++) {
      const element = icons[index]!;
      const location = orbitAt(index, time);
      element.style.left = width / 2 + location.x * span + "px";
      element.style.top = height / 2 + location.y * span + "px";
      element.style.right = "auto";
      element.style.bottom = "auto";
      element.style.transform = "translate(-50%, -50%) scale(" + location.scale.toFixed(3) + ")";
      element.style.zIndex = location.depth < -0.1 ? "1" : "5";
      element.style.opacity = (0.65 + 0.35 * (location.depth + 1) / 2).toFixed(3);
    }
  }
  const draw = (now: number) => {
    if (!running || disposed || lost) return;
    if (lastFrame !== null) elapsed += Math.min(0.06, Math.max(0, (now - lastFrame) / 1000));
    lastFrame = now;
    pointerX += (targetX - pointerX) * 0.04;
    pointerY += (targetY - pointerY) * 0.04;
    gl.useProgram(program);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(yawLocation, elapsed * 0.18 + pointerX * 0.21 + 0.18);
    gl.uniform1f(pitchLocation, -0.19 - pointerY * 0.12);
    gl.uniform1f(timeLocation, elapsed);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, surface);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, mask);
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, geometry.length / 5);
    gl.bindVertexArray(null);
    positionIcons(elapsed);
    requestId = requestAnimationFrame(draw);
  };
  resize();
  const controller: GlobeController = {
    pause() {
      running = false;
      cancelAnimationFrame(requestId);
      lastFrame = null;
    },
    resume() {
      if (running || disposed || lost) return;
      running = true;
      lastFrame = null;
      requestId = requestAnimationFrame(draw);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      controller.pause();
      observer.disconnect();
      stage.removeEventListener("pointermove", pointerMove);
      stage.removeEventListener("pointerleave", pointerOut);
      canvas.removeEventListener("webglcontextlost", contextLost);
      for (const icon of icons) icon.removeAttribute("style");
      if (!lost) {
        gl.deleteBuffer(buffer);
        gl.deleteVertexArray(vao);
        gl.deleteTexture(surface);
        gl.deleteTexture(mask);
        gl.deleteProgram(program);
      }
    },
  };
  controller.resume();
  return controller;
}
