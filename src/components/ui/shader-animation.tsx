import { type CSSProperties, useEffect, useRef } from 'react';
import type * as ThreeNamespace from 'three';

interface ShaderAnimationProps {
  className?: string;
  style?: CSSProperties;
}

interface ShaderSceneState {
  renderer: ThreeNamespace.WebGLRenderer;
  geometry: ThreeNamespace.PlaneGeometry;
  material: ThreeNamespace.ShaderMaterial;
  animationId: number;
}

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform vec2 resolution;
  uniform float time;

  void main(void) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    float t = time * 0.05;
    float lineWidth = 0.002;

    vec3 color = vec3(0.0);
    for (int j = 0; j < 3; j++) {
      for (int i = 0; i < 5; i++) {
        color[j] += lineWidth * float(i * i) / abs(
          fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0
          - length(uv)
          + mod(uv.x + uv.y, 0.2)
        );
      }
    }

    gl_FragColor = vec4(color[0], color[1], color[2], 1.0);
  }
`;

export function ShaderAnimation({ className, style }: ShaderAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ShaderSceneState | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDisposed = false;
    let resizeObserver: ResizeObserver | null = null;

    void import('three').then((THREE) => {
      if (isDisposed) return;

      const camera = new THREE.Camera();
      camera.position.z = 1;

      const scene = new THREE.Scene();
      const geometry = new THREE.PlaneGeometry(2, 2);
      const uniforms = {
        time: { value: 1 },
        resolution: { value: new THREE.Vector2() },
      };

      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      container.appendChild(renderer.domElement);

      const updateSize = () => {
        const width = container.clientWidth;
        const height = container.clientHeight;

        renderer.setSize(width, height, false);
        uniforms.resolution.value.set(
          renderer.domElement.width,
          renderer.domElement.height
        );
      };

      resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(container);
      updateSize();

      const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const renderFrame = () => {
        uniforms.time.value += 0.05;
        renderer.render(scene, camera);
      };

      const animate = () => {
        renderFrame();
        const animationId = requestAnimationFrame(animate);

        if (sceneRef.current) {
          sceneRef.current.animationId = animationId;
        }
      };

      sceneRef.current = {
        renderer,
        geometry,
        material,
        animationId: 0,
      };

      if (shouldReduceMotion) {
        renderFrame();
      } else {
        animate();
      }
    });

    return () => {
      isDisposed = true;
      resizeObserver?.disconnect();

      const currentScene = sceneRef.current;
      if (!currentScene) return;

      cancelAnimationFrame(currentScene.animationId);

      if (container.contains(currentScene.renderer.domElement)) {
        container.removeChild(currentScene.renderer.domElement);
      }

      currentScene.renderer.dispose();
      currentScene.geometry.dispose();
      currentScene.material.dispose();
      sceneRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#000',
        ...style,
      }}
      aria-hidden="true"
    />
  );
}
