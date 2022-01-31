class NumberInputElement {
    constructor(input) {
        this.input = input;
        this.regex = /^[1-9][0-9]*(\.)?\d{0,2}$/;
        this.viewVal = '';
        this.numVal = '';
        this.prevVal = '';
        this._events();
    }

    _events() {
        this.input.addEventListener('input', this._processInput.bind(this));

        this.input.addEventListener('blur', this._polishInput.bind(this));
    }

    _polishInput(e) {
        const [integer, digits = ''] = this.input.value.split('.');
        if (!integer) return;
        this.input.value = `${integer}.${digits.padEnd(2, '0')}`;
    }

    _processInput(e) {
        const cursorPosition = e.target.selectionStart;
        const initialCommasCount = (this.input.value.match(/,/g) || []).length;
        const value = this.input.value.replace(/,/g, '');
        if (!value) {
            this.prevVal = '';
            return;
        }

        if (!this.regex.test(value)) {
            this.input.value = this.prevVal;
        } else {
            this.viewVal = this._addCommas(value);
            this.prevVal = this.viewVal;
            this.input.value = this.viewVal;
        }

        // Place cursor
        const afterCommasCount = (this.viewVal.match(/,/g) || []).length;
        let position = cursorPosition - (initialCommasCount - afterCommasCount);
        if (position < 0) position = 0;
        this.input.setSelectionRange(position, position);
    }

    _addCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}

class NumberInput {
    activate() {
        document.querySelectorAll('.input--number input')?.forEach(input => {
            new NumberInputElement(input);
        });
    }
}

export default new NumberInput();
