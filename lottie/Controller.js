const animationContainer2 = document.getElementById('Controller')
const animation2 = lottie.loadAnimation({
    container: animationContainer2,
    renderer: 'svg',
    loop:true,
    autoplay:false,
    path: '/lottie/Controller.json'
});

function isTouchDevice() {
    return ('ontouchstart' in window || navigator.maxTouchPoints > 0);
}

if (isTouchDevice()) {
    animation2.play(); // Auto-hover effect on touch devices
} else {

animationContainer2.addEventListener('mouseenter', () => {
    animation2.play();
});


animationContainer2.addEventListener('mouseleave', () => {
    animation2.stop();
});
}