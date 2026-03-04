import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEdicaoCachorroComponent } from './form-edicao-cachorro.component';

describe('FormEdicaoCachorroComponent', () => {
  let component: FormEdicaoCachorroComponent;
  let fixture: ComponentFixture<FormEdicaoCachorroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormEdicaoCachorroComponent]
    });
    fixture = TestBed.createComponent(FormEdicaoCachorroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
