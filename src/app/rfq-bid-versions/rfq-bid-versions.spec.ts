import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqBidVersions } from './rfq-bid-versions';

describe('RfqBidVersions', () => {
  let component: RfqBidVersions;
  let fixture: ComponentFixture<RfqBidVersions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfqBidVersions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfqBidVersions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
