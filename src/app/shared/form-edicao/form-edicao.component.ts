import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Horario, UpdateHorarioDto } from 'src/app/core/models/horario.model';
import { HorarioService } from 'src/app/core/services/horario.service';
import { ValidaRacaService } from 'src/app/core/services/valida-raca.service';

@Component({
  selector: 'app-form-edicao',
  templateUrl: './form-edicao.component.html',
  styleUrls: ['./form-edicao.component.scss']
})
export class FormEdicaoComponent implements OnInit {
  horarioEditado: any;
  servicosBaseDisponiveis: string[] = [];
  servicosAdicionaisDisponiveis: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { horario: Horario },
    private dialogRef: MatDialogRef<FormEdicaoComponent>,
    private horarioService: HorarioService,
    private validaRacaService: ValidaRacaService
  ) {
    this.horarioEditado = { ...data.horario };
    // Extrair data e hora separados
    const [dataParte, hora] = data.horario.data.split(' ');
    this.horarioEditado.data = dataParte;
    this.horarioEditado.horario = hora;
    
    // Inicializar adicionais se não existir
    if (!this.horarioEditado.adicionais) {
      this.horarioEditado.adicionais = [];
    }
  }

  ngOnInit() {
    this.carregarServicosDisponiveis();
    this.carregarServicosAdicionais();
  }

  carregarServicosDisponiveis() {
    const cachorro = this.horarioEditado.cachorro;
    if (cachorro) {
      this.validaRacaService.getServicosPorRacaPorte(cachorro.raca, cachorro.porte).subscribe({
        next: (servicos: string[]) => this.servicosBaseDisponiveis = servicos,
        error: (err: any) => console.error('Erro ao carregar serviços', err)
      });
    }
  }

  carregarServicosAdicionais() {
    // Se você tiver um endpoint para serviços adicionais
    this.servicosAdicionaisDisponiveis = [
      'Escovação de Dente',
      'Desembolo',
      'Hidratação',
      'Taxi Dog',
      'Cortar Unha'
    ];
  }

  toggleServicoAdicional(servico: string) {
    const index = this.horarioEditado.adicionais.indexOf(servico);
    if (index > -1) {
      this.horarioEditado.adicionais.splice(index, 1);
    } else {
      this.horarioEditado.adicionais.push(servico);
    }
  }

  excluirHorario() {
    if (this.horarioEditado?.id) {
      this.horarioService.deletarHorario(this.horarioEditado.id).subscribe({
        next: () => {
          alert('Horário excluído com sucesso!');
          this.dialogRef.close(true);
        },
        error: (err: any) => alert('Erro ao excluir: ' + err.message)
      });
    }
  }

  salvarEdicao() {
    const dto: UpdateHorarioDto = {
      data: `${this.horarioEditado.data} ${this.horarioEditado.horario}`,
      servicoBaseSelecionado: this.horarioEditado.servicoBaseSelecionado,
      adicionais: this.horarioEditado.adicionais
    };
    
    this.horarioService.atualizarHorario(this.horarioEditado.id, dto).subscribe({
      next: () => {
        alert('Horário atualizado com sucesso!');
        this.dialogRef.close(true);
      },
      error: (err: any) => alert('Erro ao atualizar: ' + err.message)
    });
  }
}