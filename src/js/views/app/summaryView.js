import View from '../View';
import { monthNames, formatAmount, getEntriesSum } from '../../helpers';
import { SUM_FONT_SWITCH_CHAR } from '../../config';

class SummaryView extends View {
    constructor() {
        super();
    }

    setParent() {
        this.parentElement = document.querySelector('#summary');
    }

    markup() {
        const income = getEntriesSum(this.data.entries, 'inc');
        const expense = getEntriesSum(this.data.entries, 'exp');
        const available =
            parseFloat(this.data.starting_budget) +
            parseFloat(income) -
            parseFloat(expense);

        const startingText = formatAmount(
            this.data.starting_budget,
            this.data.account.currency
        );

        const incomeText = formatAmount(income, this.data.account.currency);

        const expenseText = formatAmount(expense, this.data.account.currency);

        const availableText = formatAmount(
            available,
            this.data.account.currency
        );

        return `
        <div class="content__section">
            <h4 class="content__section__title">${
                monthNames[parseInt(this.data.current_month.month) - 1]
            } ${this.data.current_month.year}</h4>
            <ul id="summary" class="summary ${
                startingText.length > SUM_FONT_SWITCH_CHAR ||
                incomeText.length > SUM_FONT_SWITCH_CHAR ||
                expenseText.length > SUM_FONT_SWITCH_CHAR ||
                availableText.length > SUM_FONT_SWITCH_CHAR
                    ? 'summary--small'
                    : ''
            }">
                <li>
                    <span class="summary__heading">Starting budget</span>
                    <span class="summary__data" id="summary_starting">${startingText}</span>
                </li>
                <li>
                    <span class="summary__heading">Income</span>
                    <span class="summary__data" id="summary_income">${incomeText}</span>
                </li>
                <li>
                    <span class="summary__heading">Expenses</span>
                    <span class="summary__data" id="summary_expenses">${expenseText}</span>
                </li>
                <li>
                    <span class="summary__heading">Available budget</span>
                    <span class="summary__data" id="summary_available">${availableText}</span>
                </li>
            </ul>
        </div>
        `;
    }
}
export default new SummaryView();
