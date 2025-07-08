document.addEventListener('DOMContentLoaded', function () {
    var animationContainer = document.getElementById('logs');

    if (animationContainer) {
        var animation = lottie.loadAnimation({
            container: animationContainer,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: 'https://kasraseydi.github.io/lottie/Logs.json'
        });

        var defaultFrame = 12;
        var hoverFrame = 60;

        animation.goToAndStop(defaultFrame, true); // Set default state

        // Check if the device has touch support
        function isTouchDevice() {
            return ('ontouchstart' in window || navigator.maxTouchPoints > 0);
        }

        if (isTouchDevice()) {
            animation.playSegments([defaultFrame, hoverFrame], true); // Auto-hover effect on touch devices
        } else {
            // Normal hover events for non-touch devices
            animationContainer.addEventListener('mouseenter', function () {
                animation.playSegments([defaultFrame, hoverFrame], true);
            });

            animationContainer.addEventListener('mouseleave', function () {
                animation.playSegments([hoverFrame, defaultFrame], true);
            });
        }
    } else {
        console.error("Element #logs not found. Double-check the HTML!");
    }
});