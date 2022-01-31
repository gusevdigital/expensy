import SideView from '../sideView';
import icons from 'url:../../../imgs/icons.svg';
import forms from '../elements/forms';

class SideLoginView extends SideView {
    constructor() {
        super();
        this.id = 'login';
        this.copyrightText =
            '© Copyright by <a href="https://gusevdigital.com/" target="_blank">Gusev Digital</a>';
    }

    setParent() {
        this.parentElement = document.querySelector('.sides');
    }

    headerMarkup() {
        return `
        <div class="side__nav">
            <a href="#" data-side-open="register" class="btn-link">Register</a>
            <a href="#" data-side-close="login" class="hide-for-large">
                <svg height="21" width="21">
                    <use xlink:href="${icons}#icon-close"></use>
                </svg>
            </a>
        </div>
        <h2 class="side__title">Login</h2>
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
            validate: 'email'
        })}
        ${forms.field('password', {
            id: this.id,
            name: 'password',
            label: 'Password',
            autocomplete: 'current-password',
            required: true,
            btn: {
                title: 'Forgot your password?',
                open: 'reset',
            },
        })}
        ${forms.field('checkbox', {
            id: this.id,
            name: 'remember',
            label: 'Remember me',
        })}
        ${forms.submit('Login')}
        `;

        this.form.insertAdjacentHTML('afterbegin', markup);
        forms.setEvents(this.form);
        return this.form;
    }
}
export default new SideLoginView();
