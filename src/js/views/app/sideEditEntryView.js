import SideView from '../sideView';
import icons from 'url:../../../imgs/icons.svg';
import forms from '../elements/forms';
import { formatAmount, formatDate } from '../../helpers';

class SideEditEntryView extends SideView {
    constructor() {
        super();
        this.id = 'edit_entry';
    }

    setParent() {
        this.parentElement = document.querySelector('.sides');
    }

    headerMarkup() {
        const entry = this.data.edit_entry;
        return `
        <div class="side__nav">
            <a href="#" data-side-close="${this.id}">
                <svg height="21" width="21">
                    <use xlink:href="${icons}#icon-close"></use>
                </svg>
            </a>
        </div>
        <div class="side__title-wrap">
        ${
            typeof this.data.edit_entry !== 'undefined'
                ? `<div class="side__subtitle text-${
                      this.data.show_entries.type === 'exp'
                          ? 'cinnabar'
                          : 'dingley'
                  }">${
                      this.data.show_entries.type === 'exp'
                          ? 'Expense'
                          : 'Income'
                  }</div>
           
            <div class="side__title">
                <h2>${formatAmount(
                    entry.amount,
                    this.data.account.currency
                )}</h2>
                <div class="side__title__description">${formatDate(
                    entry.date
                )}</div>
                
            </div>
            `
                : ''
        }
        </div>
        `;
    }

    markup() {
        if (typeof this.data.edit_entry === 'undefined') return '';

        const entry = this.data.edit_entry;
        const date = new Date(entry.date);

        const cats = this.data.cats.filter(cat => cat.type === entry.type);

        this.form = forms.form(this.id);

        const markup = `
        ${forms.field('date', {
            id: this.id,
            name: 'date',
            label: 'Date',
            required: true,
            value: entry.date.match(/\d{4}-\d{1,2}-\d{1,2}/)[0],
        })}
        ${forms.field('number', {
            id: this.id,
            name: 'amount',
            label: 'Amount',
            required: true,
            placeholder: '0.00',
            icon: `<svg class="input__icon" height="21" width="21"><use xlink:href="${icons}#icon-dollar"></use></svg>`,
            value: Number.parseFloat(entry.amount).toFixed(2),
        })}
        ${forms.field('select', {
            id: this.id,
            name: 'cat',
            label: 'Category',
            options: cats.map((cat, i) => {
                return {
                    value: cat.id,
                    content: `<div class="cat"><span class="cat-icon bg-${cat.color}"></span>${cat.name}</div>`,
                    selected:
                        Number.parseInt(cat.id) === Number.parseInt(entry.cat),
                };
            }),
            required: true,
        })}
        ${forms.field('textarea', {
            id: this.id,
            name: 'note',
            label: 'Note',
            value: entry.note ? entry.note : '',
        })}
        ${forms.field('hidden', {
            id: this.id,
            name: 'id',
            value: entry.id,
        })}
        ${forms.field('hidden', {
            id: this.id,
            name: 'prev_data',
            value: entry.date.match(/\d{4}-\d{1,2}-\d{1,2}/)[0],
        })}
        ${forms.submit('Update')}
        `;

        this.form.insertAdjacentHTML('afterbegin', markup);
        return this.form;
    }
}
export default new SideEditEntryView();
