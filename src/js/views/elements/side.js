class Side {
    activate(parent = null) {
        const target = parent ?? document;
        target.querySelectorAll('[data-side-open]').forEach(el => {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.dataset.sideOpen;
                const targetEl = document.querySelector(`#${targetId}`);
                if (!targetEl) return;
                document
                    .querySelectorAll('.side')
                    .forEach(el => (el.style.zIndex = 'auto'));
                targetEl.style.zIndex = '9';
                targetEl.classList.add('active');
            });
        });

        target.querySelectorAll('[data-side-close]').forEach(el => {
            el.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.dataset.sideClose;
                const targetEl = document.querySelector(`#${targetId}`);
                if (!targetEl) return;
                targetEl.style.zIndex = 'auto';
                targetEl.classList.remove('active');
            });
        });
    }
}

export default new Side();
