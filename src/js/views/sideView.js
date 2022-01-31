import View from './View';
import { childOf } from '../helpers';

export default class SideView extends View {
    constructor() {
        super();
    }

    render(data) {
        this.data = data;
        this.setParent();
        this.targetElement = this.side;
        const id = this.id;

        const headerMarkup = this.headerMarkup();
        const markup = this.markup();

        this.side = document.createElement('div');
        this.targetElement = this.side;
        this.side.classList.add('side');
        this.side.id = id;

        this.header = document.createElement('div');
        this.header.classList.add('side__header');

        this.inner = document.createElement('div');
        this.inner.classList.add('side__inner');

        this.side.insertAdjacentElement('beforeend', this.header);
        this.side.insertAdjacentElement('beforeend', this.inner);

        if (id === 'login') {
            this.copyright = document.createElement('div');
            this.copyright.classList.add('copyright');
            this.copyright.innerHTML = this.copyrightText;
            this.side.insertAdjacentElement('beforeend', this.copyright);
        }

        this.header.insertAdjacentHTML('beforeend', headerMarkup);

        if (markup instanceof Element || markup instanceof HTMLDocument) {
            this.inner.insertAdjacentElement('beforeend', markup);
        } else {
            this.inner.insertAdjacentHTML('beforeend', markup);
        }

        this.parentElement.insertAdjacentElement('beforeend', this.side);
    }
}
