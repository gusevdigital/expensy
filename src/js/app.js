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
import switchMonthView from './views/app/switchMonthView';
import summaryView from './views/app/summaryView';
import sideExpenseView from './views/app/sideExpenseView';
import sideIncomeView from './views/app/sideIncomeView';
import sideEntriesView from './views/app/sideEntriesView';
import sideEditEntryView from './views/app/sideEditEntryView';
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
    static renderLoginPage() {
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
    static renderSetupPage() {
        // Render header
        headerView.render(model.state);

        // Render Setup screen
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
    static renderAppPage() {
        // Render App screen
        rootView.render();
        headerView.render(model.state);

        switchMonthView.render(model.state);
        summaryView.render(model.state);
        tableExpenseView.render(model.state);
        tableIncomeView.render(model.state);

        sideExpenseView.render(model.state);
        sideIncomeView.render(model.state);
        sideEntriesView.render(model.state);
        sideEditEntryView.render(model.state);

        // App screen handlers
        headerView.addHandlerLogout(App.controlLogout);
        switchMonthView.addHandlerSwitchMonth(App.controlSwitchMonth);
        sideExpenseView.addHandlerForm(App.controlAddExpense);
        sideIncomeView.addHandlerForm(App.controlAddIncome);
        sideEntriesView.addHandlerDeleteEntry(App.controlDeleteEntry);
        sideEntriesView.addHandlerShowEditEntry(App.controlShowEditEntry);
        tableExpenseView.addHandlerShowEntries(App.controlShowEntries);
        tableIncomeView.addHandlerShowEntries(App.controlShowEntries);

        // Activate elements
        App.activateElements();
    }

    // Helper
    static setupEditEntrySide() {
        sideEditEntryView.addHandlerForm(App.controlEditEntry);
    }
}

class App {
    constructor() {
        this.init();
    }

    /*
     * p
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
     * CONTROL LOGIN
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
            view.cleanForm();
            view.renderMessage('success', response.message);
            refresh();
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
            setupView.cleanForm();
            model.state.setup = 1;
            rootView.makeRootWide(false);
            Page.renderAppPage();
        } catch (err) {
            setupView.renderMessage('error', err.message);
            if (err.fields) setupView.fieldsError(err.fields);
        } finally {
            rootView.stopLoading();
        }
    }

    /*
     * CONTROL MONTH SWITCH
     */
    static async controlSwitchMonth(data) {
        try {
            rootView.startLoading();
            await model.switchMonth(data);
            console.log(model.state);
            switchMonthView.update(model.state);
            summaryView.update(model.state);
            tableExpenseView.update(model.state);
            tableIncomeView.update(model.state);
            sideEntriesView.closeAll();
        } catch (err) {
            console.log(err);
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
            sideExpenseView.cleanForm();
            sideExpenseView.renderMessage('success', response.message);
            summaryView.update(model.state);
            tableExpenseView.update(model.state);
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

            sideIncomeView.cleanForm();
            sideIncomeView.renderMessage('success', response.message);
            summaryView.update(model.state);
            tableIncomeView.update(model.state);
        } catch (err) {
            sideIncomeView.renderMessage('error', err.message);
            console.log(err);
            if (err.fields) sideIncomeView.fieldsError(err.fields);
        } finally {
            sideIncomeView.stopLoading();
        }
    }

    /*
     * CONTROL SHOW ENTRIES
     */
    static controlShowEntries(type, cat, day) {
        model.state = {
            ...model.state,
            show_entries: {
                type,
                cat,
                day,
            },
        };
        sideEntriesView.update(model.state);
        sideEntriesView.open();
        sideEditEntryView.close();
    }

    /*
     * CONTROL DELETE ENTRY
     */
    static async controlDeleteEntry(id) {
        try {
            sideEntriesView.startLoading();
            const response = await model.deleteEntry(id);
            console.log('Response:', response);
            console.log('state', model.state);
            sideEntriesView.update(model.state);
            summaryView.update(model.state);
            tableExpenseView.update(model.state);
            tableIncomeView.update(model.state);
            if (response.closeDay) sideEntriesView.close();
        } catch (err) {
            console.log(err);
        } finally {
            sideEntriesView.stopLoading();
        }
    }

    /*
     * CONTROL SHOW EDIT ENTRY
     */
    static controlShowEditEntry(id) {
        const edit_entry = Object.values(model.state.entries)
            .flat()
            .find(entry => parseInt(entry.id) === parseInt(id));
        model.state = {
            ...model.state,
            edit_entry,
        };
        sideEditEntryView.update(model.state);
        Page.setupEditEntrySide();
        sideEditEntryView.open();
    }

    /*
     * CONTROL EDIT ENTRY
     */
    static async controlEditEntry(data) {
        try {
            sideEditEntryView.startLoading();
            const response = await model.editEntry(data);

            sideEditEntryView.update(model.state);
            Page.setupEditEntrySide();
            sideEditEntryView.renderMessage('success', response.message);
            sideEntriesView.update(model.state);
            summaryView.update(model.state);
            tableIncomeView.update(model.state);
            tableExpenseView.update(model.state);
        } catch (err) {
            sideEditEntryView.renderMessage('error', err.message);
            console.log(err);
            if (err.fields) sideEditEntryView.fieldsError(err.fields);
        } finally {
            sideEditEntryView.stopLoading();
        }
    }
}

const app = new App();
