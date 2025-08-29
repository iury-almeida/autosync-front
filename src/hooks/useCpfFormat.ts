import { useState, useCallback } from 'react';

export const useCpfFormat = () => {
  const [cpf, setCpf] = useState('');

  const formatCpf = useCallback((value: string | undefined | null) => {
    // Verifica se o valor é válido
    if (!value || typeof value !== 'string') {
      return '';
    }
    
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const limited = numbers.slice(0, 11);
    
    // Aplica a formatação
    if (limited.length <= 3) {
      return limited;
    } else if (limited.length <= 6) {
      return `${limited.slice(0, 3)}.${limited.slice(3)}`;
    } else if (limited.length <= 9) {
      return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
    } else {
      return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
    }
  }, []);

  const handleCpfChange = useCallback((value: string) => {
    const formatted = formatCpf(value);
    setCpf(formatted);
  }, [formatCpf]);

  return {
    cpf,
    setCpf,
    handleCpfChange,
    formatCpf
  };
};
