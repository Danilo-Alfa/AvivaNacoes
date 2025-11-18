import { useEffect, useRef } from 'react';

interface TiltOptions {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  glare?: boolean;
  maxGlare?: number;
}

export function useTilt<T extends HTMLElement>(options: TiltOptions = {}) {
  const {
    maxTilt = 15,
    perspective = 1000,
    scale = 1.05,
    speed = 400,
    glare = true,
    maxGlare = 0.5,
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let glareElement: HTMLDivElement | null = null;

    // Criar elemento de brilho (glare)
    if (glare) {
      glareElement = document.createElement('div');
      glareElement.className = 'tilt-glare';
      glareElement.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,${maxGlare}) 100%);
        opacity: 0;
        pointer-events: none;
        transition: opacity ${speed}ms ease-out;
        z-index: 10;
      `;
      element.style.position = 'relative';
      element.style.overflow = 'hidden';
      element.appendChild(glareElement);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;

      // Invertido: mouse direita = inclina direita, mouse baixo = inclina baixo
      const tiltX = -percentY * maxTilt;
      const tiltY = percentX * maxTilt;

      element.style.transform = `
        perspective(${perspective}px)
        rotateX(${tiltX}deg)
        rotateY(${tiltY}deg)
        scale3d(${scale}, ${scale}, ${scale})
      `;

      if (glareElement) {
        const glareX = (percentX + 1) * 50;
        const glareY = (percentY + 1) * 50;
        glareElement.style.background = `
          radial-gradient(circle at ${glareX}% ${glareY}%,
          rgba(255,255,255,${maxGlare}) 0%,
          rgba(255,255,255,0) 80%)
        `;
        glareElement.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      element.style.transform = `
        perspective(${perspective}px)
        rotateX(0deg)
        rotateY(0deg)
        scale3d(1, 1, 1)
      `;

      if (glareElement) {
        glareElement.style.opacity = '0';
      }
    };

    // Adicionar transição suave
    element.style.transition = `transform ${speed}ms ease-out`;
    element.style.willChange = 'transform';

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      if (glareElement && element.contains(glareElement)) {
        element.removeChild(glareElement);
      }
    };
  }, [maxTilt, perspective, scale, speed, glare, maxGlare]);

  return ref;
}
