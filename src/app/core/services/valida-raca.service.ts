import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ValidaRacaService {
  private apiUrl = `${environment.apiUrl}/servicos`;

  constructor(private http: HttpClient) {}

  getRacasPorPorte(porte: string): Observable<string[]> {
    // URL CORRETA: http://localhost:5028/api/servicos/racas/Pequeno
    return this.http.get<string[]>(`${this.apiUrl}/racas/${porte}`);
  }

  getServicosPorRacaPorte(raca: string, porte: string): Observable<string[]> {
    // URL CORRETA: http://localhost:5028/api/servicos/servicos/Pequeno/Vira lata
    return this.http.get<string[]>(`${this.apiUrl}/servicos/${porte}/${raca}`);
  }

  getServicosAdicionais(): Observable<string[]> {
    // URL CORRETA: http://localhost:5028/api/servicos/adicionais
    return this.http.get<string[]>(`${this.apiUrl}/adicionais`);
  }
}