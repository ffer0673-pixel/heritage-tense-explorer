'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';

export default function CursorBubble() {
    useEffect(() => {
        const cursorBubble = document.querySelector('.cursor-bubble');
        if (!cursorBubble) return;

        const xTo = gsap.quickTo(cursorBubble, 'x', { duration: 0.5, ease: 'power3' });
        const yTo = gsap.quickTo(cursorBubble, 'y', { duration: 0.5, ease: 'power3' });

        let isHoveringClickable = false;
        gsap.set(cursorBubble, { rotation: -30 });

        const onMouseMove = (e: MouseEvent) => {
            xTo(e.clientX + 13);
            yTo(e.clientY - 43);
        };

        const onMouseOver = (e: MouseEvent) => {
            const targetSelector = 'a, button, [role="button"], input[type="submit"], input[type="button"], select, .cursor-pointer, .logo-truus, .nav-work-btn, .footer-column h3, .footer-info-list li';
            const target = e.target as HTMLElement | null;
            const found = target ? target.closest(targetSelector) : null;

            if (found) {
                const text = found.matches('.logo-truus') ? 'to home' : 'pencet';
                if (cursorBubble.textContent !== text) {
                    cursorBubble.textContent = text;
                }
                if (!isHoveringClickable) {
                    isHoveringClickable = true;
                    gsap.killTweensOf(cursorBubble, 'opacity,scale,rotation');
                    gsap.to(cursorBubble, { opacity: 1, scale: 1, rotation: 0, duration: 1.7, delay: 0.1, ease: 'elastic.out(1, 0.4)' });
                }
            } else if (isHoveringClickable) {
                isHoveringClickable = false;
                gsap.killTweensOf(cursorBubble, 'opacity,scale,rotation');
                gsap.to(cursorBubble, { opacity: 1, scale: 0, rotation: -30, duration: 0.3, ease: 'sine.inOut' });
            }
        };

        const onMouseLeave = () => {
            if (isHoveringClickable) {
                isHoveringClickable = false;
                gsap.killTweensOf(cursorBubble, 'opacity,scale,rotation');
                gsap.to(cursorBubble, { opacity: 1, scale: 0, rotation: -30, duration: 0.3, ease: 'sine.inOut' });
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseover', onMouseOver);
        document.addEventListener('mouseleave', onMouseLeave);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseover', onMouseOver);
            document.removeEventListener('mouseleave', onMouseLeave);
        };
    }, []);

    return <div className="cursor-bubble">pencet</div>;
}
