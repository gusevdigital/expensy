import { TIMEOUT_SECONDS, REFRESH_DELAY, CURRENCIES, LOCALES } from './config';

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long!`));
        }, s * 1000);
    });
};

export const AJAX = async function (action, uploadData = undefined) {
    try {
        const options = {
            action,
            nonce: themeData.ajax_nonce,
            ...uploadData,
        };

        const res = await Promise.race([
            fetch(themeData.ajax_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(options).toString(),
            }),
            timeout(TIMEOUT_SECONDS),
        ]);

        if (!res.ok) throw new Error(`Failed ajax request ${res.status}`);
        const data = await res.json();
        if (!+data.status) throw data;
        return data;
    } catch (err) {
        throw err;
    }
};

export const childOf = (c, p) => {
    if (!c) return false;
    if (c.isEqualNode(p)) return true;
    while ((c = c.parentNode) && !c.isEqualNode(p));
    return !!c;
};

export const refresh = () => {
    setTimeout(() => window.location.reload(true), REFRESH_DELAY);
};

//! ADD TIMEZONE FEATURE
export const getToday = (timezone = null) => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
        2,
        '0'
    )}-${String(today.getDate()).padStart(2, '0')}`;
};

export const checkFields = form => {};

export const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export const formatAmount = (amount, currency) => {
    currency = CURRENCIES.includes(currency) ? currency : 'USD';
    const locale = LOCALES[CURRENCIES.indexOf(currency)];
    if (locale === -1) locale = 'en';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

export const getEntriesSum = (entries, type = null) => {
    return Object.values(entries)
        .flat()
        .reduce((prev, curr) => {
            if (type)
                return curr.type === type
                    ? parseFloat(prev) + parseFloat(curr.amount)
                    : prev;
            else return parseFloat(prev) + parseFloat(curr.amount);
        }, 0);
};

export const truncate = (str, length) =>
    str.length > length ? `${str.substring(0, length)}...` : str;

export const getPrevNextMonth = (type, currMont, currYear) => {
    let month, year;
    if (type === 'prev') {
        month = !(parseInt(currMont) - 1) ? 12 : parseInt(currMont) - 1;
        year = !(parseInt(currMont) - 1)
            ? parseInt(currYear) - 1
            : parseInt(currYear);
    }
    if (type === 'next') {
        month = parseInt(currMont) + 1 > 12 ? 1 : parseInt(currMont) + 1;
        year =
            parseInt(currMont) + 1 > 12
                ? parseInt(currYear) + 1
                : parseInt(currYear);
    }

    return month && year ? { month, year } : false;
};
