import { childOf } from '../helpers';
import { CLEAN_NOTICE_DELAY, CSS_TRANSITION_TIME } from '../config';

export default class View {
    render(data, clean = true) {
        this.data = data;
        this.setParent();
        this.targetElement = this.parentElement;
        const markup = this.markup();
        if (clean) this.clear();
        if (markup instanceof Element || markup instanceof HTMLDocument) {
            this.parentElement.insertAdjacentElement('beforeend', markup);
        } else {
            this.parentElement.insertAdjacentHTML('beforeend', markup);
        }
    }

    update(data) {
        this.data = data;
        // Generate new markup to compare with the current one
        const newMarkup = this.markup();

        const newDOM = document
            .createRange()
            .createContextualFragment(newMarkup);
        const newElements = [...newDOM.querySelectorAll('*')];
        const curElements = [...this.targetElement.querySelectorAll('*')];

        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];

            // Update changed TEXT
            if (
                !newEl.isEqualNode(curEl) &&
                newEl.firstChild &&
                newEl.firstChild.nodeValue &&
                newEl.firstChild.nodeValue.trim() !== ''
            ) {
                curEl.textContent = newEl.textContent;
            }

            // Update changed ATTRIBUTE
            if (!newEl.isEqualNode(curEl)) {
                [...newEl.attributes].forEach(attr =>
                    curEl.setAttribute(attr.name, attr.value)
                );
            }
        });
    }

    clear() {
        this.targetElement.innerHTML = '';
    }

    startLoading() {
        const loading = document.createElement('div');
        loading.classList.add('loading');
        this.targetElement.insertAdjacentElement('beforeend', loading);
    }

    stopLoading() {
        const loading = this.targetElement.querySelector('.loading');
        if (childOf(loading, this.targetElement)) {
            loading.remove();
        }
    }

    renderMessage(type = 'error', message) {
        // Check form
        if (!this.form) return;

        // Generate notice
        const notice = document.createElement('div');
        notice.classList.add('notice');
        notice.classList.add(`notice--${type}`);
        notice.textContent = message;

        // Remove all other error notices
        this.targetElement
            .querySelectorAll('.notice--error')
            .forEach(notice => notice.remove());

        // Place notice
        this.form.insertAdjacentElement('beforeend', notice);

        // Animate
        setTimeout(() => {
            notice.style.opacity = '1';
            notice.style.visibility = 'visible';
        }, 50);

        // Remove success notice after delay
        if (type === 'success')
            setTimeout(() => {
                notice.style.opacity = '0';
                notice.style.visibility = 'hidden';
                setTimeout(() => {
                    notice.remove();
                }, CSS_TRANSITION_TIME);
            }, CLEAN_NOTICE_DELAY);
    }

    cleanNotices() {
        this.targetElement.querySelectorAll('.notice').forEach(el => {
            el.remove();
        });
    }

    cleanForm() {
        this.form.querySelectorAll('input, textarea').forEach(input => {
            if (input.getAttribute('type') !== 'date') input.value = '';
        });
    }

    fieldsError(fields) {
        fields.forEach(field => {
            const fieldId = `${this.id}-${field}`;
            const input = this.targetElement.querySelector(`#${fieldId}`);
            if (input) {
                const inputParent = input.closest('.input');
                inputParent.classList.add('input--error');
            }
        });
    }

    makeRootWide(isWide = true) {
        const root = document.querySelector('#root');
        if (isWide) root.classList.add('wide');
        else root.classList.remove('wide');
    }

    addHandlerForm(handler) {
        this.form.addEventListener('submit', e => {
            e.preventDefault();

            const check = this.checkFields(e.target);
            if (!check.status) {
                this.renderMessage('error', check.message);
                return;
            }

            const data = new FormData(e.target);
            if (!data) return;
            const entries = Object.fromEntries(data.entries());

            handler(entries);
        });
    }

    checkFields(form) {
        if (!form) false;
        const response = {
            status: true,
            response: '',
        };

        // Check required fields
        form.querySelectorAll(
            'input[required], select[required], textarea[required]'
        ).forEach(input => {
            if (!input.value) {
                input.closest('.input')?.classList.add('input--error');
                response.status = false;
                response.message = 'Please fill out all required fields.';
            }
        });
        if (!response.status) return response;

        // Check Email fields
        form.querySelectorAll('[validate-email]').forEach(input => {
            if (
                !input.value.match(
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                )
            ) {
                input.closest('.input')?.classList.add('input--error');
                response.status = false;
                response.message = 'Please check your Email address.';
            }
        });
        if (!response.status) return response;

        // Check amount fields
        form.querySelectorAll('.input--number input').forEach(input => {
            if (
                !input.value
                    .replace(/,/g, '')
                    .match(/^[1-9][0-9]*(\.)?\d{0,2}$/)
            ) {
                input.closest('.input')?.classList.add('input--error');
                response.status = false;
                response.message = 'Wrong amount format.';
            }
        });
        if (!response.status) return response;

        return response;
    }
}
