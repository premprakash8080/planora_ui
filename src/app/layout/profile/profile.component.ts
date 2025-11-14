import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user = {
    name: 'John Doe',
    email: 'john.doe@planora.com',
    role: 'Product Manager',
    phone: '+1 (555) 123-4567',
    avatarUrl: undefined,
    initials: 'JD',
    avatarColor: '#2563eb',
    department: 'Product',
    location: 'San Francisco, CA',
    joinDate: 'January 2023'
  };

  constructor() { }

  ngOnInit(): void {
  }

  onEdit(): void {
    // TODO: Navigate to edit profile page
    console.log('Edit profile');
  }
}

