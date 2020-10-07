const defaultCurrencySymbol = "R";

const removeCurrencyFormatting = (
  price: string,
  currencySymbol: string = defaultCurrencySymbol
): Number => {
  price = price.replace(currencySymbol, "").replace(",", "");

  return Number.parseFloat(price);
};

export { defaultCurrencySymbol, removeCurrencyFormatting };
