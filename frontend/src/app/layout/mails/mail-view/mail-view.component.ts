import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mail, MailService } from '../services/mail.service';

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
    private readonly mailService: MailService
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
}
