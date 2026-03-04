import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Horario } from 'src/app/core/models/horario.model';
import { HorarioService } from 'src/app/core/services/horario.service';
import { FormEdicaoComponent } from '../form-edicao/form-edicao.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
  @Input() horario: Horario | null = null;
  @Input() mostrarConcluidos: boolean = false;
  @Output() horarioEditado = new EventEmitter<void>();
  @Output() horarioConcluido = new EventEmitter<void>();

  constructor(
    private horarioService: HorarioService,
    private dialog: MatDialog
  ) { }

  editarHorario() {
    if (!this.horario) return;

    const dialogRef = this.dialog.open(FormEdicaoComponent, {
      width: '240px',
      data: { horario: this.horario }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        alert('Horário atualizado com sucesso!');
        this.horarioEditado.emit();
      }
    });
  }

  concluirHorario() {
    if (this.horario) {
      this.horarioService.deletarHorario(this.horario.id).subscribe({
        next: () => {
          alert('Horário concluído e removido!');
          this.horarioConcluido.emit();
        },
        error: (err) => alert('Erro ao concluir horário: ' + err.message)
      });
    }
  }

  get whatsappLink(): string {
    if (!this.horario?.cachorro?.contatoTutor) return '#';
    const numero = this.horario.cachorro.contatoTutor.replace(/\D/g, '');
    return `https://wa.me/55${numero}`;
  }

  // 🔥 GETTER INTELIGENTE
  get enderecoCachorro(): string {
    if (!this.horario?.cachorro) return 'Não informado';
    
    // Tenta todas as possibilidades
    const cachorro = this.horario.cachorro as any;
    return cachorro.enderecoCachorro || 
           cachorro.endereco || 
           'Não informado';
  }

  get enderecoGoogleMaps(): string {
    const endereco = this.enderecoCachorro;
    if (endereco === 'Não informado') return '#';
    return `https://maps.google.com/?q=${encodeURIComponent(endereco)}`;
  }
}