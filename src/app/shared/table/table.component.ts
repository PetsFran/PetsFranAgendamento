import { Component, EventEmitter, OnInit, OnChanges, Output, ViewChild, Input, SimpleChanges, AfterViewInit, HostListener } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Horario } from 'src/app/core/models/horario.model';
import { HorarioService } from 'src/app/core/services/horario.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges, AfterViewInit {
  displayedColumns: string[] = ['cachorro', 'tutor', 'endereco', 'data'];
  dataSource = new MatTableDataSource<Horario>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() horarioSelecionado = new EventEmitter<Horario>();
  @Input() mostrarConcluidos = false;

  // Propriedades para filtros
  filtroTexto: string = '';
  filtroData: Date | null = null;
  filtroDataSelecionada: Date | null = null;

  // 🔥 CONTROLE DE RESPONSIVIDADE
  screenWidth: number = window.innerWidth;

  constructor(private horarioService: HorarioService) { }

  @HostListener('window:resize')
onResize() {
  this.screenWidth = window.innerWidth;
  this.ajustarColunas();
}

  ngOnInit(): void {
    this.carregarDados();
    this.configurarFiltro();
    this.ajustarColunas();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mostrarConcluidos']) {
      this.carregarDados();
    }
  }

  // 🔥 AJUSTAR COLUNAS BASEADO NA LARGURA DA TELA
  private ajustarColunas() {
    if (this.screenWidth < 500) {
      this.displayedColumns = ['cachorro', 'tutor', 'data']; // Sem endereço
    } else {
      this.displayedColumns = ['cachorro', 'tutor', 'endereco', 'data']; // Com endereço
    }
  }

  private carregarDados(): void {
    this.horarioService.horarios$.subscribe(horarios => {
      this.dataSource.data = horarios;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  private configurarFiltro() {
    this.dataSource.filterPredicate = (data: Horario, filter: string) => {
      const filterObj = JSON.parse(filter);

      // Filtro por texto (nome do pet, tutor ou endereço)
      const nomePet = data.cachorro?.nome?.toLowerCase() || '';
      const nomeTutor = data.cachorro?.nomeTutor?.toLowerCase() || '';
      const endereco = data.cachorro?.enderecoCachorro?.toLowerCase() || '';
      
      const textoMatch = filterObj.texto
        ? nomePet.includes(filterObj.texto) || 
          nomeTutor.includes(filterObj.texto) ||
          endereco.includes(filterObj.texto)
        : true;

      // Filtro por data
      let dataMatch = true;
      if (filterObj.data) {
        const dataHorario = data.data.split(' ')[0]; // "dd/MM/yyyy"
        dataMatch = dataHorario === filterObj.data;
      }

      return textoMatch && dataMatch;
    };
  }

  aplicarFiltroTexto(event: Event) {
    this.filtroTexto = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.aplicarFiltros();
  }

  filtrarPorData(event: MatDatepickerInputEvent<Date>) {
    this.filtroData = event.value;
    this.filtroDataSelecionada = event.value;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    const filtroObj = {
      texto: this.filtroTexto,
      data: this.filtroData ? this.formatarData(this.filtroData) : null
    };

    this.dataSource.filter = JSON.stringify(filtroObj);
  }

  limparFiltros() {
    this.filtroTexto = '';
    this.filtroData = null;
    this.filtroDataSelecionada = null;
    this.aplicarFiltros();
  }

  private formatarData(data: Date): string {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  selecionarHorario(horario: Horario) {
    this.horarioSelecionado.emit(horario);
  }

  public recarregarDados(): void {
    this.carregarDados();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    // CÓDIGO DO RESIZE
    const resizer = document.querySelector('.resizer') as HTMLElement;
    const leftPane = document.querySelector('.left-pane') as HTMLElement;
    const rightPane = document.querySelector('.right-pane') as HTMLElement;

    if (!resizer || !leftPane || !rightPane) return;

    let isResizing = false;
    let startX: number;
    let startWidth: number;

    resizer.addEventListener('mousedown', (e) => {
      isResizing = true;
      startX = e.clientX;
      startWidth = leftPane.getBoundingClientRect().width;

      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      resizer.classList.add('resizing');
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;

      const container = leftPane.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newWidth = startWidth + (e.clientX - startX);

      const minWidth = 200;
      const maxWidth = containerRect.width - 300;

      if (newWidth > minWidth && newWidth < maxWidth) {
        leftPane.style.width = `${newWidth}px`;
        rightPane.style.width = `calc(100% - ${newWidth}px - 5px)`;
      }
    });

    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
        resizer.classList.remove('resizing');
      }
    });

    resizer.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });
  }
}