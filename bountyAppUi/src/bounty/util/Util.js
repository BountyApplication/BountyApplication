export function toCurrency(number) {
    if(isNaN(number)) return;
    if(number == null) return;
    return `${number.toFixed(2)}€`;
}