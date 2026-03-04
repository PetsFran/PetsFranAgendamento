import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormCadastroComponent } from '../form-cadastro/form-cadastro.component';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.scss']
})
export class FormLoginComponent {
  credenciais = {
    email: '',
    senha: ''
  };
  
  loading = false;
  erro = '';

  constructor(
    private dialogRef: MatDialogRef<FormLoginComponent>,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  salvar() {
    this.loading = true;
    this.erro = '';

    this.authService.login(this.credenciais).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Login bem-sucedido!', response);
        this.dialogRef.close(true);
        // Recarrega a página para atualizar o estado (ou você pode navegar programaticamente)
        window.location.reload();
      },
      error: (error) => {
        this.loading = false;
        this.erro = error.message || 'Erro ao fazer login. Verifique suas credenciais.';
        console.error('Erro no login:', error);
      }
    });
  }
}