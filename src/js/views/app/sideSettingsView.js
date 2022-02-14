import SideView from '../sideView';
import icons from 'url:../../../imgs/icons.svg';
import forms from '../elements/forms';

class SideSettingsView extends SideView {
    constructor() {
        super();
        this.id = 'settings';
    }

    setParent() {
        this.parentElement = document.querySelector('.sides');
    }

    headerMarkup() {
        return `
        <div class="side__nav">
            <a href="#" data-side-close="${this.id}">
              <svg height="21" width="21">
                <use xlink:href="${icons}#icon-close"></use>
              </svg>
            </a>
          </div>
          <div class="side__title-wrap">
             <h2 class="side__title">Settings</h2>
          </div>
        `;
    }

    markup() {
        this.form = forms.form(this.id);

        const markup = `
        ${forms.field('text', {
            id: this.id,
            name: 'name',
            label: 'Name',
            required: true,
            value: this.data.account.name,
        })}
        <div class="input input--disabled">
            <label>Email</label>
            <div>${this.data.account.email}</div>
        </div>
        ${forms.field('password', {
            id: this.id,
            name: 'password',
            label: 'New password',
            note: '<strong>Will refresh the page</strong>. Leave blank if you do not wish to update your password.',
            autocomplete: 'new-password',
        })}
        ${forms.field('password', {
            id: this.id,
            name: 'confirm_password',
            label: 'Confirm new password',
            autocomplete: 'new-password',
        })}
        ${forms.field('select', {
            id: this.id,
            name: 'currency',
            label: 'Currency',
            options: [
                {
                    value: 'usd',
                    content: `<svg height="21" width="21"><use xlink:href="${icons}#icon-usd"></use></svg><span>Dollar</span>`,
                    selected: this.data.account.currency === 'usd',
                },
                {
                    value: 'eur',
                    content: `<svg height="21" width="21"><use xlink:href="${icons}#icon-eur"></use></svg><span>Euro</span>`,
                    selected: this.data.account.currency === 'eur',
                },
                {
                    value: 'rub',
                    content: `<svg height="21" width="21"><use xlink:href="${icons}#icon-rub"></use></svg><span>Ruble</span>`,
                    selected: this.data.account.currency === 'rub',
                },
            ],
        })}
        ${forms.field('hidden', {
            id: this.id,
            name: 'prev_currency',
            value: this.data.account.currency,
        })}
        ${forms.field('hidden', {
            id: this.id,
            name: 'prev_name',
            value: this.data.account.name,
        })}
        <div class="btn-group">
            ${forms.submit('Update')}
            <button class="btn-link" data-side-open="settings-delete">
                Delete account
            </button>
        </div>
        `;

        this.form.insertAdjacentHTML('afterbegin', markup);
        forms.setEvents(this.form);
        return this.form;
    }
}
export default new SideSettingsView();
