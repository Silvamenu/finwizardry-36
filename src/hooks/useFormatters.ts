
import { useUserPreferences } from './useUserPreferences';

export function useFormatters() {
  const { preferences } = useUserPreferences();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(preferences.language, {
      style: 'currency',
      currency: preferences.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat(preferences.language, {
      dateStyle: 'medium'
    }).format(new Date(date));
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat(preferences.language, {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };

  return {
    formatCurrency,
    formatDate,
    formatPercentage
  };
}
