import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidHeaderDetails } from './bid-header-details';

describe('BidHeaderDetails', () => {
  let component: BidHeaderDetails;
  let fixture: ComponentFixture<BidHeaderDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BidHeaderDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BidHeaderDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
