export interface Cachorro {
  id: number;
  nomeCachorro: string;
  nomeTutor: string;
  contatoTutor: string;
  enderecoCachorro: string;
  raca: string;
  porte: string;
  petShopId: number;
}

export interface CreateCachorroDto {
  nomeCachorro: string;
  nomeTutor: string;
  contatoTutor: string;
  enderecoCachorro: string;
  raca: string;
  porte: string;
}

export interface UpdateCachorroDto {
  nomeCachorro?: string;
  nomeTutor?: string;
  contatoTutor?: string;
  enderecoCachorro?: string;
  raca?: string;
  porte?: string;
}

export interface CachorroInfo {
  id: number;
  nome: string;
  raca: string;
  porte: string;
  nomeTutor: string;
  contatoTutor: string;
  enderecoCachorro?: string;
}