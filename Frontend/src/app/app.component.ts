import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from './authentication/services/auth.service';
import { HeaderComponent } from "./authentication/components/header/header.component";
import { SidemenuComponent } from './authentication/components/sidemenu/sidemenu.component';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from '../app/side-menu/side-menu.component';
import { DashboardComponent } from './instructor/components/dashboard/dashboard.component';
import { FooterComponent } from './authentication/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, FormsModule, SidemenuComponent, HeaderComponent, CommonModule, SideMenuComponent, DashboardComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Skill Hive Learning Nexus';
  authsideMenu: boolean = false;
  candidateSideMenu: boolean = false;
  instructorSideMenu: boolean = false;
  loginData = {
    islogged: false,
    user: null,
    name: null,
    email: null,
    id: null,
  };
  constructor(public authService: AuthService) {
    this.loginData = this.authService.isAuthenticated();
  }

  sideMenuEventListener(e) {
    if (this.loginData.user == "admins") {
      this.authsideMenu = e;
    } else if (this.loginData.user == "users") {
      this.candidateSideMenu = e;
    } else {
      this.instructorSideMenu = e;
    }

  }

  closeSideMenu(e) {
    this.authsideMenu = false;
    this.candidateSideMenu = false;
    this.instructorSideMenu=false;
  }
}

