import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { TableComponent } from './shared/table/table.component';
import { DetailsComponent } from './shared/details/details.component';
import { FormCadastroComponent } from './shared/form-cadastro/form-cadastro.component';

import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card'; // ← NOVO

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { A11yModule } from "@angular/cdk/a11y";
import { AngularSplitModule } from 'angular-split';
import { FormEdicaoComponent } from './shared/form-edicao/form-edicao.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './core/interceptors/token.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { FormLoginComponent } from './shared/form-login/form-login.component';
import { ListaCachorrosComponent } from './shared/lista-cachorros/lista-cachorros.component';
import { FormEdicaoCachorroComponent } from './shared/form-edicao-cachorro/form-edicao-cachorro.component'; // ← NOVO

@NgModule({
  declarations: [
    AppComponent,
    DetailsComponent,
    TableComponent,
    FormCadastroComponent,
    FormEdicaoComponent,
    FormLoginComponent,
    ListaCachorrosComponent,
    FormEdicaoCachorroComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule, // ← NOVO
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTableModule,
    MatSortModule,
    A11yModule,
    AngularSplitModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatCardModule, // ← NOVO
  ],
  providers: [ 
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }