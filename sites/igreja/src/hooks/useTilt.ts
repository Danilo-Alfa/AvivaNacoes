import { useEffect, useRef } from 'react';

interface TiltOptions {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
  glare?: boolean;
  maxGlare?: number;
  tiltThreshold?: number; // 0 a 1, onde 0.5 = metade do componente
}

export function useTilt<T extends HTMLElement>(options: TiltOptions = {}) {
  const {
    maxTilt = 15,
    perspective = 1000,
    scale = 1.05,
    speed = 400,
    glare = true,
    maxGlare = 0.5,
    tiltThreshold = 0,
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Desabilitar tilt em dispositivos touch/mobile
    const isTouchDevice = !window.matchMedia('(hover: hover)').matches;
    if (isTouchDevice) return;

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

    let animationFrameId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        let percentX = (x - centerX) / centerX;
        let percentY = (y - centerY) / centerY;

        // Aplicar threshold - só inclina após passar da zona central
        if (tiltThreshold > 0) {
          const absPercentX = Math.abs(percentX);
          const absPercentY = Math.abs(percentY);

          // Só aplica inclinação se passar do threshold
          if (absPercentX < tiltThreshold) {
            percentX = 0;
          } else {
            // Normaliza para que a inclinação máxima seja nas bordas
            percentX = (absPercentX - tiltThreshold) / (1 - tiltThreshold) * Math.sign(percentX);
          }

          if (absPercentY < tiltThreshold) {
            percentY = 0;
          } else {
            percentY = (absPercentY - tiltThreshold) / (1 - tiltThreshold) * Math.sign(percentY);
          }
        }

        // Invertido: mouse direita = inclina direita, mouse baixo = inclina baixo
        const tiltX = -percentY * maxTilt;
        const tiltY = percentX * maxTilt;

        element.style.transform = `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`;

        if (glareElement) {
          const glareX = (percentX + 1) * 50;
          const glareY = (percentY + 1) * 50;
          glareElement.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,${maxGlare}) 0%, rgba(255,255,255,0) 80%)`;
          glareElement.style.opacity = '1';
        }
      });
    };

    const handleMouseLeave = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      // Adicionar transição apenas na saída para efeito suave
      element.style.transition = `transform ${speed}ms ease-out`;
      element.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

      if (glareElement) {
        glareElement.style.opacity = '0';
      }

      // Remover transição após animação para manter performance durante movimento
      setTimeout(() => {
        element.style.transition = 'none';
      }, speed);
    };

    // Configurar para melhor performance
    element.style.transition = 'none';
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
  }, [maxTilt, perspective, scale, speed, glare, maxGlare, tiltThreshold]);

  return ref;
}
