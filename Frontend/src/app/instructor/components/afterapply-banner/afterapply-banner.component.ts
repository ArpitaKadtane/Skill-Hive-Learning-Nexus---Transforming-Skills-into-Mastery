import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, ROUTES } from '@angular/router';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-afterapply-banner',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './afterapply-banner.component.html',
  styleUrl: './afterapply-banner.component.css'
})
export class AfterapplyBannerComponent {
  private route = inject(ActivatedRoute);
  isAdmin !:boolean;  
  ngOnInit() {
  const isAdminParam = this.route.snapshot.queryParamMap.get('isAdmin');
  this.isAdmin = isAdminParam === 'true';
}}
