import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cachorro, UpdateCachorroDto } from 'src/app/core/models/cachorro.model';
import { CachorroService } from 'src/app/core/services/cachorro.service';
import { ValidaRacaService } from 'src/app/core/services/valida-raca.service';

@Component({
  selector: 'app-form-edicao-cachorro',
  templateUrl: './form-edicao-cachorro.component.html',
  styleUrls: ['./form-edicao-cachorro.component.scss']
})
export class FormEdicaoCachorroComponent implements OnInit {
  cachorroEditado: Cachorro;
  racasDisponiveis: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { cachorro: Cachorro },
    private dialogRef: MatDialogRef<FormEdicaoCachorroComponent>,
    private cachorroService: CachorroService,
    private validaRacaService: ValidaRacaService
  ) {
    // Cria uma cópia para não alterar o original antes de salvar
    this.cachorroEditado = { ...data.cachorro };
  }

  ngOnInit() {
    // Carrega as raças disponíveis para o porte atual
    if (this.cachorroEditado.porte) {
      this.carregarRacas();
    }
  }

  /**
   * Chamado quando o usuário muda o porte
   */
  atualizarRacas() {
    this.carregarRacas();
    // Limpa a raça selecionada se não for compatível com o novo porte
    if (this.cachorroEditado.raca && !this.racasDisponiveis.includes(this.cachorroEditado.raca)) {
      this.cachorroEditado.raca = '';
    }
  }

  /**
   * Carrega as raças disponíveis para o porte selecionado
   */
  private carregarRacas() {
    this.validaRacaService.getRacasPorPorte(this.cachorroEditado.porte).subscribe({
      next: (racas) => {
        this.racasDisponiveis = racas;
      },
      error: (err) => {
        console.error('Erro ao carregar raças', err);
        this.racasDisponiveis = [];
      }
    });
  }

  /**
   * Exclui o cachorro atual
   */
  excluirCachorro() {
    if (this.cachorroEditado?.id) {
      // Confirmação antes de excluir
      if (confirm(`Tem certeza que deseja excluir ${this.cachorroEditado.nomeCachorro}?`)) {
        this.cachorroService.deletarCachorro(this.cachorroEditado.id).subscribe({
          next: () => {
            alert('Cachorro excluído com sucesso!');
            this.dialogRef.close(true);
          },
          error: (err) => alert('Erro ao excluir: ' + err.message)
        });
      }
    }
  }

  /**
   * Salva as alterações do cachorro
   */
  salvarEdicao() {
    const dto: UpdateCachorroDto = {
      nomeCachorro: this.cachorroEditado.nomeCachorro,
      nomeTutor: this.cachorroEditado.nomeTutor,
      contatoTutor: this.cachorroEditado.contatoTutor,
      enderecoCachorro: this.cachorroEditado.enderecoCachorro,
      raca: this.cachorroEditado.raca,
      porte: this.cachorroEditado.porte
    };
    
    this.cachorroService.atualizarCachorro(this.cachorroEditado.id, dto).subscribe({
      next: () => {
        alert('Cachorro atualizado com sucesso!');
        this.dialogRef.close(true);
      },
      error: (err) => alert('Erro ao atualizar: ' + err.message)
    });
  }
}