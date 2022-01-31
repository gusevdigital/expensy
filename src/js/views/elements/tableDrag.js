class TableDragElement {
    constructor(slider) {
        this.slider = slider;
        this.isDown = false;
        this.startX;
        this.scrollLeft;
        this.scrollSpeed = 2.5;

        this._events();
    }

    _events() {
        this.slider.addEventListener('mousedown', e => {
            this.isDown = true;
            this.slider.classList.add('dragging');
            this.startX = e.pageX - this.slider.offsetLeft;
            this.scrollLeft = this.slider.scrollLeft;
        });

        // this.slider.addEventListener('mouseleave', () => {
        //     this.isDown = false;
        //     this.slider.classList.remove('dragging');
        // });

        document.addEventListener('mouseup', () => {
            this.isDown = false;
            this.slider.classList.remove('dragging');
        });

        document.addEventListener('mousemove', e => {
            if (!this.isDown) return;
            e.preventDefault();
            const x = e.pageX - this.slider.offsetLeft;
            const walk = (x - this.startX) * this.scrollSpeed;
            this.slider.scrollLeft = this.scrollLeft - walk;
        });
    }
}

class TableDrag {
    activate() {
        document
            .querySelectorAll('.cal-table__container')
            .forEach(el => new TableDragElement(el));
    }
}

export default new TableDrag();
