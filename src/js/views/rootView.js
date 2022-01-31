import View from './View';

class RootView extends View {
    constructor() {
        super();
    }

    setParent() {
        this.parentElement = document.querySelector('#root');
    }

    markup() {
        return `
        <div class="main">
            <div class="header"></div>
            <div class="content">
                <div id="month-switch"></div>
                <div class="content__inner">
                    <div id="summary" class="content__section"></div>
                    <div id="expense-table" class="content__section"></div>
                    <div id="income-table" class="content__section"></div>
                </div>
            </div>
        </div>
        <div class="sides"></div>
        `;
    }

    cleanRoot() {
        this.render();
    }

    resetRoot() {
        this.cleanRoot();
        this.makeRootWide(false);
    }
}

export default new RootView();
