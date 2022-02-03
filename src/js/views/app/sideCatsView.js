import SideView from '../sideView';
import icons from 'url:../../../imgs/icons.svg';
import forms from '../elements/forms';
import popup from '../elements/popup';
import { COLORS } from '../../config';

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
            <a href="#" class="cat-list__item--up">
                <svg height="21" width="21">
                <use xlink:href="${icons}#icon-up"></use>
                </svg>
            </a>
            <a href="#" class="cat-list__item--down">
                <svg height="21" width="21">
                <use xlink:href="${icons}#icon-down"></use>
                </svg>
            </a>
            </span>
            <div class="cat">
            <span class="cat-icon bg-${cat.color}"></span>${cat.name}
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
}
