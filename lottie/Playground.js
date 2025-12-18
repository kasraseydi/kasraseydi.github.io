document.addEventListener('DOMContentLoaded', function () {
    const animContainer = document.getElementById('play');

    if (!animContainer) return console.error("Element #play not found.");

    const animation = lottie.loadAnimation({
        container: animContainer,
        renderer: 'svg',
        loop: false, // overall looping off; we'll handle hover looping manually
        autoplay: false,
        path: '/lottie/Playground.json'
    });

    const startFrame = 1;
    const hoverFrame = 50;

    animation.goToAndStop(startFrame, true); // initial state

    let direction = 1; // 1 = forward, -1 = backward
    let hoverLoop = false;

    const isTouchDevice = () => ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    if (isTouchDevice()) {
        animation.playSegments([startFrame, hoverFrame], true);
    } else {
        animContainer.addEventListener('mouseenter', () => {
            direction = 1;
            hoverLoop = true;

            const fromFrame = Math.max(animation.currentFrame, startFrame);
            animation.playSegments([fromFrame, hoverFrame], true);

            // Listen for complete and loop if hovering
            animation.addEventListener('complete', loopHover);
        });

        animContainer.addEventListener('mouseleave', () => {
            direction = -1;
            hoverLoop = false;

            animation.removeEventListener('complete', loopHover);
            animation.playSegments([animation.currentFrame, startFrame], true);
        });

        function loopHover() {
            if (hoverLoop) {
                animation.playSegments([startFrame, hoverFrame], true);
            }
        }

        // Clamp reverse frames
        animation.addEventListener('enterFrame', () => {
            if (direction === -1 && animation.currentFrame < startFrame) {
                animation.currentFrame = startFrame;
            }
        });
    }
});
