import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuySellPropertiesPage } from './buy-sell-properties.page';

describe('BuySellPropertiesPage', () => {
  let component: BuySellPropertiesPage;
  let fixture: ComponentFixture<BuySellPropertiesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuySellPropertiesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuySellPropertiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
