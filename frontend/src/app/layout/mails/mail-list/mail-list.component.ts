import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Mail, MailService } from '../services/mail.service';

@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.scss']
})
export class MailListComponent implements OnInit {

  mails: Mail[] = [];

  constructor(
    private readonly mailService: MailService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.mails = this.mailService.getMails();
  }

  openMail(mail: Mail): void {
    this.router.navigate(['dashboard', 'mails', mail.id]);
  }

  getAvatarInitials(sender: string): string {
    return sender
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}
