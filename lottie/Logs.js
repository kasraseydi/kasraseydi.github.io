document.addEventListener('DOMContentLoaded', function () {
    const animContainer = document.getElementById('logs');

    if (!animContainer) return console.error("Element #logs not found.");

    const animation = lottie.loadAnimation({
        container: animContainer,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: '/lottie/Logs.json'
    });

    const frame12 = 12;
    const hoverFrame = 60;

    animation.goToAndStop(frame12, true); // initial state

    let direction = 1; // 1 = forward, -1 = backward

    const isTouchDevice = () => ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    if (isTouchDevice()) {
        animation.playSegments([frame12, hoverFrame], true);
    } else {
        animContainer.addEventListener('mouseenter', () => {
            direction = 1;

            // Ensure forward always starts from current frame or frame12 if below
            const startFrame = Math.max(animation.currentFrame, frame12);
            animation.goToAndStop(startFrame, true);

            animation.setDirection(direction);
            animation.play();
        });

        animContainer.addEventListener('mouseleave', () => {
            direction = -1;
            animation.setDirection(direction);
            animation.play();
        });

        // Clamp reverse frames without stopping the animation
        animation.addEventListener('enterFrame', () => {
            if (direction === -1 && animation.currentFrame < frame12) {
                animation.currentFrame = frame12;
            }
        });

        // Ensure forward lands exactly on hoverFrame
        animation.addEventListener('complete', () => {
            if (direction === 1) animation.goToAndStop(hoverFrame, true);
        });
    }
});
