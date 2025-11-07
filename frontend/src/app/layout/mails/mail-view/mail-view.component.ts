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
      this.router.navigate(['dashboard', 'mails']);
    }
  }

  goBack(): void {
    this.router.navigate(['dashboard', 'mails']);
  }

  reply(): void {
    if (!this.mail) {
      return;
    }

    const data: MailComposeData = {
      to: this.mail.senderEmail,
      subject: this.mail.subject.startsWith('Re:') ? this.mail.subject : `Re: ${this.mail.subject}`
    };

    const dialogRef = this.dialog.open(MailComposeComponent, {
      width: '600px',
      data
    });

    dialogRef.afterClosed().subscribe();
  }
}
