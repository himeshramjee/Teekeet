import { BadRequestError } from "../errors/bad-request-error";

export const removeCurrencyFormatting = (
  price: string
): number => {
  if (!price || price.trim().length == 0) {
    throw new BadRequestError("Price", "Price is required");
  }

  var regexCurrencyValueOnly = /[^\d\.]/g;
  price = price.replace(regexCurrencyValueOnly, "");

  return Number.parseFloat(price);
};

export const formatCurrency = (price: number, locale: string = "en-ZA", currencyCode: string = "ZAR"): string => {
  if (!price) {
    throw new BadRequestError("Price", "Price is required");
  }

  var formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode
  });

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/formatToParts
  // Holy smokes.
  var priceString = formatter.formatToParts(price).map(({type, value}) => { 
    switch (type) {
      case "literal": {
        // console.log(`Char code per formatter: ${value.charCodeAt(0)}.`);            // [Output] 160
        // console.log(`Char code per normal string literal: ${" ".charCodeAt(0)}.`);  // [Output] 32

        return ' '; // Magic line that bring back world peace.
      };
      case 'group': return `,`;
      case 'decimal': return `.`;
      default : return value; 
    } 
  }).reduce((string, part) => string + part);

  return priceString;
};