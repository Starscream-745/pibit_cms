import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './BallCursor.css';

const BallCursor: React.FC = () => {
  const bigBallRef = useRef<HTMLDivElement>(null);
  const smallBallRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bigBall = bigBallRef.current;
    const smallBall = smallBallRef.current;

    if (!bigBall || !smallBall) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(bigBall, {
        duration: 0.4,
        x: e.clientX - 15,
        y: e.clientY - 15,
        ease: 'power2.out'
      });
      gsap.to(smallBall, {
        duration: 0.1,
        x: e.clientX - 5,
        y: e.clientY - 7,
        ease: 'power2.out'
      });
    };

    const onMouseHover = () => {
      gsap.to(bigBall, {
        duration: 0.3,
        scale: 4,
        ease: 'power2.out'
      });
      gsap.to(bigBall.querySelector('circle'), {
        duration: 0.3,
        fillOpacity: 0,
        stroke: '#ffffff',
        strokeWidth: 1,
        ease: 'power2.out'
      });
      gsap.to(smallBall, {
        duration: 0.3,
        opacity: 0,
        ease: 'power2.out'
      });
    };

    const onMouseHoverOut = () => {
      gsap.to(bigBall, {
        duration: 0.3,
        scale: 1,
        ease: 'power2.out'
      });
      gsap.to(bigBall.querySelector('circle'), {
        duration: 0.3,
        fillOpacity: 1,
        strokeWidth: 0,
        ease: 'power2.out'
      });
      gsap.to(smallBall, {
        duration: 0.3,
        opacity: 0.8,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', onMouseMove);

    // Initial check for hoverables
    const hoverables = document.querySelectorAll('.hoverable, a, button, .nav-link, .dropdown-item, .asset-card');
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', onMouseHover);
      el.addEventListener('mouseleave', onMouseHoverOut);
    });

    // Observer to catch dynamically added hoverables
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const children = node.querySelectorAll('.hoverable, a, button, .nav-link, .dropdown-item, .asset-card');
            children.forEach((el) => {
              el.addEventListener('mouseenter', onMouseHover);
              el.addEventListener('mouseleave', onMouseHoverOut);
            });
            if (node.matches('.hoverable, a, button, .nav-link, .dropdown-item, .asset-card')) {
              node.addEventListener('mouseenter', onMouseHover);
              node.addEventListener('mouseleave', onMouseHoverOut);
            }
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      hoverables.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseHover);
        el.removeEventListener('mouseleave', onMouseHoverOut);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <div className="custom-ball-cursor">
      <div ref={bigBallRef} className="cursor__ball cursor__ball--big">
        <svg height="30" width="30">
          <circle cx="15" cy="15" r="12" strokeWidth="0"></circle>
        </svg>
      </div>
      <div ref={smallBallRef} className="cursor__ball cursor__ball--small">
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="4" strokeWidth="0"></circle>
        </svg>
      </div>
    </div>
  );
};

export default BallCursor;
