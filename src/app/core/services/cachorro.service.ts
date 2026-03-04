import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { Cachorro, CreateCachorroDto, UpdateCachorroDto } from '../models/cachorro.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class CachorroService {
  private apiUrl = `${environment.apiUrl}/cachorros`;
  private cachorrosSubject = new BehaviorSubject<Cachorro[]>([]);
  cachorros$ = this.cachorrosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.carregarCachorros();
  }

  carregarCachorros(): void {
    this.http.get<Cachorro[]>(this.apiUrl).subscribe({
      next: (data) => this.cachorrosSubject.next(data),
      error: (err) => console.error('Erro ao carregar cachorros', err)
    });
  }

  getCachorros(): Cachorro[] {
    return this.cachorrosSubject.value;
  }

  getCachorroById(id: number): Observable<Cachorro> {
    return this.http.get<Cachorro>(`${this.apiUrl}/${id}`);
  }

  salvarCachorro(dto: CreateCachorroDto): Observable<Cachorro> {
    return this.http.post<Cachorro>(this.apiUrl, dto).pipe(
      tap(novoCachorro => {
        const lista = this.cachorrosSubject.value;
        this.cachorrosSubject.next([...lista, novoCachorro]);
      }),
      catchError(this.handleError)
    );
  }

  atualizarCachorro(id: number, dto: UpdateCachorroDto): Observable<Cachorro> {
    return this.http.put<Cachorro>(`${this.apiUrl}/${id}`, dto).pipe(
      tap(cachorroAtualizado => {
        const lista = this.cachorrosSubject.value;
        const index = lista.findIndex(c => c.id === id);
        if (index > -1) {
          lista[index] = cachorroAtualizado;
          this.cachorrosSubject.next([...lista]);
        }
      }),
      catchError(this.handleError)
    );
  }

  deletarCachorro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const lista = this.cachorrosSubject.value.filter(c => c.id !== id);
        this.cachorrosSubject.next(lista);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Erro na API:', error);
    let mensagem = 'Erro ao processar requisição';
    if (error.error?.message) {
      mensagem = error.error.message;
    } else if (error.status === 401) {
      mensagem = 'Sessão expirada. Faça login novamente.';
    }
    return throwError(() => new Error(mensagem));
  }
}