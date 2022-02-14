import View from '../View';
import { formatAmount, truncate, formatDate } from '../../helpers';
import { CAT_MAX_LENGTH } from '../../config';

export default class TableView extends View {
    constructor() {
        super();
    }

    getTableMarkup() {
        const cats = this.data.cats
            ? this.data.cats.filter(cat => cat.type === this.type)
            : [];

        const numberDays = new Date(
            this.data.current_month.year,
            this.data.current_month.month,
            0
        ).getDate();
        const currentYear = this.data.current_month.year;
        const currentMonth = this.data.current_month.month;
        const dates = [];
        for (let i = 1; i <= numberDays; i++)
            dates.push(
                formatDate(`${currentYear}-${currentMonth}-${i}`, 'short')
            );

        const sums = new Array(numberDays).fill(0);

        const markup = `
        <div id="${this.id}-calendar" class="cal">
            <div class="cal-side">
                <div class="cal-side__item cal-side__item--title">
                    Category
                </div>
                ${cats
                    .map(
                        cat => `
                <div class="cal-side__item">
                    <div class="cat">
                        <span class="cat-icon bg-${
                            cat.color
                        }"></span><span class="cat-content"><span class="cat-content__title">${truncate(
                            cat.name.trim(),
                            CAT_MAX_LENGTH
                        )}</span><span class="cat-content__subtitle">${formatAmount(
                            Object.values(this.data.entries)
                                .flat()
                                .filter(entry => entry.cat === cat.id)
                                .reduce(
                                    (prev, curr) =>
                                        prev + parseFloat(curr.amount),
                                    0
                                ),
                            this.data.account.currency
                        )}</span></span>
                    </div>
                </div>
                `
                    )
                    .join('')}
                <div class="cal-side__item cal-side__item--title">
                    Total per day
                </div>
            </div>
            <div class="cal-table__container scroll">
                <table class="cal-table">
                    <tr>
                    ${dates
                        .map(
                            (date, i) =>
                                `<th class="${
                                    this.isToday(i) ? 'today' : ''
                                }">${date}</th>`
                        )
                        .join('')}
                    </tr>
                    ${cats
                        .map(cat => {
                            let row = '';
                            for (let i = 1; i <= numberDays; i++) {
                                const key = `${currentYear}-${String(
                                    currentMonth
                                ).padStart(2, '0')}-${String(i).padStart(
                                    2,
                                    '0'
                                )}`;
                                const sum = this.data.entries[key]
                                    ? this.data.entries[key]
                                          ?.filter(
                                              entry =>
                                                  entry.type === this.type &&
                                                  entry.cat === cat.id
                                          )
                                          ?.reduce(
                                              (prev, curr) =>
                                                  parseFloat(prev) +
                                                  parseFloat(curr.amount),
                                              0
                                          )
                                    : 0;
                                sums[i - 1] = sum
                                    ? sums[i - 1] + parseFloat(sum)
                                    : sums[i - 1];
                                row += `<td class="${
                                    this.isToday(i - 1) ? 'today' : ''
                                }">${
                                    sum
                                        ? `<button class="cal-table__entries btn-small btn-small--${
                                              cat.color
                                          }" data-cat="${
                                              cat.id
                                          }" data-day="${i}">${formatAmount(
                                              sum,
                                              this.data.account.currency
                                          )}</button>`
                                        : ''
                                }</td>`;
                            }
                            return `<tr>${row}</tr>`;
                        })
                        .join('')}
                    <tr>
                        ${sums
                            .map(
                                (sum, i) =>
                                    `<td class="${
                                        this.isToday(i) ? 'today' : ''
                                    }">${formatAmount(
                                        parseFloat(sum),
                                        this.data.account.currency
                                    )}</td>`
                            )
                            .join('')}
                    </tr>
                </table>
            </div>
        </div>
        `;

        return markup;
    }

    update(data) {
        this.data = data;
        // Generate new markup to compare with the current one
        const newMarkup = this.markup();

        const newDOM = document
            .createRange()
            .createContextualFragment(newMarkup);
        const newElements = [
            ...newDOM.querySelectorAll('.cal-side, .cal-table'),
        ];
        const curElements = [
            ...this.targetElement.querySelectorAll('.cal-side, .cal-table'),
        ];

        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];

            // Update changed TEXT
            if (!newEl.isEqualNode(curEl)) {
                curEl.innerHTML = newEl.innerHTML;
            }
        });
    }

    addHandlerShowEntries(handler) {
        this.targetElement.addEventListener('click', e => {
            const btn = e.target.closest('.cal-table__entries');
            if (!btn) return;
            e.preventDefault();
            const cat = btn.dataset.cat;
            const day = btn.dataset.day;
            handler(this.type, cat, day);
        });
    }
}
