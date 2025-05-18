import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalPlayerPage } from './local-player.page';

describe('LocalPlayerPage', () => {
  let component: LocalPlayerPage;
  let fixture: ComponentFixture<LocalPlayerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalPlayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
