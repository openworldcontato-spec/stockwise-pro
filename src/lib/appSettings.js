const STORE_SETTINGS_KEY = 'stockwise_store_settings';
const RECEIPT_SETTINGS_KEY = 'stockwise_receipt_settings';
export const APP_SETTINGS_UPDATED_EVENT = 'stockwise:settings-updated';

export const defaultStoreSettings = {
  store_name: 'StockWise PRO Loja',
  address: 'Rua da Empresa, 123',
  phone: '+55 (11) 99999-9999',
  email: 'loja@stockwisepro.com',
  tax_rate: 0,
  currency: 'BRL'
};

export const defaultReceiptSettings = {
  receipt_header: 'Obrigado pela sua compra!',
  receipt_footer: 'Volte sempre',
  show_tax_details: true,
  show_store_logo: true,
  store_logo: ''
};

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const safeParse = (value, fallback) => {
  try {
    if (!value) return fallback;
    return { ...fallback, ...JSON.parse(value) };
  } catch (error) {
    console.warn('Não foi possível carregar as configurações salvas:', error);
    return fallback;
  }
};

const notifySettingsUpdated = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(APP_SETTINGS_UPDATED_EVENT));
  }
};

export const loadStoreSettings = () => {
  if (!canUseStorage()) return defaultStoreSettings;
  return safeParse(window.localStorage.getItem(STORE_SETTINGS_KEY), defaultStoreSettings);
};

export const loadReceiptSettings = () => {
  if (!canUseStorage()) return defaultReceiptSettings;
  return safeParse(window.localStorage.getItem(RECEIPT_SETTINGS_KEY), defaultReceiptSettings);
};

export const saveStoreSettings = (settings) => {
  const normalizedSettings = {
    ...defaultStoreSettings,
    ...settings,
    tax_rate: Number(settings.tax_rate) || 0,
    currency: settings.currency || 'BRL'
  };

  if (canUseStorage()) {
    window.localStorage.setItem(STORE_SETTINGS_KEY, JSON.stringify(normalizedSettings));
  }

  notifySettingsUpdated();
  return normalizedSettings;
};

export const saveReceiptSettings = (settings) => {
  const normalizedSettings = {
    ...defaultReceiptSettings,
    ...settings,
    store_logo: settings.store_logo || ''
  };

  if (canUseStorage()) {
    window.localStorage.setItem(RECEIPT_SETTINGS_KEY, JSON.stringify(normalizedSettings));
  }

  notifySettingsUpdated();
  return normalizedSettings;
};

export const clearSavedAppSettings = () => {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(STORE_SETTINGS_KEY);
  window.localStorage.removeItem(RECEIPT_SETTINGS_KEY);
  notifySettingsUpdated();
};
