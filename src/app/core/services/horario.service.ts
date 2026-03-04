import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { Horario, CreateHorarioDto, UpdateHorarioDto } from '../models/horario.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class HorarioService {
  private baseUrl = environment.apiUrl;  // ← USA ENVIRONMENT
  private horariosUrl = `${this.baseUrl}/horarios`;
  private servicosUrl = `${this.baseUrl}/servicos`;
  
  private horariosSubject = new BehaviorSubject<Horario[]>([]);
  horarios$ = this.horariosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.carregarHorarios();
  }

  carregarHorarios(): void {
    this.http.get<Horario[]>(this.horariosUrl).subscribe({
      next: (data) => this.horariosSubject.next(data),
      error: (err) => console.error('Erro ao carregar horários', err)
    });
  }

  getHorarios(): Horario[] {
    return this.horariosSubject.value;
  }

  getHorarioById(id: number): Observable<Horario> {
    return this.http.get<Horario>(`${this.horariosUrl}/${id}`);
  }

  salvarHorario(dto: CreateHorarioDto): Observable<Horario> {
    return this.http.post<Horario>(this.horariosUrl, dto).pipe(
      tap(novoHorario => {
        const lista = this.horariosSubject.value;
        this.horariosSubject.next([...lista, novoHorario]);
      }),
      catchError(this.handleError)
    );
  }

  atualizarHorario(id: number, dto: UpdateHorarioDto): Observable<Horario> {
    return this.http.put<Horario>(`${this.horariosUrl}/${id}`, dto).pipe(
      tap(horarioAtualizado => {
        const lista = this.horariosSubject.value;
        const index = lista.findIndex(h => h.id === id);
        if (index > -1) {
          lista[index] = horarioAtualizado;
          this.horariosSubject.next([...lista]);
        }
      }),
      catchError(this.handleError)
    );
  }

  deletarHorario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.horariosUrl}/${id}`).pipe(
      tap(() => {
        const lista = this.horariosSubject.value.filter(h => h.id !== id);
        this.horariosSubject.next(lista);
      }),
      catchError(this.handleError)
    );
  }

  calcularPreco(raca: string, porte: string, servicoBase: string, adicionais: string[]): Observable<number> {
    return this.http.post<number>(`${this.servicosUrl}/calcular-preco`, {
      raca,
      porte,
      servicoBase,
      adicionais
    });
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