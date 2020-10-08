import { BadRequestError } from "@chaiwala/common";

const defaultCurrencySymbol = "R";

const removeCurrencyFormatting = (
  price: string,
  currencySymbol: string = defaultCurrencySymbol
): number => {
  if (price.trim().length == 0) {
    throw new BadRequestError("Price", "Price is required");
  }

  price = price.replace(currencySymbol, "").replace(",", "");

  return Number.parseFloat(price);
};

export { defaultCurrencySymbol, removeCurrencyFormatting };
