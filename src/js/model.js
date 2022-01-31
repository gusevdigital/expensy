import { AJAX } from './helpers';

class Model {
    constructor() {
        this.state = [];
    }

    async initState() {
        try {
            const data = await AJAX('init_state');
            this.state = data.response;
        } catch (err) {
            console.log(err);
        }
    }

    async login(data) {
        try {
            const response = await AJAX('login', data);
            return response;
        } catch (err) {
            throw err;
        }
    }

    async logout() {
        try {
            const response = await AJAX('logout');
            return response;
        } catch (err) {
            throw err;
        }
    }

    async reset(data) {
        try {
            const response = await AJAX('reset', data);
            return response;
        } catch (err) {
            throw err;
        }
    }

    async register(data) {
        try {
            const response = await AJAX('register', data);
            return response;
        } catch (err) {
            throw err;
        }
    }

    async setup(data) {
        try {
            const response = await AJAX('setup', data);
            if (response.status) {
                this.state.account.currency = data.currency;
            }
            return response;
        } catch (err) {
            throw err;
        }
    }

    async addEntry(type, data) {
        try {
            console.log(data);
            const response = await AJAX(
                `add_${type === 'inc' ? 'income' : 'expense'}`,
                data
            );
            if (!response.response) throw 'No ID for entry.';
            this._stateAddEntry(response, data, type);
            return response;
        } catch (err) {
            throw err;
        }
    }

    _stateAddEntry(response, data, type) {
        const entryDate = new Date(data.date);
        if (
            entryDate.getFullYear() < parseInt(this.state.current_date.year) ||
            entryDate.getMonth() + 1 < parseInt(this.state.current_date.month)
        ) {
            if (type === 'inc')
                this.state.starting_budget =
                    parseFloat(this.state.starting_budget) +
                    parseFloat(String(data.amount).replace(',', ''));
            else if (type === 'exp')
                this.state.starting_budget =
                    parseFloat(this.state.starting_budget) -
                    parseFloat(String(data.amount).replace(',', ''));
        } else if (
            entryDate.getFullYear() ===
                parseInt(this.state.current_date.year) &&
            entryDate.getMonth() + 1 === parseInt(this.state.current_date.month)
        ) {
            const id = response.response;
            const entry = {
                ...data,
                amount: parseFloat(String(data.amount).replaceAll(',', '')),
                id,
                type,
            };
            if (!this.state.entries) {
                this.state.entries = {};
                this.state.entries[entry.date] = [entry];
            } else if (this.state.entries.hasOwnProperty(entry.date))
                this.state.entries[entry.date].push(entry);
            else this.state.entries[entry.date] = [entry];
        }
    }
}

export default new Model();
