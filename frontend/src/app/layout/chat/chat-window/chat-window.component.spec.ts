import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { ChatWindowComponent } from './chat-window.component';
import { SharedUiModule } from '../../../shared/ui/ui.module';

describe('ChatWindowComponent', () => {
  let component: ChatWindowComponent;
  let fixture: ComponentFixture<ChatWindowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatWindowComponent],
      imports: [ReactiveFormsModule, SharedUiModule]
    });
    fixture = TestBed.createComponent(ChatWindowComponent);
    component = fixture.componentInstance;
    component.member = { id: '2', name: 'Sample Teammate', status: 'online' };
    component.currentUserId = 'me';
    component.messages = [
      {
        id: 'm1',
        senderId: '2',
        senderName: 'Sample Teammate',
        message: 'Hi there! **Bold** text and [link](https://example.com).',
        createdAt: new Date().toISOString()
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
