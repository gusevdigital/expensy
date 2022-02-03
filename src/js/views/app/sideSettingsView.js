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
            name: 'new_password',
            label: 'New password',
            autocomplete: 'new-password',
            required: true,
        })}
        ${forms.field('password', {
            id: this.id,
            name: 'confirm_new_password',
            label: 'Confirm new password',
            autocomplete: 'new-password',
            required: true,
        })}
        ${forms.field('select', {
            id: this.id,
            name: 'currency',
            label: 'Currency',
            options: [
                {
                    value: 'usd',
                    content: `<svg height="21" width="21"><use xlink:href="${icons}#icon-dollar"></use></svg><span>Dollar</span>`,
                    selected: this.data.account.currency === 'usd',
                },
                {
                    value: 'eur',
                    content: `<svg height="21" width="21"><use xlink:href="${icons}#icon-euro"></use></svg><span>Euro</span>`,
                    selected: this.data.account.currency === 'eur',
                },
                {
                    value: 'rub',
                    content: `<svg height="21" width="21"><use xlink:href="${icons}#icon-ruble"></use></svg><span>Ruble</span>`,
                    selected: this.data.account.currency === 'rub',
                },
            ],
        })}
        ${forms.submit('Update')}
        `;

        this.form.insertAdjacentHTML('afterbegin', markup);
        forms.setEvents(this.form);
        return this.form;
    }
}
export default new SideSettingsView();
