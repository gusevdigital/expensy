import SideView from '../sideView';
import forms from '../elements/forms';

class SideRegisterView extends SideView {
    constructor() {
        super();
        this.id = 'register';
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
            <h2 class="side__title">Register</h2>
        </div>
        `;
    }

    markup() {
        this.form = forms.form(this.id);

        const markup = `
        ${forms.field('text', {
            id: this.id,
            name: 'name',
            label: 'Your name',
            autocomplete: 'given-name',
            required: true,
        })}
        ${forms.field('text', {
            id: this.id,
            name: 'email',
            label: 'Email',
            autocomplete: 'email',
            required: true,
        })}
        ${forms.field('password', {
            id: this.id,
            name: 'password',
            label: 'Password',
            autocomplete: 'new-password',
            required: true,
            note: 'Must be at least 12 characters.',
        })}
        ${forms.field('password', {
            id: this.id,
            name: 'confirm_password',
            label: 'Confirm password',
            autocomplete: 'new-password',
            required: true,
        })}
        ${forms.submit('Register')}
        `;

        this.form.insertAdjacentHTML('afterbegin', markup);
        forms.setEvents(this.form);
        return this.form;
    }
}
export default new SideRegisterView();
