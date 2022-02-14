import SideView from '../sideView';
import icons from 'url:../../../imgs/icons.svg';
import forms from '../elements/forms';

class SideSettingsDeleteView extends SideView {
    constructor() {
        super();
        this.id = 'settings-delete';
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
        <h2 class="side__title">Are you sure?</h2>
        `;
    }

    markup() {
        this.form = forms.form(this.id);

        const markup = `
        <div class="btn-group">
            <button class="btn btn-primary" data-side-close="${this.id}">
                No!
            </button>
            <button type="submit" class="btn-link" id="delete-account">
                Yes, delete account :(
            </button>
        </div>
        `;

        this.form.insertAdjacentHTML('afterbegin', markup);
        forms.setEvents(this.form);
        return this.form;
    }

    addHandlerDeleteAccount(handler) {
        document
            .querySelector('#delete-account')
            .addEventListener('click', e => {
                e.preventDefault();
                handler();
            });
    }
}
export default new SideSettingsDeleteView();
