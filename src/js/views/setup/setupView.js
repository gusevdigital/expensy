import View from '../View';
import icons from 'url:../../../imgs/icons.svg';
import forms from '../elements/forms';
import featuredBlock from '../elements/featuredBlock';

class SetupView extends View {
    constructor() {
        super();
        this.id = 'setup';
    }

    setParent() {
        this.parentElement = document.querySelector('.content__inner');
    }

    markup() {
        const block = featuredBlock.getBlock('Setup');

        this.form = forms.form(this.id);

        const formMarkup = `
        ${forms.field('number', {
            id: this.id,
            name: 'starting_budget',
            label: 'Starting budget',
            placeholder: '0.00',
        })}
        ${forms.field('select', {
            id: this.id,
            name: 'currency',
            label: 'Currency',
            options: [
                {
                    value: 'usd',
                    content: `<svg height="21" width="21"><use xlink:href="${icons}#icon-dollar"></use></svg><span>Dollar</span>`,
                    selected: true,
                },
                {
                    value: 'eur',
                    content: `<svg height="21" width="21"><use xlink:href="${icons}#icon-euro"></use></svg><span>Euro</span>`,
                },
                {
                    value: 'rub',
                    content: `<svg height="21" width="21"><use xlink:href="${icons}#icon-ruble"></use></svg><span>Ruble</span>`,
                },
            ],
        })}
        ${forms.submit("Let's go!")}
        `;

        this.form.insertAdjacentHTML('afterbegin', formMarkup);

        block.insertAdjacentElement('beforeend', this.form);

        return block;
    }
}

export default new SetupView();
