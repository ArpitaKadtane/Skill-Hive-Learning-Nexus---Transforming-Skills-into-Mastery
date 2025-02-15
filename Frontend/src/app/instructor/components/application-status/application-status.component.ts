import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-application-status',
  standalone: true,
  imports: [],
  templateUrl: './application-status.component.html',
  styleUrl: './application-status.component.scss'
})
export class ApplicationStatusComponent {
  applicantProfileDetails = {
    id:"",
    fullName: "",
    contactNumber: "",
    email: "",
    experience: 0,
    teachingDomain: "",
    specialization: "",
    degree: "",
    certifications: "",
    resume: ""
  };
  isAdmin: boolean = false;
  instructorId: string | null = null;
  private baseUrl = 'http://localhost:3000'; // Update with your API URL

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.fetchApplicantDetails(id);
      }
    });
  }

  fetchApplicantDetails(id: string) {
    this.http.get<any[]>(`${this.baseUrl}/applicantDetails?id=${id}`).subscribe(
      (data) => {
        if (data.length > 0) {
          this.applicantProfileDetails = data[0];
          this.instructorId = this.applicantProfileDetails.id;
        }
      },
      (error) => {
        console.error('Error fetching applicant details:', error);
      }
    );
  }
}
