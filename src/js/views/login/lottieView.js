import View from '../View';
import '@lottiefiles/lottie-player';
const lottie = require('../../../imgs/expensy-lottie.json');

class LottieView extends View {
    constructor() {
        super();
    }

    setParent() {
        this.parentElement = document.querySelector('.content__inner');
    }

    markup() {
        const lottieContainer = document.createElement('lottie-player');
        lottieContainer.setAttribute('autoplay', 'autoplay');
        lottieContainer.setAttribute('loop', 'loop');
        lottieContainer.setAttribute('mode', 'normal');
        lottieContainer.src = lottie;
        return lottieContainer;
    }
}

export default new LottieView();
