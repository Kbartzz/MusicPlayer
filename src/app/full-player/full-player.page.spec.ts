import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FullPlayerPage } from './full-player.page';

describe('FullPlayerPage', () => {
  let component: FullPlayerPage;
  let fixture: ComponentFixture<FullPlayerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FullPlayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
