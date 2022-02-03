import View from './View';
import { childOf } from '../helpers';
import popup from './elements/popup';
import forms from './elements/forms';
import select from './elements/select';
import numberInput from './elements/numberInput';

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

    open() {
        const side = document.querySelector(`#${this.id}`);
        if (!side) return;
        document
            .querySelectorAll('.side')
            .forEach(el => (el.style.zIndex = 'auto'));
        side.style.zIndex = '9';
        side.classList.add('active');
    }

    close() {
        const side = document.querySelector(`#${this.id}`);
        if (!side) return;
        side.style.zIndex = 'auto';
        side.classList.remove('active');
    }

    closeAll() {
        document.querySelectorAll('.side').forEach(el => {
            el.style.zIndex = 'auto';
            el.classList.remove('active');
        });
    }

    update(data) {
        this.data = data;

        // Update header
        const newHeaderMarkup = this.headerMarkup();
        const newHeaderDOM = document
            .createRange()
            .createContextualFragment(newHeaderMarkup);
        const newHeaderElement =
            newHeaderDOM.querySelector('.side__title-wrap');
        const curHeaderElement =
            this.targetElement.querySelector('.side__title-wrap');
        if (!newHeaderElement.isEqualNode(curHeaderElement))
            curHeaderElement.innerHTML = newHeaderElement.innerHTML;

        // Update body
        const newBodyMarkup = this.markup();
        const newBodyElement = document
            .createRange()
            .createContextualFragment(newBodyMarkup);
        const curBodyElement = this.targetElement.querySelector('.side__inner');
        if (!newBodyElement.isEqualNode(curBodyElement.firstChild)) {
            if (
                newBodyMarkup instanceof Element ||
                newBodyMarkup instanceof HTMLDocument
            ) {
                curBodyElement.innerHTML = '';
                curBodyElement.insertAdjacentElement(
                    'beforeend',
                    newBodyMarkup
                );
            } else {
                curBodyElement.innerHTML = newBodyMarkup;
            }
        }

        // Reactivate Popups
        popup.activate(curBodyElement);
        select.activate(curBodyElement);
        numberInput.activate(curBodyElement);

        if (this.form) {
            forms.setEvents(this.form);
        }
    }
}
