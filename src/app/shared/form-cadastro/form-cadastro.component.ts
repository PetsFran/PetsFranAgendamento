import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { Cachorro, CreateCachorroDto } from 'src/app/core/models/cachorro.model';
import { CreateHorarioDto } from 'src/app/core/models/horario.model';
import { CreatePetShopDto } from 'src/app/core/models/petshop.model'; // ← IMPORT
import { CachorroService } from 'src/app/core/services/cachorro.service';
import { HorarioService } from 'src/app/core/services/horario.service';
import { ValidaRacaService } from 'src/app/core/services/valida-raca.service';
import { PetShopService } from 'src/app/core/services/petshop.service';

@Component({
  selector: 'app-form-cadastro',
  templateUrl: './form-cadastro.component.html',
  styleUrls: ['./form-cadastro.component.scss']
})
export class FormCadastroComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  tipo: 'cachorro' | 'horario' | 'petshop'; // ← ADICIONADO 'petshop'

  novoCachorro: any = {
    nomeCachorro: '',
    nomeTutor: '',
    contatoTutor: '',
    endereco: '',
    raca: '',
    porte: '',
    // Campos para pet shop
    email: '',
    senha: '',
    confirmarSenha: ''
  };
  racasDisponiveis: string[] = [];
  cachorroSelecionadoObj?: Cachorro;

  novoHorario: any = {
    cachorros: [],
    data: '',
    horario: '',
    valorTotal: 0,
    servicosBaseSelecionado: '',
    adicionais: []
  };
  listaCachorros: Cachorro[] = [];
  servicosBaseDisponiveis: string[] = [];
  servicosAdicionaisDisponiveis: string[] = [];

  cachorroSelecionado: string = '';
  cachorrosFiltrados: Cachorro[] = [];

  get enderecoCachorroSelecionado(): string {
    return this.cachorroSelecionadoObj?.enderecoCachorro || '';
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FormCadastroComponent>,
    private cachorroService: CachorroService,
    private horarioService: HorarioService,
    private validaRacaService: ValidaRacaService,
    private petShopService: PetShopService
  ) {
    this.tipo = data.tipo;
  }

  ngOnInit() {
    if (this.tipo === 'horario') {
      this.cachorroService.cachorros$
        .pipe(takeUntil(this.destroy$))
        .subscribe(cachorros => {
          this.listaCachorros = cachorros;
          this.cachorrosFiltrados = cachorros;
        });

      // 🔥 CARREGAR SERVIÇOS ADICIONAIS
      this.carregarServicosAdicionais();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  carregarServicosAdicionais() {
    this.validaRacaService.getServicosAdicionais().subscribe({
      next: (servicos) => {
        this.servicosAdicionaisDisponiveis = servicos;
      },
      error: (err) => {
        console.error('Erro ao carregar serviços adicionais', err);
        // Fallback
        this.servicosAdicionaisDisponiveis = [
          'Escovação de Dente',
          'Desembolo',
          'Hidratação',
          'Taxi Dog',
          'Cortar Unha'
        ];
      }
    });
  }

  selecionarCachorro(nome: string) {
    const selecionado = this.listaCachorros.find(c => c.nomeCachorro === nome);

    if (selecionado) {
      this.cachorroSelecionado = selecionado.nomeCachorro;
      this.cachorroSelecionadoObj = selecionado;

      // Carregar serviços base para este cachorro
      this.carregarServicosBase(selecionado.raca, selecionado.porte);
    }
  }

  carregarServicosBase(raca: string, porte: string) {
    this.validaRacaService.getServicosPorRacaPorte(raca, porte).subscribe({
      next: (servicos) => {
        this.servicosBaseDisponiveis = servicos;
        this.novoHorario.servicosBaseSelecionado = ''; // Reset
      },
      error: (err) => {
        console.error('Erro ao carregar serviços base', err);
        this.servicosBaseDisponiveis = [];
      }
    });
  }


  filtrarCachorros() {
    const termo = this.cachorroSelecionado.toLowerCase();
    this.cachorrosFiltrados = this.listaCachorros.filter(c =>
      c.nomeCachorro.toLowerCase().includes(termo) ||
      c.nomeTutor.toLowerCase().includes(termo)
    );
  }

  atualizarRacas() {
    if (this.tipo === 'cachorro') {
      console.log('Porte selecionado:', this.novoCachorro.porte); // ← DEBUG

      this.validaRacaService.getRacasPorPorte(this.novoCachorro.porte).subscribe({
        next: (racas: string[]) => {
          console.log('Raças recebidas da API:', racas); // ← DEBUG
          this.racasDisponiveis = racas;
        },
        error: (err: any) => {
          console.error('Erro ao carregar raças', err);
          this.racasDisponiveis = []; // Limpa em caso de erro
        }
      });
    }
  }

  calcularValor() {
    if (!this.cachorroSelecionadoObj || !this.novoHorario.servicosBaseSelecionado) {
      this.novoHorario.valorTotal = 0;
      return;
    }

    this.horarioService.calcularPreco(
      this.cachorroSelecionadoObj.raca,
      this.cachorroSelecionadoObj.porte,
      this.novoHorario.servicosBaseSelecionado,
      this.novoHorario.adicionais || []
    ).subscribe({
      next: (valor) => {
        this.novoHorario.valorTotal = valor;
        console.log('Preço calculado pela API:', valor);
      },
      error: (err) => {
        console.error('Erro ao calcular preço', err);
        // Fallback para não travar o UI
      }
    });
  }

  salvar() {
    if (this.tipo === 'cachorro') {
      const dto: CreateCachorroDto = {
        nomeCachorro: this.novoCachorro.nomeCachorro,
        nomeTutor: this.novoCachorro.nomeTutor,
        contatoTutor: this.novoCachorro.contatoTutor,
        enderecoCachorro: this.novoCachorro.endereco,
        raca: this.novoCachorro.raca,
        porte: this.novoCachorro.porte
      };

      this.cachorroService.salvarCachorro(dto).subscribe({
        next: () => {
          alert('Cachorro cadastrado com sucesso!');
          this.dialogRef.close(true);
        },
        error: (err: any) => alert(err.message)
      });
    }
    else if (this.tipo === 'horario') {
      const dto: CreateHorarioDto = {
        cachorroId: this.cachorroSelecionadoObj!.id,
        data: `${this.novoHorario.data} ${this.novoHorario.horario}`,
        servicoBaseSelecionado: this.novoHorario.servicosBaseSelecionado,
        adicionais: this.novoHorario.adicionais
      };

      this.horarioService.salvarHorario(dto).subscribe({
        next: () => {
          alert('Horário cadastrado com sucesso!');
          this.dialogRef.close(true);
        },
        error: (err: any) => alert(err.message)
      });
    }
    else if (this.tipo === 'petshop') {
      const dto: CreatePetShopDto = {
        email: this.novoCachorro.email,
        senha: this.novoCachorro.senha,
        enderecoPetShop: this.novoCachorro.endereco,
        confirmarSenha: this.novoCachorro.confirmarSenha
      };

      this.petShopService.criarPetShop(dto).subscribe({
        next: () => {
          alert('Pet Shop cadastrado com sucesso! Faça o login.');
          this.dialogRef.close(true);
        },
        error: (err: any) => alert(err.message)
      });
    }
  }
}