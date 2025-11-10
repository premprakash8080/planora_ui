import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Mail, MailService } from '../services/mail.service';
import { MailComposeComponent, MailComposeData } from '../mail-compose/mail-compose.component';

@Component({
  selector: 'app-mail-view',
  templateUrl: './mail-view.component.html',
  styleUrls: ['./mail-view.component.scss']
})
export class MailViewComponent implements OnInit {

  mail: Mail | undefined;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly mailService: MailService,
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const mailId = this.route.snapshot.paramMap.get('id');
    if (mailId) {
      this.mail = this.mailService.getMailById(mailId);
    }

    if (!this.mail) {
      this.router.navigate(['/mails']);
    }
  }

  goBack(): void {
    this.router.navigate(['/mails']);
  }

  reply(): void {
    this.router.navigate(['/mails/compose'], {
      queryParams: {
        to: this.mail?.senderEmail,
        subject: this.mail ? `Re: ${this.mail.subject}` : 'Re:'
      }
    });
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
