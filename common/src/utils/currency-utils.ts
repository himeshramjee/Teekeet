import { BadRequestError } from "../errors/bad-request-error";

export const defaultCurrencySymbol = "R";

export const removeCurrencyFormatting = (
  price: string,
  currencySymbol: string = defaultCurrencySymbol
): number => {
  if (price.trim().length == 0) {
    throw new BadRequestError("Price", "Price is required");
  }

  price = price.replace(currencySymbol, "").replace(",", "");

  return Number.parseFloat(price);
};
