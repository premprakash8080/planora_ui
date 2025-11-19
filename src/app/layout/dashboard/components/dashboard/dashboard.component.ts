import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidebarService } from '../../services/sidebar.service';
import { DashboardService, DashboardStats, MonthlyStats } from '../../services/dashboard.service';
import { UserSessionService } from 'src/app/shared/services/user-session.service';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('snav') sidenav!: MatSidenav;
  
  showFiller = false;
  editing: boolean = false;
  message: string = '';
  editedMessage: string = '';
  selectedValue = 'FY 2022/2023';
  
  // Dashboard stats
  stats: DashboardStats = {
    upcoming: 0,
    overdue: 0,
    ongoing: 0,
    complete: 0
  };
  
  // Monthly stats
  monthlyStats: MonthlyStats = {
    newJobs: 0,
    housesOut: 0,
    completed: 0
  };
  
  loading = false;
  userName: string = '';

  constructor(
    private sidebarService: SidebarService,
    private dashboardService: DashboardService,
    private userSessionService: UserSessionService,
    private snackBarService: SnackBarService
  ) {
    this.isOpen$ = this.sidebarService.isOpen$;
  }

  isOpen$ = this.sidebarService.isOpen$;

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadUserName();
  }

  /**
   * Load dashboard data
   */
  loadDashboardData(): void {
    this.loading = true;
    
    // Load task stats
    this.dashboardService.getTaskDashboardStats().subscribe({
      next: (stats) => {
        console.log("Task dashboard stats:", stats);
        this.stats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.snackBarService.showError('Failed to load dashboard statistics');
        this.loading = false;
      }
    });

    // Load monthly stats
    this.dashboardService.getMonthlyStats(this.selectedValue).subscribe({
      next: (stats) => {
        this.monthlyStats = stats;
      },
      error: (error) => {
        console.error('Error loading monthly stats:', error);
      }
    });

    // Load notice board
    this.dashboardService.getNoticeBoard().subscribe({
      next: (message) => {
        this.message = message;
      },
      error: (error) => {
        console.error('Error loading notice board:', error);
      }
    });
  }

  /**
   * Load user name for greeting
   */
  loadUserName(): void {
    const user = this.userSessionService.userSession;
    if (user && user.full_name) {
      const firstName = user.full_name.split(' ')[0];
      this.userName = firstName;
    } else {
      this.userName = 'User';
    }
  }

  /**
   * Edit notice board
   */
  editNotice(): void {
    this.editing = true;
    this.editedMessage = this.message;
  }

  /**
   * Clear notice board
   */
  clearNotice(): void {
    this.editedMessage = '';
    this.editing = false;
  }

  /**
   * Broadcast notice board
   */
  broadcastNotice(): void {
    if (!this.editedMessage.trim()) {
      this.snackBarService.showError('Please enter a message');
      return;
    }

    this.dashboardService.updateNoticeBoard(this.editedMessage).subscribe({
      next: (response) => {
        if (response.success) {
          this.message = this.editedMessage;
          this.editing = false;
          this.snackBarService.showSuccess('Notice board updated successfully');
        } else {
          this.snackBarService.showError('Failed to update notice board');
        }
      },
      error: (error) => {
        console.error('Error updating notice board:', error);
        this.snackBarService.showError('Failed to update notice board');
      }
    });
  }

  /**
   * Handle fiscal year change
   */
  onFiscalYearChange(): void {
    this.dashboardService.getMonthlyStats(this.selectedValue).subscribe({
      next: (stats) => {
        this.monthlyStats = stats;
      },
      error: (error) => {
        console.error('Error loading monthly stats:', error);
        this.snackBarService.showError('Failed to load monthly statistics');
      }
    });
  }

  closeSidebar(): void {
    this.sidenav.close();
  }

  openSideBar(): void {
    this.sidenav.open();
  }

  /**
   * Get current date formatted
   */
  getCurrentDate(): string {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  }
}
