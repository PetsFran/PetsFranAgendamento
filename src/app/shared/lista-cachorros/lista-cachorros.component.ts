import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Cachorro } from 'src/app/core/models/cachorro.model';
import { CachorroService } from 'src/app/core/services/cachorro.service';
import { FormEdicaoCachorroComponent } from '../form-edicao-cachorro/form-edicao-cachorro.component';
import { FormCadastroComponent } from '../form-cadastro/form-cadastro.component';

@Component({
  selector: 'app-lista-cachorros',
  templateUrl: './lista-cachorros.component.html',
  styleUrls: ['./lista-cachorros.component.scss']
})
export class ListaCachorrosComponent implements OnInit {
  todosCachorros: Cachorro[] = [];
  cachorrosFiltrados: Cachorro[] = [];
  filtroTexto: string = '';
  filtroAtivo: boolean = false;

  constructor(
    private cachorroService: CachorroService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.carregarCachorros();
  }

  private carregarCachorros() {
    this.cachorroService.cachorros$.subscribe(data => {
      this.todosCachorros = data;
      this.aplicarFiltroInterno();
    });
  }

  // MÉTODO PARA LINK DO WHATSAPP
  getWhatsappLink(contato: string): string {
    if (!contato) return '#';
    const numero = contato.replace(/\D/g, '');
    return `https://wa.me/55${numero}`;
  }

  // MÉTODO PARA LINK DO GOOGLE MAPS
  getGoogleMapsLink(endereco: string): string {
    if (!endereco) return '#';
    return `https://maps.google.com/?q=${encodeURIComponent(endereco)}`;
  }

  // Aplica filtro por texto (igual ao da tabela)
  aplicarFiltro(event: Event) {
    this.filtroTexto = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filtroAtivo = this.filtroTexto.length > 0;
    this.aplicarFiltroInterno();
  }

  private aplicarFiltroInterno() {
    if (!this.filtroTexto) {
      this.cachorrosFiltrados = [...this.todosCachorros];
      return;
    }

    this.cachorrosFiltrados = this.todosCachorros.filter(cachorro => {
      const nome = cachorro.nomeCachorro?.toLowerCase() || '';
      const tutor = cachorro.nomeTutor?.toLowerCase() || '';
      const endereco = cachorro.enderecoCachorro?.toLowerCase() || '';
      const contato = cachorro.contatoTutor?.toLowerCase() || '';
      
      return nome.includes(this.filtroTexto) ||
             tutor.includes(this.filtroTexto) ||
             endereco.includes(this.filtroTexto) ||
             contato.includes(this.filtroTexto);
    });
  }

  limparFiltro() {
    this.filtroTexto = '';
    this.filtroAtivo = false;
    this.cachorrosFiltrados = [...this.todosCachorros];
  }

  editarCachorro(cachorro: Cachorro) {
    const dialogRef = this.dialog.open(FormEdicaoCachorroComponent, {
      panelClass: 'custom-dialog',
      data: { cachorro },
      width: '400px',
      maxWidth: '95vw'
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.carregarCachorros(); // Recarrega a lista
      }
    });
  }

  abrirCadastro() {
    const dialogRef = this.dialog.open(FormCadastroComponent, {
      panelClass: 'custom-dialog',
      data: { tipo: 'cachorro' }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.carregarCachorros(); // Recarrega a lista
        this.limparFiltro(); // Limpa o filtro ao adicionar novo
      }
    });
  }
}