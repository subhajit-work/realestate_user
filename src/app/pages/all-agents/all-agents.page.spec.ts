import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAgentsPage } from './all-agents.page';

describe('AllAgentsPage', () => {
  let component: AllAgentsPage;
  let fixture: ComponentFixture<AllAgentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllAgentsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAgentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
