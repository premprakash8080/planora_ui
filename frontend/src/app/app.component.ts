
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, LOCALE_ID, Renderer2 } from '@angular/core';
import { MatIconRegistry, SafeResourceUrlWithIconOptions } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl, Title } from '@angular/platform-browser';

import { NavigationService } from 'src/@vex/services/navigation.service';
import { SplashScreenService } from 'src/@vex/services/splash-screen.service';
import { CommonService } from './common/common.service';
import { UserSessionService } from './shared/services/user-session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sidebarMenu: Array<any> = [
    {
      type: "subheading",
      children: [
        {
          type: "link",
          label: "Dashboard",
          route: "/dashboard",
          icon: "../assets/img/icons/dashboard-icon.svg",
          iconActive: "assets/img/icons/dashboard-active-icon.svg",
          routerLinkActiveOptions: { exact: true },          
          hasPermission:false
        },
       
      ],
    },{
      type: "subheading",
      children: [
        {
          type: "link",
          label: "Inbox",
          route: "/dashboard/inbox",
          icon: "../assets/img/icons/dashboard-icon.svg",
          iconActive: "assets/img/icons/dashboard-active-icon.svg",
          routerLinkActiveOptions: { exact: true },          
          hasPermission:false
        },
      ],
    }
    ,
    {
      type: 'dropdown',
      label: 'Insights',
      icon: "mat:insights",
      children: [
        {
          type: 'link',
          label: 'Reporting',
          route: '/user-management',
          routerLinkActiveOptions: { exact: true }
        },
      ]
    }
  ];

 
  currentAppMenu: Array<any> = this.sidebarMenu;

  constructor(
    
    private renderer: Renderer2,
    private platform: Platform,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCALE_ID) private localeId: string,
   
  
    private navigationService: NavigationService,
    private splashScreenService: SplashScreenService,
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    private commonService: CommonService,
    private titleService: Title,
    private userSessionService:UserSessionService
  ) {
    
    //Settings.defaultLocale = this.localeId;

    if (this.platform.BLINK) {
      this.renderer.addClass(this.document.body, "is-blink");
    }

    this.matIconRegistry.addSvgIconResolver(
      (
        name: string,
        namespace: string
      ): SafeResourceUrl | SafeResourceUrlWithIconOptions | null => {
        switch (namespace) {
          case "mat":
            return this.domSanitizer.bypassSecurityTrustResourceUrl(
              `assets/img/icons/material-design-icons/two-tone/${name}.svg`
            );

          case "logo":
            return this.domSanitizer.bypassSecurityTrustResourceUrl(
              `assets/img/icons/logos/${name}.svg`
            );

          case "flag":
            return this.domSanitizer.bypassSecurityTrustResourceUrl(
              `assets/img/icons/flags/${name}.svg`
            );
        }
      }
    );


  
    /**
     * Add your own routes here
     */
    this.navigationService.items = this.currentAppMenu;

    // get new menu data after change mode of app
    this.commonService.appModeChange.subscribe(() => {
      this.manageMenuItems();
      this.navigationService.items = this.currentAppMenu;
      this.commonService.onUpdateSidebarMenu();
    });
  }



  ngOnInit() {
    this.titleService.setTitle("Planora | Super Admin")
  }

  
  ngAfterViewInit(): void {
   
    this.manageMenuItems();
  }
  /**
   * manage menu items according app mode
   */
  manageMenuItems() {
    // this.currentAppMenu.forEach(a=>{
    //   a.children.forEach(s=>{
    //     s.hasPermission=this.userSessionService.userPermissions.filter(p=>p==s.PermissionId).length>0
    //   })
    // });
  }   
   
}
