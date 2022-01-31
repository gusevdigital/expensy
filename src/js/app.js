if (module.hot) {
    module.hot.accept();
}
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../sass/main.scss';

import { REFRESH_DELAY, CLEAN_NOTICE_DELAY } from './config';
import { refresh } from './helpers';

// General
import model from './model';
import rootView from './views/rootView';
import headerView from './views/headerView';

// Login page
import lottieView from './views/login/lottieView';
import sideLoginView from './views/login/sideLoginView';
import sideResetView from './views/login/sideResetView';
import sideRegisterView from './views/login/sideRegisterView';

// App page
import summaryView from './views/app/summaryView';
import sideExpenseView from './views/app/sideExpenseView';
import sideIncomeView from './views/app/sideIncomeView';
import tableIncomeView from './views/app/tableIncomeView';
import tableExpenseView from './views/app/tableExpenseView';

// Setup page
import setupView from './views/setup/setupView';

// Elements
import side from './views/elements/side';
import dropdown from './views/elements/dropdown';
import select from './views/elements/select';
import numberInput from './views/elements/numberInput';
import tableDrag from './views/elements/tableDrag';

class Page {
    /*
     * RENDER LOGIN
     */
    static async renderLoginPage() {
        // Render header
        headerView.render(model.state);

        // Render Login screen
        lottieView.render();
        sideLoginView.render();
        sideResetView.render();
        sideRegisterView.render();

        // Login screen handlers
        sideLoginView.addHandlerForm(data =>
            App.processLoginForm(
                data,
                sideLoginView,
                model.login,
                true,
                'Error login'
            )
        );
        sideResetView.addHandlerForm(data =>
            App.processLoginForm(
                data,
                sideResetView,
                model.reset,
                false,
                'Error resetting password'
            )
        );
        sideRegisterView.addHandlerForm(data =>
            App.processLoginForm(
                data,
                sideRegisterView,
                model.register,
                true,
                'Error registering'
            )
        );

        // Activate elements
        App.activateElements();
    }

    /*
     * RENDER SETUP
     */
    static async renderSetupPage() {
        // Render header
        headerView.render(model.state);

        // Render Setup screen
        console.log('render Setup');
        setupView.makeRootWide(true);
        setupView.render();

        // Render screen handler
        setupView.addHandlerForm(App.controlSetup);

        // Activate elements
        App.activateElements();
    }

    /*
     * RENDER APP
     */
    static async renderAppPage() {
        // Render App screen
        console.log('render App');
        rootView.render();
        headerView.render(model.state);

        summaryView.render(model.state);
        tableExpenseView.render(model.state);
        tableIncomeView.render(model.state);

        sideExpenseView.render(model.state);
        sideIncomeView.render(model.state);

        // App screen handlers
        headerView.addHandlerLogout(App.controlLogout);
        sideExpenseView.addHandlerForm(App.controlAddExpense);
        sideIncomeView.addHandlerForm(App.controlAddIncome);

        // Activate elements
        App.activateElements();
    }
}

class App {
    constructor() {
        this.init();
    }

    /*
     * INIT
     */
    async init() {
        try {
            // Render root
            rootView.render();
            rootView.startLoading();

            // Set state
            await model.initState();

            // Render page
            if (!model.state.logged) Page.renderLoginPage();
            if (model.state.logged && !model.state.setup)
                Page.renderSetupPage();
            if (model.state.logged && model.state.setup) Page.renderAppPage();

            console.log(model.state);
        } catch (err) {
            console.log(err);
        } finally {
            rootView.stopLoading();
        }
    }

    /*
     * ACTIVATE ELEMENTS
     */
    static activateElements() {
        side.activate();
        dropdown.activate();
        select.activate();
        numberInput.activate();
        tableDrag.activate();
    }

    /*
     * CONTROL LOGOUT
     */
    static async controlLogout() {
        try {
            rootView.startLoading();
            await model.logout();
            refresh();
        } catch (err) {
            console.log(err);
            rootView.stopLoading();
        }
    }

    /*
     * CONTROL LOGIN FORMS
     */
    static async processLoginForm(
        data,
        view,
        modelHandler,
        doRefresh,
        errorMessage
    ) {
        try {
            view.startLoading();

            const response = await modelHandler(data);
            if (response.status && response.message) {
                view.cleanForm();
                view.renderMessage('success', response.message);
                if (doRefresh) refresh();
            } else {
                throw errorMessage;
            }
        } catch (err) {
            view.renderMessage('error', err.message);
            if (err.fields) view.fieldsError(err.fields);
        } finally {
            view.stopLoading();
        }
    }

    /*
     * CONTROL SETUP
     */
    static async controlSetup(data) {
        try {
            rootView.startLoading();
            const response = await model.setup(data);
            if (response.status && response.message) {
                setupView.cleanForm();
                // setupView.renderMessage('success', response.message);
                model.state.setup = 1;
                rootView.makeRootWide(false);
                Page.renderAppPage();
                // refresh();
                console.log('Success');
            } else {
                throw 'Error setting up';
            }
        } catch (err) {
            setupView.renderMessage('error', err.message);
            if (err.fields) setupView.fieldsError(err.fields);
        } finally {
            rootView.stopLoading();
        }
    }

    /*
     * CONTROL ADD EXPENSE
     */
    static async controlAddExpense(data) {
        try {
            sideExpenseView.startLoading();
            const response = await model.addEntry('exp', data);
            if (response.status) {
                sideExpenseView.cleanForm();
                sideExpenseView.renderMessage('success', response.message);
                summaryView.update(model.state);
                tableExpenseView.update(model.state);
            } else {
                throw 'Error adding expense';
            }
        } catch (err) {
            sideExpenseView.renderMessage('error', err.message);
            console.log(err);
            if (err.fields) sideExpenseView.fieldsError(err.fields);
        } finally {
            sideExpenseView.stopLoading();
        }
    }

    /*
     * CONTROL ADD INCOME
     */
    static async controlAddIncome(data) {
        try {
            sideIncomeView.startLoading();
            const response = await model.addEntry('inc', data);
            if (response.status) {
                sideIncomeView.cleanForm();
                sideIncomeView.renderMessage('success', response.message);
                summaryView.update(model.state);
                tableIncomeView.update(model.state);
            } else {
                throw 'Error adding income';
            }
        } catch (err) {
            sideIncomeView.renderMessage('error', err.message);
            console.log(err);
            if (err.fields) sideIncomeView.fieldsError(err.fields);
        } finally {
            sideIncomeView.stopLoading();
        }
    }
}

const app = new App();
