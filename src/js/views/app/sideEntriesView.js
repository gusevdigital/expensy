import SideView from '../sideView';
import icons from 'url:../../../imgs/icons.svg';
import { formatAmount, formatDate } from '../../helpers';

class SideEntriesView extends SideView {
    constructor() {
        super();
        this.id = 'entries';
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
        ${
            typeof this.data.show_entries !== 'undefined'
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
            <h2>${formatDate(
                `${this.data.current_month.year}-${this.data.current_month.month}-${this.data.show_entries.day}`
            )}</h2>
            <div class="cat">
                <span class="cat-icon bg-${
                    this.data.cats.filter(
                        cat => cat.id === this.data.show_entries.cat
                    )[0].color
                }"></span>${
                      this.data.cats.filter(
                          cat => cat.id === this.data.show_entries.cat
                      )[0].name
                  }
            </div>
        </div>`
                : ''
        }
            
        </div>
        `;
    }

    markup() {
        if (typeof this.data.show_entries === 'undefined') return '';
        const cat = this.data.show_entries.cat;
        const type = this.data.show_entries.type;
        const day = this.data.show_entries.day;
        const entries = Object.values(this.data.entries)
            .flat()
            .filter(
                entry =>
                    parseInt(entry.cat) === parseInt(cat) &&
                    entry.type === type &&
                    parseInt(new Date(entry.date).getDate()) === parseInt(day)
            );

        return `
        <ul class="entries">
        ${entries
            .map(
                entry => `
        <li class="entry" data-id="${entry.id}">
            ${entry.note ? `<div class="entry__title">${entry.note}</div>` : ''}
            <div class="entry__amount">${formatAmount(
                entry.amount,
                this.data.account.curency
            )}</div>
            <div class="entry__actions">
            <div class="entry__actions__item">
                <button class="btn-link btn--edit">
                Edit
                </button>
            </div>
            <div class="entry__actions__item">
                <div class="popup btn-link">
                    Delete
                    <div class="popup__content popup__content--left">
                        <div class="question">
                        <div class="question__text">Are you sure?</div>
                        <button
                            class="btn-small btn-small--cinnabar btn--delete"
                        >
                            Delete
                        </button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </li>
        `
            )
            .join('')}
        <ul>
        `;
    }

    addHandlerShowEditEntry(handler) {
        this.targetElement.addEventListener('click', e => {
            const deleteBtn = e.target.closest('.btn--edit');
            if (!deleteBtn) return;
            const id = deleteBtn.closest('li.entry').dataset.id;
            handler(id);
        });
    }

    addHandlerDeleteEntry(handler) {
        this.targetElement.addEventListener('click', e => {
            const deleteBtn = e.target.closest('.btn--delete');
            if (!deleteBtn) return;
            const id = deleteBtn.closest('li.entry').dataset.id;
            handler(id);
        });
    }
}
export default new SideEntriesView();
