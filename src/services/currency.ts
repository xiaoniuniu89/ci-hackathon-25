/**
 * Currency conversion and formatting service
 *
 * Base currency: EUR (European Euro)
 * All meal values are estimated in EUR, then converted to user's local currency
 */

import type { CurrencyInfo, UserLocation } from '@/types/location.types'

/**
 * Currency data with conversion rates from EUR
 * Rates are approximate and can be updated periodically
 * Last updated: December 2025
 */
const CURRENCY_DATA: Record<string, Omit<CurrencyInfo, 'code'>> = {
  // US Dollar
  'USD': { symbol: '$', rate: 1.1, name: 'US Dollar' },

  // British Pound
  'GBP': { symbol: '£', rate: 0.85, name: 'British Pound' },

  // Euro (base currency)
  'EUR': { symbol: '€', rate: 1, name: 'Euro' },

  // Canadian Dollar
  'CAD': { symbol: 'C$', rate: 1.5, name: 'Canadian Dollar' },

  // Australian Dollar
  'AUD': { symbol: 'A$', rate: 1.65, name: 'Australian Dollar' },

  // Japanese Yen
  'JPY': { symbol: '¥', rate: 160, name: 'Japanese Yen' },

  // Swiss Franc
  'CHF': { symbol: 'CHF', rate: 0.95, name: 'Swiss Franc' },

  // New Zealand Dollar
  'NZD': { symbol: 'NZ$', rate: 1.8, name: 'New Zealand Dollar' },

  // Swedish Krona
  'SEK': { symbol: 'kr', rate: 11.5, name: 'Swedish Krona' },

  // Norwegian Krone
  'NOK': { symbol: 'kr', rate: 11.8, name: 'Norwegian Krone' },

  // Danish Krone
  'DKK': { symbol: 'kr', rate: 7.45, name: 'Danish Krone' },
}

/**
 * Map country codes to their primary currency
 * Used as fallback if API doesn't return currency
 */
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  // North America
  'US': 'USD',
  'CA': 'CAD',

  // Europe - Euro countries
  'IE': 'EUR', 'FR': 'EUR', 'DE': 'EUR', 'ES': 'EUR', 'IT': 'EUR',
  'PT': 'EUR', 'NL': 'EUR', 'BE': 'EUR', 'AT': 'EUR', 'FI': 'EUR',
  'GR': 'EUR', 'LU': 'EUR', 'MT': 'EUR', 'CY': 'EUR', 'SI': 'EUR',
  'SK': 'EUR', 'EE': 'EUR', 'LV': 'EUR', 'LT': 'EUR',

  // Europe - Non-Euro
  'GB': 'GBP',
  'CH': 'CHF',
  'SE': 'SEK',
  'NO': 'NOK',
  'DK': 'DKK',

  // Oceania
  'AU': 'AUD',
  'NZ': 'NZD',

  // Asia
  'JP': 'JPY',
}

/**
 * Get currency information for a country code
 * @param countryCode - ISO 2-letter country code (e.g., "US", "GB")
 */
export function getCurrencyForCountry(countryCode: string): CurrencyInfo {
  const currencyCode = COUNTRY_TO_CURRENCY[countryCode] || 'USD'
  return {
    code: currencyCode,
    ...(CURRENCY_DATA[currencyCode] || CURRENCY_DATA['USD'])
  }
}

/**
 * Get currency information by currency code
 * @param currencyCode - Currency code (e.g., "USD", "EUR", "GBP")
 */
export function getCurrencyInfo(currencyCode: string): CurrencyInfo {
  return {
    code: currencyCode,
    ...(CURRENCY_DATA[currencyCode] || CURRENCY_DATA['USD'])
  }
}

/**
 * Convert EUR amount to target currency
 * @param eurAmount - Amount in EUR
 * @param targetCurrency - Target currency code (e.g., "USD", "GBP")
 * @returns Converted amount (rounded)
 */
export function convertFromEUR(eurAmount: number, targetCurrency: string): number {
  const currency = CURRENCY_DATA[targetCurrency] || CURRENCY_DATA['USD']
  return Math.round(eurAmount * currency.rate)
}

/**
 * Format amount with currency symbol
 * @param amount - Numeric amount
 * @param currencyCode - Currency code (e.g., "USD", "EUR")
 * @returns Formatted string (e.g., "$10", "€8", "£7")
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = CURRENCY_DATA[currencyCode] || CURRENCY_DATA['USD']
  return `${currency.symbol}${amount}`
}

/**
 * Format amount with currency symbol from user location object
 * @param amount - Numeric amount
 * @param userLocation - User location object with currency/currencySymbol
 * @returns Formatted string (e.g., "$10", "€8", "£7")
 */
export function formatCurrencyFromLocation(amount: number, userLocation: UserLocation): string {
  const symbol = userLocation.currencySymbol || '$'
  return `${symbol}${amount}`
}
