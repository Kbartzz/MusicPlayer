import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiPlayerPage } from './api-player.page';

describe('ApiPlayerPage', () => {
  let component: ApiPlayerPage;
  let fixture: ComponentFixture<ApiPlayerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiPlayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
