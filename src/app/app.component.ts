import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';  // ← IMPORTAR!
import { FormCadastroComponent } from './shared/form-cadastro/form-cadastro.component';
import { FormLoginComponent } from './shared/form-login/form-login.component';
import { Horario } from './core/models/horario.model';
import { TableComponent } from './shared/table/table.component';
import { AuthService } from './core/services/auth.service';
import { ListaCachorrosComponent } from './shared/lista-cachorros/lista-cachorros.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  horarioAtual: Horario | null = null;
  mostrarConcluidos: boolean = false;

  @ViewChild(TableComponent) tabela!: TableComponent;

  // Getter para facilitar no template
  get isLogado(): boolean {
    return !!this.authService.getToken();
  }

  constructor(
    private dialog: MatDialog,
    public authService: AuthService,
    private router: Router  // ← ADICIONADO!
  ) { }

  abrirFormLogin() {
    this.dialog.open(FormLoginComponent, {
      panelClass: 'custom-dialog',
      width: '300px'
    });
  }

  abrirListaCachorros() {
    this.dialog.open(ListaCachorrosComponent, {
      panelClass: 'custom-dialog',
      width: '800px',
      maxWidth: '95vw'
    });
  }

  abrirFormCachorro() {
    this.dialog.open(FormCadastroComponent, {
      panelClass: 'custom-dialog',
      data: { tipo: 'cachorro' }
    });
  }

  abrirFormHorario() {
    this.dialog.open(FormCadastroComponent, {
      panelClass: 'custom-dialog',
      data: { tipo: 'horario' }
    });
  }

  alternarHorariosConcluidos() {
    this.mostrarConcluidos = !this.mostrarConcluidos;
  }

  mostrarDetalhes(horario: Horario) {
    this.horarioAtual = horario;
  }

  limparDetalhes() {
    this.horarioAtual = null;
  }

  atualizarTabela() {
    this.horarioAtual = null;
    this.tabela.recarregarDados();
  }

  logout() {
    // Se não tem token, só redireciona para login
    if (!this.authService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }

    // Tenta fazer logout na API
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout realizado com sucesso');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erro no logout, mas limpando sessão mesmo assim', err);
        // Mesmo com erro, limpa a sessão local
        localStorage.removeItem('access_token');
        this.router.navigate(['/login']);
      }
    });
  }
}