import TableView from './tableView';

class TableIncomeView extends TableView {
    constructor() {
        super();
        this.type = 'inc';
        this.id = 'income';
    }

    setParent() {
        this.parentElement = document.querySelector('#income-table');
    }

    markup() {
        const table = this.getTableMarkup();

        return `
        <h4 class="content__section__title">Income</h4>
        ${table}
        `;
    }
}
export default new TableIncomeView();
