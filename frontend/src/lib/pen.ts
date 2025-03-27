
import currency from "currency.js"
export const PEN = (value: string) => currency(value, {
    symbol: "S/",
    separator: ",",
    decimal: ".",
    precision: 2
});