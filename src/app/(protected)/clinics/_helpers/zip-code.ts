export interface AddressData {
  zipCode: string;
  address: string;
  city: string;
  state: string;
}

export const formatZipCode = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 5) {
    return cleaned;
  }
  return cleaned.slice(0, 5) + "-" + cleaned.slice(5, 8);
};

export const formatPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");

  if (cleaned.length <= 2) {
    return cleaned;
  }

  if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  }

  if (cleaned.length <= 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }

  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
};

export const fetchAddressByZipCode = async (
  zipCode: string,
): Promise<AddressData | null> => {
  try {
    const cleaned = zipCode.replace(/\D/g, "");
    if (cleaned.length !== 8) {
      return null;
    }

    const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.erro) {
      return null;
    }

    return {
      zipCode: zipCode,
      address: data.logradouro,
      city: data.localidade,
      state: data.uf,
    };
  } catch (error) {
    console.error("Erro ao buscar endereço:", error);
    return null;
  }
};
