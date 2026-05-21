import { loadStoreSettings } from './appSettings';

export const formatCurrency = (value = 0) => {
  const numericValue = Number(value) || 0;
  const currency = loadStoreSettings().currency || 'BRL';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency
  }).format(numericValue);
};

export const formatDateTime = (value, options = {}) => {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: options.dateStyle || 'short',
    timeStyle: options.timeStyle || 'short'
  }).format(date);
};

export const formatShortDate = (value) => {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short'
  }).format(date);
};

export const translateSaleStatus = (status) => ({
  completed: 'Concluída',
  pending: 'Pendente',
  refunded: 'Reembolsada',
  voided: 'Cancelada'
}[status] || status || '-');

export const translatePaymentMethod = (method) => ({
  cash: 'Dinheiro',
  card: 'Cartão',
  mobile: 'Pix / Mobile'
}[method] || method || '-');

export const translatePriority = (priority) => ({
  urgent: 'Urgente',
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa'
}[priority] || priority || '-');
