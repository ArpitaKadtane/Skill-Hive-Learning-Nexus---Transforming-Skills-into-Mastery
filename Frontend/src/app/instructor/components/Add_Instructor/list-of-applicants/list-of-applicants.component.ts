import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FilterComponent } from '../../filter/filter.component';
import { iselectedFilters } from '../../../models/shortlisted_instrtuctor.model';
import { RouterModule } from '@angular/router';
import { AfterapplyBannerComponent } from '../../afterapply-banner/afterapply-banner.component';


@Component({
  selector: 'app-list-of-applicants',
  standalone: true,
  imports: [FilterComponent, RouterModule, AfterapplyBannerComponent],
  templateUrl: './list-of-applicants.component.html',
  styleUrl: './list-of-applicants.component.css'
})
export class ListOfApplicantsComponent implements OnInit {

  instructors: any[] = [];
  filteredInstructors: any[] = [];
  loading: boolean = true;
  filters: iselectedFilters = { ratings: [], subjects: [] };

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchInstructors();
  }

  fetchInstructors() {
    this.http.get('http://localhost:3000/instructorDetails').subscribe({
      next: (data: any) => {
        this.instructors = data;
        this.filteredInstructors = [...this.instructors];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching instructors:', err);
        this.loading = false;
      },
    });
  }

  onfilterschanged(filter: iselectedFilters) {
    this.filters = filter;
    this.applyfilters();
  }

  applyfilters() {
    if (!this.filters.ratings.length && !this.filters.subjects.length) {
      this.filteredInstructors = [...this.instructors];
      return;
    }

    this.filteredInstructors = this.instructors.filter(instructor => {
      // console.log( `filter ke ander ki ratings ${this.filters.ratings}`)
      const matchesRating = !this.filters.ratings.length || this.filters.ratings.some(rating => {
        const stars = parseInt(rating);
        return instructor.instructorRating >= stars;
      });
      const matchesSubject = !this.filters.subjects.length || this.filters.subjects.includes(instructor.teachingDomain);
      return matchesRating && matchesSubject;
    })
  }


  onSearchQueryChanged(query: string) {
    this.applyfilters();
    if (query) {
      this.filteredInstructors = this.filteredInstructors.filter(instructor => instructor.fullName.toLowerCase().includes(query.toLocaleLowerCase()));
    }
  }

  // searchByName() {
  //   // Reset filters to show all instructors if the search query is empty
  //   if (!this.searchQuery.trim()) {
  //     this.filteredInstructors = [...this.instructors];
  //     return;
  //   }

  //   // Filter instructors by name
  //   this.filteredInstructors = this.instructors.filter((instructor) =>
  //     instructor.fullName
  //       .toLowerCase()
  //       .includes(this.searchQuery.trim().toLowerCase())
  //   );
  // }
}
