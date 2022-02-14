import SideView from '../sideView';
import icons from 'url:../../../imgs/icons.svg';
import forms from '../elements/forms';
import popup from '../elements/popup';
import { COLORS, CAT_MAX_LENGTH } from '../../config';

export default class SideCatsView extends SideView {
    constructor(type) {
        super();
        this.type = type;
        this.id = `${this.type}-cats`;
    }

    setParent() {
        this.parentElement = document.querySelector('.sides');
    }

    headerMarkup() {
        return `
        <div class="side__nav">
            <a href="#" data-side-close="${this.id}">
                <svg height="21" width="21">
                    <use xlink:href="${icons}#icon-close"></use>
                </svg>
            </a>
        </div>
        <div class="side__title-wrap">
            <div class="side__subtitle text-${
                this.type === 'exp' ? 'cinnabar' : 'dingley'
            }">${this.type === 'exp' ? 'Expense' : 'Income'}</div>
            <h2 class="side__title">Categories</h2>
        </div>
        `;
    }

    markup() {
        const markup = document.createElement('div');
        markup.classList.add('cats');

        this.form = forms.form(this.id);

        const cats = this.data.cats
            ? this.data.cats.filter(cat => cat.type === this.type)
            : [];

        const formMarkup = `
        ${forms.field('select', {
            id: this.id,
            name: 'color',
            label: 'Color',
            options: Object.entries(COLORS).map((color, i) => {
                return {
                    value: color[0],
                    content: `<div class="cat"><span class="cat-icon bg-${color[0]}"></span>${color[1]}</div>`,
                    selected: i === 0,
                };
            }),
            required: true,
        })}
        ${forms.field('text', {
            id: this.id,
            name: 'name',
            label: 'Name',
            required: true,
            maxlength: CAT_MAX_LENGTH,
        })}
        ${forms.field('hidden', {
            id: this.id,
            name: 'type',
            value: this.type,
        })}
        ${forms.submit('Add category')}
        `;

        this.form.insertAdjacentHTML('afterbegin', formMarkup);
        forms.setEvents(this.form);

        const catsMarkup = `
        <h3 class="side__heading">Current list</h3>
        <ul class="cat-list">
        ${cats
            .map(
                cat => `
        <li class="cat-list__item" data-id="${cat.id}">
            <span class="cat-list__item__move">
            <a href="#" data-move="up">
                <svg height="21" width="21">
                <use xlink:href="${icons}#icon-up"></use>
                </svg>
            </a>
            <a href="#" data-move="down">
                <svg height="21" width="21">
                <use xlink:href="${icons}#icon-down"></use>
                </svg>
            </a>
            </span>
            <div class="cat">
            <span class="cat-icon bg-${
                cat.color
            }"></span><span class="cat-name" data-name="${
                    cat.name
                }" contenteditable>${cat.name}</span>
            </div>
            ${
                !Number.parseInt(cat.fixed)
                    ? `
                    <a href="#" class="popup">
                        <svg height="14" width="14">
                            <use xlink:href="${icons}#icon-close-small"></use>
                        </svg>
                        <div class="popup__content popup__content--right">
                            <div class="question">
                            <div class="question__text">Are you sure?</div>
                            <button
                                class="btn-small btn-small--cinnabar cat-list__item--delete"
                            >
                                Delete
                            </button>
                            </div>
                        </div>
                    </a>
                    `
                    : ''
            }
        </li>
        `
            )
            .join('')}
        </ul>
        `;

        markup.insertAdjacentElement('beforeend', this.form);
        markup.insertAdjacentHTML('beforeend', catsMarkup);

        popup.activate(markup);

        return markup;
    }

    addHandlerDeleteCat(handler) {
        this.targetElement.addEventListener('click', e => {
            const deleteBtn = e.target.closest('.cat-list__item--delete');
            if (!deleteBtn) return;
            const id = deleteBtn.closest('li.cat-list__item').dataset.id;
            handler(id, this.type);
        });
    }

    addHandlerOrderCats(handler) {
        this.targetElement
            .querySelectorAll('.cat-list__item__move a')
            .forEach(el => {
                el.addEventListener('click', e => {
                    e.preventDefault();
                    const el = e.currentTarget;
                    const parentEl = el.closest('.cat-list__item');
                    if (!parentEl) return;
                    if (el.dataset.move === 'down') {
                        const nextEl = parentEl.nextElementSibling;
                        if (!nextEl) return;
                        nextEl.insertAdjacentElement('afterend', parentEl);
                    }
                    if (el.dataset.move === 'up') {
                        const prevEl = parentEl.previousElementSibling;
                        if (!prevEl) return;
                        prevEl.insertAdjacentElement('beforebegin', parentEl);
                    }

                    const catsParentEl = parentEl.closest('.cat-list');
                    if (!catsParentEl) return;
                    const allCatsEl =
                        catsParentEl.querySelectorAll('.cat-list__item');
                    if (!allCatsEl) return;

                    const data = {
                        type: this.type,
                        cats: [],
                    };
                    allCatsEl.forEach(el => data.cats.push(el.dataset.id));
                    handler(data);
                });
            });
    }

    addHandlerEditCat(handler) {
        this.targetElement.querySelectorAll('.cat-name').forEach(el => {
            el.addEventListener('keydown', e => {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    e.target.blur();
                    this._handleEditCat(handler, e.target);
                    return false;
                }
            });
            el.addEventListener('input', e => {
                if (e.target.textContent.length > CAT_MAX_LENGTH) {
                    e.target.textContent = e.target.textContent.slice(
                        0,
                        CAT_MAX_LENGTH
                    );
                    const range = document.createRange();
                    const sel = window.getSelection();

                    range.setStart(e.target.childNodes[0], CAT_MAX_LENGTH);
                    range.collapse(true);

                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            });

            el.addEventListener('focusout', e => {
                this._handleEditCat(handler, e.target);
            });
        });
    }

    _handleEditCat(handler, el) {
        const catEl = el.closest('.cat-list__item');
        if (!catEl) return;
        const id = catEl.dataset.id;
        if (!id) return;
        const oldName = el.dataset.name;
        const newName = el.textContent;
        if (!newName) {
            el.textContent = oldName;
            return;
        }
        if (oldName !== newName) {
            el.dataset.name = newName;
            handler({
                name: newName,
                type: this.type,
                id,
            });
        }
    }
}
