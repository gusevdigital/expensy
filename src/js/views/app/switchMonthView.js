import View from '../View';
import { monthNames, getPrevNextMonth } from '../../helpers';

class SwitchMonthView extends View {
    constructor() {
        super();
    }

    setParent() {
        this.parentElement = document.querySelector('#switch-month');
    }

    markup() {
        const prevMonth = getPrevNextMonth(
            'prev',
            this.data.current_date.month,
            this.data.current_date.year
        );
        const nextMonth = getPrevNextMonth(
            'next',
            this.data.current_date.month,
            this.data.current_date.year
        );

        return `
        <button class="btn-link switch-month__btn" data-month="prev">${
            monthNames[prevMonth.month - 1]
        } ${prevMonth.year}</button>
        <button class="btn-link switch-month__btn" data-month="next">${
            monthNames[nextMonth.month - 1]
        } ${nextMonth.year}</button>
        `;
    }

    addHandlerSwitchMonth(handler) {
        this.targetElement.addEventListener('click', e => {
            const btn = e.target.closest('.switch-month__btn');
            if (!btn) return;
            const month = btn.dataset.month;
            handler(month);
        });
    }
}
export default new SwitchMonthView();
