import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareaDetails } from './tarea-details';

describe('TareaDetails', () => {
  let component: TareaDetails;
  let fixture: ComponentFixture<TareaDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TareaDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TareaDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
