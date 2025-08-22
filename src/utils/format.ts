export const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(
    isFinite(v as number) ? (v as number) : 0
  );

export const formatTelefoneBR = (digits: string) => {
  const d = (digits || '').replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
};

export const formatPsi = (v: number) => `${Number(v ?? 0).toFixed(1)} psi`;

export const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};

export const formatDateToISO = (date: string) => {
  if (!date.includes('/')) return date;
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`;
};

export const formatNumberInput = (value: string) => {
  // Allow digits, comma, and dot
  let formattedValue = value.replace(/[^0-9.,]/g, '');

  // Replace comma with dot for consistency
  formattedValue = formattedValue.replace(/,/g, '.');

  // Handle multiple dots: keep only the first one
  const parts = formattedValue.split('.');
  if (parts.length > 2) {
    formattedValue = parts[0] + '.' + parts.slice(1).join('');
  }

  return formattedValue;
};

export const parseNumberInput = (value: string) => {
  return parseFloat(value.replace(',', '.')) || 0;
};