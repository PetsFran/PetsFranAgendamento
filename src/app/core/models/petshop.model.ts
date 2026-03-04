import { Horario } from './horario.model';

export interface PetShopInfo {
  id: number;
  email: string;
  enderecoPetShop: string;
}

export interface PetShopCompleto extends PetShopInfo {
  horarios: Horario[];
}

export interface CreatePetShopDto {
  email: string;
  senha: string;
  enderecoPetShop: string;
  confirmarSenha: string;
}

export interface UpdatePetShopDto {
  enderecoPetShop?: string;
  novaSenha?: string;
  confirmarNovaSenha?: string;
  senhaAtual: string;
}

export interface DashboardResponse {
  petShop: PetShopInfo;
  estatisticas: {
    totalHorarios: number;
    horariosHoje: number;
    faturamentoTotal: number;
    faturamentoHoje: number;
  };
  proximosHorarios: Array<{
    id: number;
    data: string;
    valorTotal: number;
    servicoBaseSelecionado: string;
    cachorroNome: string;
  }>;
}