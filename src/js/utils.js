
export const isNotEmptyArray = value => Array.isArray(value) && value.length > 0;
export function qs(selector) {
    return document.querySelector(selector);
}
