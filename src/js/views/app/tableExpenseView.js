import TableView from './tableView';

class TableExpenseView extends TableView {
    constructor() {
        super();
        this.type = 'exp';
        this.id = 'expense';
    }

    setParent() {
        this.parentElement = document.querySelector('#expense-table');
    }

    markup() {
        const table = this.getTableMarkup();

        return `
        <h4 class="content__section__title">Expense</h4>
        ${table}
        `;
    }
}
export default new TableExpenseView();
