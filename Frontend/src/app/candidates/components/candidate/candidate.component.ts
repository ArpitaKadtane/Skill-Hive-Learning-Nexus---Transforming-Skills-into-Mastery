import { Component, OnInit } from '@angular/core';
import { SideMenuComponent } from "../../../side-menu/side-menu.component";
import { HeaderComponent } from "../header/header.component";
import { CandidateService } from '../../services/candidate.service';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { CandidateDashboardComponent } from "../candidate-dashboard/candidate-dashboard.component";
import { UpdateProfileComponent } from "../update-profile/update-profile.component";
import { ChangePasswordComponent } from "../change-password/change-password.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-candidate',
  standalone: true,
  imports: [SideMenuComponent, HeaderComponent, RouterModule, NgIf, CandidateDashboardComponent, UpdateProfileComponent, ChangePasswordComponent],
  templateUrl: './candidate.component.html',
  styleUrl: './candidate.component.css'
})
export class CandidateComponent implements OnInit{


  constructor(private router: Router,private candidateservice:CandidateService,private http: HttpClient) {}
  ngOnInit(): void {
    const userId = this.candidateservice.getUserId(); // Retrieve user ID

    if (!userId) {
      this.router.navigate(['/register']);
      return;
    }

    this.http.get<any[]>(`http://localhost:3000/additionalDetails_Candidates`).subscribe({
      next: (users) => {
        const userExists = users.some(user => user.id === userId);
        if (!userExists) {
          this.router.navigate(['/register']);
        }
      },
      error: () => {
        this.router.navigate(['/register']);
      }
    });
  }
  isMenuVisible: boolean = false;

  onMenuToggle() {
    this.isMenuVisible = !this.isMenuVisible;
  }
}
