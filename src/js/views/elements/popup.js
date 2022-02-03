import { childOf } from '../../helpers';

class PopupElement {
    constructor(el) {
        this.el = el;
        this.popup = this.el.querySelector('.popup__content');
        this._events();
    }

    _events() {
        this.el.addEventListener('click', this._processShow.bind(this));
        document.addEventListener('click', this._processHide.bind(this));
    }

    _processShow(e) {
        e.preventDefault();
        this.show();
    }

    _processHide(e) {
        if (
            this.popup.classList.contains('active') &&
            !e.target.closest('.popup') &&
            !childOf(e.target, this.el)
        ) {
            this.hide();
        }
    }

    show() {
        this.popup.classList.add('active');
    }

    hide() {
        this.popup.classList.remove('active');
    }
}

class Popup {
    activate(parent = null) {
        if (!parent)
            document
                .querySelectorAll('.popup')
                ?.forEach(el => new PopupElement(el));
        else
            parent
                .querySelectorAll('.popup')
                ?.forEach(el => new PopupElement(el));
    }
}

export default new Popup();
