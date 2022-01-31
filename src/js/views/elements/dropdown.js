import { childOf } from '../../helpers';

class DropdownElement {
    constructor(el) {
        this.el = el;
        this.link = el.querySelector('.nav-item__link');
        this._events();
    }

    _events() {
        this.link.addEventListener('click', this._processShow.bind(this));
        document.addEventListener('click', this._processHide.bind(this));
    }

    _processShow(e) {
        const dropdown = this.el.querySelector('.nav-item__dropdown');
        if (!dropdown) return;
        e.preventDefault();
        this.show();
    }

    _processHide(e) {
        if (
            this.el.classList.contains('active') &&
            !e.target.closest('.nav-item__link') &&
            !childOf(e.target, this.link)
        ) {
            this.hide();
        }
    }

    show() {
        this.el.classList.add('active');
    }

    hide() {
        this.el.classList.remove('active');
    }
}

class Dropdown {
    activate() {
        document
            .querySelectorAll('.nav-item')
            ?.forEach(el => new DropdownElement(el));
    }
}

export default new Dropdown();
