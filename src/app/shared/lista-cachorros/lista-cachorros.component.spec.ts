import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCachorrosComponent } from './lista-cachorros.component';

describe('ListaCachorrosComponent', () => {
  let component: ListaCachorrosComponent;
  let fixture: ComponentFixture<ListaCachorrosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaCachorrosComponent]
    });
    fixture = TestBed.createComponent(ListaCachorrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
