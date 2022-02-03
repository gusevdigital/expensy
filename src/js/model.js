import { AJAX, getPrevNextMonth } from './helpers';

class Model {
    constructor() {
        this.state = [];
    }

    async initState() {
        try {
            const response = await AJAX('init_state');
            if (response.status) this.state = response.response;
            else throw response.message;
        } catch (err) {
            console.log(err);
        }
    }

    async login(data) {
        try {
            console.log(data);
            const response = await AJAX('login', data);
            if (response.status) return response;
            else throw response.message;
        } catch (err) {
            throw err;
        }
    }

    async logout() {
        try {
            const response = await AJAX('logout');
            if (response.status) return response;
            else throw response.message;
        } catch (err) {
            throw err;
        }
    }

    async reset(data) {
        try {
            const response = await AJAX('reset', data);
            if (response.status) return response;
            else throw response.message;
        } catch (err) {
            throw err;
        }
    }

    async register(data) {
        try {
            const response = await AJAX('register', data);
            if (response.status) return response;
            else throw response.message;
        } catch (err) {
            throw err;
        }
    }

    async setup(data) {
        try {
            const response = await AJAX('setup', data);
            if (response.status) {
                this.state.starting_budget = data.starting_budget;
                this.state.account.currency = data.currency;
                return response;
            } else {
                throw response.message;
            }
        } catch (err) {
            throw err;
        }
    }

    async switchMonth(data) {
        try {
            const newMonth = getPrevNextMonth(
                data,
                this.state.current_month.month,
                this.state.current_month.year
            );

            const response = await AJAX('switch_month', newMonth);
            if (response.status) {
                this.state.entries = response.entries;
                this.state.starting_budget = response.starting_budget;
                this.state.current_month = {
                    month: newMonth.month,
                    year: newMonth.year,
                };
            } else throw response.message;

            return response;
        } catch (err) {
            throw err;
        }
    }

    async addEntry(type, data) {
        try {
            const response = await AJAX('add_entry', {
                ...data,
                type,
            });
            if (response.status) {
                if (!response.response) throw 'No ID for entry.';
                this._stateAddEntry(response, data, type);
                return response;
            } else {
                throw response.message;
            }
        } catch (err) {
            throw err;
        }
    }

    async deleteEntry(id) {
        try {
            const response = await AJAX('delete_entry', {
                id,
            });
            if (response.status) {
                let dateRemove, catRemove;

                const newEntries = Object.fromEntries(
                    Object.entries(this.state.entries).map(day => {
                        const newDay = day[1]
                            ? day[1].filter(entry => {
                                  if (parseInt(entry.id) === parseInt(id)) {
                                      dateRemove = entry.date;
                                      catRemove = entry.cat;
                                      return false;
                                  } else {
                                      return true;
                                  }
                              })
                            : [];
                        return [day[0], newDay.length ? newDay : false];
                    })
                );
                this.state.entries = newEntries ? newEntries : [];

                // Check if need to close SideEntriesView
                // Need to check if have entries for specific date with specific cat
                response.closeDay = !Object.values(this.state.entries)
                    .flat()
                    .filter(
                        entry =>
                            Number.parseInt(entry.cat) ===
                                Number.parseInt(catRemove) &&
                            new Date(entry.date).getDay() ===
                                new Date(dateRemove).getDay()
                    ).length;

                return response;
            } else {
                throw response.message;
            }
        } catch (err) {
            throw err;
        }
    }

    async editEntry(data) {
        try {
            const response = await AJAX('edit_entry', data);
            if (response.status) {
                this._stateEditEntry(data);
                return response;
            } else {
                throw response.message;
            }
            console.log(data);
        } catch (err) {
            throw err;
        }
    }

    async addCat(data) {
        try {
            const response = await AJAX('add_cat', data);
            if (response.status) {
                this._addCat(response.id, data);
                return response;
            } else {
                throw response.message;
            }
        } catch (err) {
            throw err;
        }
    }

    async deleteCat(id) {
        try {
            const response = await AJAX('delete_cat', {
                id,
            });
            if (response.status && response.state) {
                this.state = response.state;
                return response;
            } else {
                throw response.message;
            }
        } catch (err) {
            throw err;
        }
    }

    _stateAddEntry(response, data, type) {
        const entryDate = new Date(data.date);
        if (
            entryDate.getFullYear() < parseInt(this.state.current_month.year) ||
            entryDate.getMonth() + 1 < parseInt(this.state.current_month.month)
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
                parseInt(this.state.current_month.year) &&
            entryDate.getMonth() + 1 ===
                parseInt(this.state.current_month.month)
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

    _stateEditEntry(data) {
        // If date changed
        if (data.date !== data.prev_date) {
            // find the entry
            const entry = Object.values(this.state.entries)
                .flat()
                .find(entry => parseInt(entry.id) === parseInt(data.id));

            // Set the day if it doesn't exist
            if (typeof this.state.entries[data.date] === 'undefined')
                this.state.entries[data.date] = [];

            // Remove entry from the previous place
            this.state.entries = Object.fromEntries(
                Object.entries(this.state.entries).map(day => [
                    day[0],
                    day[1].filter(
                        entry =>
                            Number.parseInt(entry.id) !==
                            Number.parseInt(data.id)
                    ),
                ])
            );

            // Push new entry to the day object
            this.state.entries[data.date].unshift({
                ...entry,
                amount: Number.parseFloat(
                    String(data.amount).replaceAll(',', '')
                ),
                cat: data.cat,
                date: data.date,
                note: data.note,
            });
        } else {
            // If date isn't changed
            this.state.entries = Object.fromEntries(
                Object.entries(this.state.entries).map(day => [
                    day[0],
                    day[1].map(entry => {
                        return Number.parseInt(entry.id) ===
                            Number.parseInt(data.id)
                            ? {
                                  ...entry,
                                  amount: Number.parseFloat(
                                      String(data.amount).replaceAll(',', '')
                                  ),
                                  cat: data.cat,
                                  date: data.date,
                                  note: data.note,
                              }
                            : entry;
                    }),
                ])
            );
        }

        this.state.edit_entry = {
            ...this.state.edit_entry,
            amount: Number.parseFloat(String(data.amount).replaceAll(',', '')),
            cat: data.cat,
            date: data.date,
            note: data.note,
        };
    }

    _addCat(id, data) {
        this.state.cats = [
            ...this.state.cats,
            {
                id: String(id),
                name: data.name,
                type: data.type,
                color: data.color,
            },
        ];
    }
}

export default new Model();
