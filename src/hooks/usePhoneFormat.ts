import { useState, useCallback } from 'react';

export const usePhoneFormat = () => {
  const [phone, setPhone] = useState('');

  const formatPhone = useCallback((value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const limited = numbers.slice(0, 11);
    
    // Aplica a formatação
    if (limited.length <= 2) {
      return `(${limited}`;
    } else if (limited.length <= 6) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    } else if (limited.length <= 10) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
    } else {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
    }
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    const formatted = formatPhone(value);
    setPhone(formatted);
  }, [formatPhone]);

  return {
    phone,
    setPhone,
    handlePhoneChange,
    formatPhone
  };
};
