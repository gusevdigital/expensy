import icons from 'url:../../../imgs/icons.svg';
import { childOf } from '../../helpers';

class SelectElement {
    constructor(el) {
        this.el = el;

        this.wrapper;
        this.select;
        this.cSelect;
        this.cSelected;
        this.cOptions;

        this._generateMarkup();

        this._events();

        this.el.remove();
    }

    _generateMarkup() {
        this.el.style.display = 'none';

        this.wrap = document.createElement('div');
        this.wrap.classList.add('custom-select__wrapper');

        this.select = document.createElement('select');
        this.select.style.display = 'none';
        this.select.name = this.el.dataset.name;

        this.cSelect = document.createElement('div');
        this.cSelect.id = this.el.dataset.id;
        this.cSelect.setAttribute('class', this.el.getAttribute('class'));

        this.cSelected = document.createElement('div');
        this.cSelected.classList.add('custom-select__selected');

        this.cOptions = document.createElement('div');
        this.cOptions.classList.add('custom-select__options');
        this.cOptions.classList.add('hidden');

        this.el.querySelectorAll('li').forEach((li, index) => {
            const value = li.dataset.value;
            const content = li.innerHTML;

            const option = document.createElement('option');
            option.value = value;
            option.innerHTML = content;

            const customOption = document.createElement('div');
            customOption.classList.add('custom-select__option');

            customOption.dataset.value = value;
            customOption.dataset.index = index;
            customOption.innerHTML = content;

            if (li.dataset.selected) {
                this.cSelected.innerHTML = li.innerHTML;
                // option.selected = 'selected';
                console.log('Value', value);
                this.select.value = value;
                customOption.classList.add('selected');
            }

            this.select.insertAdjacentElement('beforeend', option);
            this.cOptions.insertAdjacentElement('beforeend', customOption);
        });

        this.cSelect.insertAdjacentElement('beforeend', this.cSelected);
        this.cSelect.insertAdjacentHTML(
            'beforeend',
            `<svg viewBox="0 0 21 21" class="custom-select__icon" height="21" width="21"><use xlink:href="${icons}#icon-down"></use></svg>`
        );

        this.wrap.insertAdjacentElement('beforeend', this.select);
        this.wrap.insertAdjacentElement('beforeend', this.cSelect);
        this.wrap.insertAdjacentElement('beforeend', this.cOptions);

        this.el.insertAdjacentElement('afterend', this.wrap);
    }

    _events() {
        // On selected click open options
        this.cSelect.addEventListener('click', e => {
            e.currentTarget.classList.toggle('active');
            this.cOptions.classList.toggle('hidden');
        });

        // On option click change option
        this.cOptions.addEventListener('click', e => {
            const option = e.target.closest('.custom-select__option');
            if (option) {
                if (option.classList.contains('selected')) return;
                // Unselect all options and select the clicked one
                this.cOptions
                    .querySelectorAll('.custom-select__option')
                    .forEach(el => el.classList.remove('selected'));
                option.classList.add('selected');

                // Change currently selected content
                this.cSelected.innerHTML = option.innerHTML;

                // Update the value for the actual select input
                this.select.selectedIndex = option.dataset.index;
            }
        });

        // On window click hide all options
        document.addEventListener('click', e => {
            if (
                this.cSelect.classList.contains('active') &&
                !e.target.closest('.custom-select') &&
                !childOf(e.target, this.cSelect)
            ) {
                this._closeOptions();
            }
        });
    }

    _closeOptions() {
        this.cOptions.classList.add('hidden');
        this.cSelect.classList.remove('active');
    }
}

class Select {
    activate() {
        document
            .querySelectorAll('.custom-select')
            .forEach(el => new SelectElement(el));
    }
}

export default new Select();
