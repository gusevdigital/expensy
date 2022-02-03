import View from './View';
import logo from 'url:../../imgs/logo.png';
import icons from 'url:../../imgs/icons.svg';

class HeaderView extends View {
    constructor() {
        super();
    }

    setParent() {
        this.parentElement = document.querySelector('.header');
    }

    markup() {
        return `
          <img src="${logo}" class="header__logo" title="Expensy - best app for your personal budget." />
          ${
              this.data.logged && this.data.setup
                  ? `
            <div class="nav">
            <div class="nav-item">
                <div class="nav-item__link">
                    <span class="nav-item__icon">
                        <svg height="14" width="14">
                            <use xlink:href="${icons}#icon-user"></use>
                        </svg>
                    </span>
                    <span id="user__name" class="nav-item__title show-for-large">
                        ${this.data.account.name}
                    </span>
                </div>
                <ul class="nav-item__dropdown">
                    <li><a href="#settings" data-side-open="settings" class="btn-link">Settings</a></li>
                    <li><a href="#logout" id="logout" class="btn-link">Log out</a></li>
                </ul>
            </div>
            <div class="nav-item hide-for-large">
                <a href="#" data-side-open="add_expense" class="nav-item__link">
                    <span class="nav-item__icon">
                        <svg height="14" width="14">
                            <use xlink:href="${icons}#icon-plus"></use>
                        </svg>
                    </span>
                </a>
            </div>
            </div>
            `
                  : `
            <div class="header__nav">
            <a href="#" data-side-open="login" class="btn-link hide-for-large">Login</a>
            </div>
            `
          }`;
    }

    addHandlerLogout(handler) {
        this.targetElement
            .querySelector('#logout')
            ?.addEventListener('click', e => {
                e.preventDefault();
                handler();
            });
    }
}

export default new HeaderView();
