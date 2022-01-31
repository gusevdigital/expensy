import SideView from '../sideView';
import icons from 'url:../../../imgs/icons.svg';
import forms from '../elements/forms';
import { getToday } from '../../helpers';

class SideExpenseView extends SideView {
    constructor() {
        super();
        this.id = 'add_expense';
    }

    setParent() {
        this.parentElement = document.querySelector('.sides');
    }

    headerMarkup() {
        return `
        <div class="side__nav">
            <a href="#" data-side-open="add_income" class="btn-link">Add income</a>
            <a href="#" data-side-close="${this.id}" class="hide-for-large">
                <svg height="21" width="21">
                    <use xlink:href="${icons}#icon-close"></use>
                </svg>
            </a>
        </div>
        <h2 class="side__title">Expense</h2>
        `;
    }

    markup() {
        this.form = forms.form(this.id);

        const cats = this.data.cats.filter(cat => cat.type === 'exp');

        const markup = `
        ${forms.field('date', {
            id: this.id,
            name: 'date',
            label: 'Date',
            required: true,
            value: getToday(),
        })}
        ${forms.field('number', {
            id: this.id,
            name: 'amount',
            label: 'Amount',
            required: true,
            placeholder: '0.00',
            icon: `<svg class="input__icon" height="21" width="21"><use xlink:href="${icons}#icon-dollar"></use></svg>`,
        })}
        ${forms.field('select', {
            id: this.id,
            name: 'cat',
            label: 'Category',
            options: cats.map((cat, i) => {
                return {
                    value: cat.id,
                    content: `<div class="cat"><span class="cat-icon bg-${cat.color}"></span>${cat.name}</div>`,
                    selected: i === 0,
                };
            }),
            btn: {
                title: 'Manage categories',
                open: 'expenses_cats',
            },
            required: true,
        })}
        ${forms.field('textarea', {
            id: this.id,
            name: 'note',
            label: 'Note',
        })}
        ${forms.submit('Add expense')}
        `;

        this.form.insertAdjacentHTML('afterbegin', markup);
        forms.setEvents(this.form);
        return this.form;
    }
}
export default new SideExpenseView();
