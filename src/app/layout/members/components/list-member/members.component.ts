import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Member, MemberService } from '../../service/member.service';

interface DisplayMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatarUrl?: string;
  avatarColor?: string;
  initials?: string;
  projectsAssigned: number;
}

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MembersComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  searchTerm = '';
  selectedRole: 'All' | string = 'All';
  selectedStatus: 'All' | Member['status'] = 'All';

  members: Member[] = [];
  displayedMembers: DisplayMember[] = [];
  dataSource = new MatTableDataSource<DisplayMember>([]);
  displayedColumns: string[] = ['name', 'role', 'projectsAssigned', 'status'];
  loading = false;

  roles: Array<'All' | string> = ['All', 'Developer', 'Designer', 'Manager', 'QA', 'DevOps'];
  statuses: Array<'All' | Member['status']> = ['All', 'active', 'inactive', 'suspended'];

  constructor(
    private router: Router,
    private memberService: MemberService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  ngAfterViewInit(): void {
    // Set up sorting for the data source
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    // Ensure change detection runs after view initialization
    this.cdr.markForCheck();
  }

  /**
   * Load members from API
   */
  loadMembers(): void {
    this.loading = true;
    this.cdr.markForCheck();
    
    this.memberService.getMembers().subscribe({
      next: (members) => {
        console.log('Members received from service:', members);
        // Create new array reference for OnPush change detection
        this.members = members ? [...members] : [];
        console.log('Members array after assignment:', this.members);
        this.updateDisplayedMembers();
        console.log('Displayed members after update:', this.displayedMembers);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading members:', error);
        this.members = [];
        this.displayedMembers = [];
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
  /**
   * Map members to display format
   */
  private updateDisplayedMembers(): void {
    // Create a new array reference to ensure Angular detects the change
    this.displayedMembers = [...this.filteredMembers.map(member => ({
      id: member.id,
      name: member.full_name || '',
      email: member.email || '',
      role: member.role || 'Member',
      status: member.status || 'active',
      avatarUrl: member.avatar_url,
      avatarColor: member.avatar_color,
      initials: member.initials || this.getInitials(member.full_name || ''),
      projectsAssigned: member.projectsAssigned || 0
    }))];
    // Update the data source
    this.dataSource.data = this.displayedMembers;
  }

  /**
   * Get filtered members based on search and filters
   */
  get filteredMembers(): Member[] {
    const term = this.searchTerm.toLowerCase().trim();
    
    return this.members.filter(member => {
      // Search filter
      const matchesSearch = !term || 
        member.full_name?.toLowerCase().includes(term) ||
        member.email?.toLowerCase().includes(term) ||
        (member.role && member.role.toLowerCase().includes(term));

      // Role filter
      const matchesRole = this.selectedRole === 'All' || 
        (member.role && member.role === this.selectedRole);

      // Status filter
      const matchesStatus = this.selectedStatus === 'All' || 
        member.status === this.selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  /**
   * Apply filters (called when search or filters change)
   */
  applyFilters(): void {
    this.updateDisplayedMembers();
    this.cdr.markForCheck();
  }

  /**
   * Handle search input
   */
  onSearchChange(): void {
    this.applyFilters();
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  /**
   * Handle role filter change
   */
  onRoleChange(event: MatSelectChange): void {
    this.selectedRole = event.value as 'All' | string;
    this.applyFilters();
  }

  /**
   * Handle status filter change
   */
  onStatusChange(event: MatSelectChange): void {
    this.selectedStatus = event.value as 'All' | Member['status'];
    this.applyFilters();
  }

  /**
   * Navigate to member detail
   */
  onMemberClick(member: DisplayMember): void {
    this.router.navigate(['/members', member.id]);
  }

  /**
   * Navigate to add member
   */
  onAddMember(): void {
    this.router.navigate(['/members/add']);
  }

  /**
   * Get user initials from full name
   */
  getInitials(fullName: string): string {
    if (!fullName) return 'U';
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  /**
   * TrackBy function for *ngFor performance
   */
  trackByMemberId(index: number, member: DisplayMember): number {
    return member.id;
  }
}
