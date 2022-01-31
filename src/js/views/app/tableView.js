import View from '../View';
import { formatAmount, truncate } from '../../helpers';
import { CAT_TRUNCATE_LENGTH } from '../../config';

export default class TableView extends View {
    constructor() {
        super();
    }

    getTableMarkup() {
        const cats = this.data.cats.filter(cat => cat.type === this.type);

        const numberDays = new Date(
            this.data.current_date.year,
            this.data.current_date.month,
            0
        ).getDate();
        const currentYear = this.data.current_date.year;
        const currentMonth = this.data.current_date.month;
        const dates = [];
        for (let i = 1; i <= numberDays; i++)
            dates.push(`${currentMonth}/${i}`);

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
                        }"></span>${truncate(
                            cat.name.trim(),
                            CAT_TRUNCATE_LENGTH
                        )}
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
                    ${dates.map(date => `<th>${date}</th>`).join('')}
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
                                // Check if entries for this date exists
                                if (this.data.entries.hasOwnProperty(key)) {
                                    const sum = this.data.entries[key]
                                        .filter(
                                            entry =>
                                                entry.type === this.type &&
                                                entry.cat === cat.id
                                        )
                                        .reduce(
                                            (prev, curr) =>
                                                parseFloat(prev) +
                                                parseFloat(curr.amount),
                                            0
                                        );
                                    sums[i - 1] = sums[i - 1] + parseFloat(sum);
                                    row += `<td>${
                                        sum
                                            ? `<button class="btn-small btn-small--${
                                                  cat.color
                                              }" data-side-open="entries">${formatAmount(
                                                  sum,
                                                  this.data.account.currency
                                              )}</button>`
                                            : ''
                                    }</td>`;
                                } else {
                                    row += `<td></td>`;
                                }
                            }
                            return `<tr>${row}</tr>`;
                        })
                        .join('')}
                    <tr>
                        ${sums
                            .map(
                                sum =>
                                    `<td>${formatAmount(
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
}
