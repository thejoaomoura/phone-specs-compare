type ClassValue = string | number | boolean | null | undefined | ClassValue[];

function toVal(mix: ClassValue): string {
  if (!mix) return '';
  if (typeof mix === 'string' || typeof mix === 'number') return String(mix);
  if (Array.isArray(mix)) return mix.map(toVal).filter(Boolean).join(' ');
  return '';
}

export function cn(...inputs: ClassValue[]): string {
  return inputs.map(toVal).filter(Boolean).join(' ');
}
