import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaUser } from './lista';

describe('Lista', () => {
  let component: ListaUser;
  let fixture: ComponentFixture<ListaUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
