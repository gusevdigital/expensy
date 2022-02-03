import SideView from '../sideView';
import icons from 'url:../../../imgs/icons.svg';
import forms from '../elements/forms';
import { getToday } from '../../helpers';

class SideIncomeView extends SideView {
    constructor() {
        super();
        this.id = 'add_income';
    }

    setParent() {
        this.parentElement = document.querySelector('.sides');
    }

    headerMarkup() {
        return `
        <div class="side__nav">
            <a href="#" data-side-close="add_income" class="btn-link">Add expense</a>
        </div>
        <div class="side__title-wrap">
            <h2 class="side__title">Income</h2>
        </div>
        `;
    }

    markup() {
        this.form = forms.form(this.id);

        const cats = this.data.cats
            ? this.data.cats.filter(cat => cat.type === 'inc')
            : [];

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
                open: 'inc-cats',
            },
        })}
        ${forms.field('textarea', {
            id: this.id,
            name: 'note',
            label: 'Note',
        })}
        ${forms.submit('Add income', 'success')}
        `;

        this.form.insertAdjacentHTML('afterbegin', markup);
        forms.setEvents(this.form);
        return this.form;
    }
}
export default new SideIncomeView();
