import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { 
  DashboardResponse, 
  UpdatePetShopDto, 
  PetShopInfo,
  CreatePetShopDto
} from '../models/petshop.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class PetShopService {
  private apiUrl = `${environment.apiUrl}/petshops`;

  constructor(private http: HttpClient) { }

  criarPetShop(dto: CreatePetShopDto): Observable<any> {
    return this.http.post(`${this.apiUrl}`, dto);
  }

  getDashboard(id: number): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.apiUrl}/${id}/dashboard`).pipe(
      catchError(this.handleError)
    );
  }
  
  atualizarPerfil(id: number, dto: UpdatePetShopDto): Observable<PetShopInfo> {
    return this.http.put<PetShopInfo>(`${this.apiUrl}/${id}`, dto).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Erro na API:', error);
    let mensagem = 'Erro ao processar requisição';
    if (error.error?.message) {
      mensagem = error.error.message;
    }
    return throwError(() => new Error(mensagem));
  }
}