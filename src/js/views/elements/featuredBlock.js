class FeaturedBlock {
    getBlock(heading = '') {
        const block = document.createElement('div');
        block.classList.add('featured-block');

        if (heading) {
            const headingEl = document.createElement('h2');
            headingEl.classList.add('featured-block__title');
            headingEl.textContent = heading;
            block.insertAdjacentElement('beforeend', headingEl);
        }
        return block;
    }
}

export default new FeaturedBlock();
