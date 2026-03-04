import { CachorroInfo } from './cachorro.model';
import { PetShopInfo } from './petshop.model';

export interface Horario {
  id: number;
  data: string;
  servicoBaseSelecionado: string;
  adicionais: string[];
  valorTotal: number;
  cachorro: CachorroInfo;
  petShop: PetShopInfo;
}

export interface CreateHorarioDto {
  cachorroId: number;
  data: string;
  servicoBaseSelecionado: string;
  adicionais?: string[];
}

export interface UpdateHorarioDto {
  data?: string;
  servicoBaseSelecionado?: string;
  adicionais?: string[];
}