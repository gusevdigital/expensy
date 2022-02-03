import SideView from '../sideView';
import forms from '../elements/forms';

class SideResetView extends SideView {
    constructor() {
        super();
        this.id = 'reset';
    }

    setParent() {
        this.parentElement = document.querySelector('.sides');
    }

    headerMarkup() {
        return `
        <div class="side__nav">
            <a href="#" data-side-close="${this.id}" class="btn-link">Login</a>
        </div>
        <div class="side__title-wrap">
            <h2 class="side__title">Reset password</h2>
        </div>
        `;
    }

    markup() {
        this.form = forms.form(this.id);

        const markup = `
        ${forms.field('text', {
            id: this.id,
            name: 'email',
            label: 'Email',
            autocomplete: 'email',
            required: true,
        })}
        ${forms.submit('Reset password')}
        `;

        this.form.insertAdjacentHTML('afterbegin', markup);
        forms.setEvents(this.form);
        return this.form;
    }
}
export default new SideResetView();
