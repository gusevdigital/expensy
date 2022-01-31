class Forms {
    form(id) {
        const form = document.createElement('form');
        form.id = id + '-form';
        form.action = '?';
        form.setAttribute('type', 'post');

        return form;
    }

    field(type, data) {
        if (
            type === 'text' ||
            type === 'password' ||
            type === 'number' ||
            type === 'date'
        ) {
            return `
            <div class="input input--${type}">
                ${
                    data.label
                        ? `<label for="${data.id}-${data.name}">${data.label}</label>`
                        : ''
                }
                <div class="input__group">
                    ${data.icon ? data.icon : ''}
                    <input type="${type === 'number' ? 'text' : type}" value="${
                data.value ? data.value : ''
            }" class="input__field" id="${data.id}-${data.name}" name="${
                data.name
            }" placeholder="${
                data.placeholder ? data.placeholder : ''
            }" autocomplete="${data.autocomplete ? data.autocomplete : ''}" ${
                data.required ? 'required' : ''
            } ${data.validate ? `validate-${data.validate}` : ''} />
                </div>
                ${
                    data.btn
                        ? `<a href="${data.btn.link ? data.btn.link : '#'}" ${
                              data.btn.open
                                  ? `data-side-open="${data.btn.open}"`
                                  : ''
                          } ${
                              data.btn.close
                                  ? `data-side-close="${data.btn.close}"`
                                  : ''
                          } class="btn-link">${data.btn.title}</a>`
                        : ''
                }
                
            </div>
            `;
        }
        if (type === 'textarea') {
            return `
            <div class="input input--${type}">
            ${
                data.label
                    ? `<label for="${data.id}-${data.name}">${data.label}</label>`
                    : ''
            }
            <div class="input__group">
            <textarea class="input__field" id="${data.id}-${data.name}" name="${
                data.name
            }" ${data.required ? 'required' : ''} ${data.validate ? `validate-${data.validate}` : ''}>${
                data.value ? data.value : ''
            }</textarea>
            </div>
            </div>
            `;
        }
        if (type === 'checkbox') {
            return `
            <div class="input input--${type}">
                <input name="${data.name}" type="${type}" id="${data.id}-${
                data.name
            }" ${data.checked ? 'checked' : ''} />
                <label for="${data.id}-${data.name}">${data.label}</label>
            </div>
            `;
        }
        if (type === 'select') {
            return `
            <div class="input input--${type}">
                ${
                    data.label
                        ? `<label for="${data.id}-${data.name}">${data.label}</label>`
                        : ''
                }
                <ul class="input__group custom-select" data-id="${data.id}-${
                data.name
            }" data-name="${data.name}">
                ${data.options
                    .map(option => {
                        return `<li data-value="${option.value}" ${
                            option.selected ? 'data-selected=true' : ''
                        }>${option.content}</li>`;
                    })
                    .join('')}
                </ul>
                ${
                    data.btn
                        ? `<a href="${data.btn.link ? data.btn.link : '#'}" ${
                              data.btn.open
                                  ? `data-side-open="${data.btn.open}"`
                                  : ''
                          } ${
                              data.btn.close
                                  ? `data-side-close="${data.btn.close}"`
                                  : ''
                          } class="btn-link">${data.btn.title}</a>`
                        : ''
                }
            </div>
            `;
        }

        // Return nothing if unknown type
        return '';
    }

    submit(text, color = 'primary') {
        return `
        <button type="submit" class="btn btn-${color}">${text}</button>
        `;
    }

    setEvents(form) {
        form.querySelectorAll('input, select, textarea').forEach(el =>
            el.addEventListener('input', e => {
                const inputParent = el.closest('.input');
                if (inputParent.classList.contains('input--error')) {
                    inputParent.classList.remove('input--error');
                }
            })
        );
    }
}

export default new Forms();
