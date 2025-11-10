import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSidebarComponent } from './chat-sidebar.component';
import { SharedUiModule } from '../../../shared/ui/ui.module';

describe('ChatSidebarComponent', () => {
  let component: ChatSidebarComponent;
  let fixture: ComponentFixture<ChatSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatSidebarComponent],
      imports: [SharedUiModule]
    });
    fixture = TestBed.createComponent(ChatSidebarComponent);
    component = fixture.componentInstance;
    component.members = [
      { id: '1', name: 'Test User', status: 'online' },
      { id: '2', name: 'Sample User', status: 'offline' }
    ];
    component.activeMemberId = '1';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
