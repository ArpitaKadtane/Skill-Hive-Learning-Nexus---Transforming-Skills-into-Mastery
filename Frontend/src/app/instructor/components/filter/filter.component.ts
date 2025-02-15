import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { iselectedFilters } from '../../models/shortlisted_instrtuctor.model';


@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  dropdownVisible = false;
  searchQuery = '';
  selectedFilters: iselectedFilters = { ratings: [], subjects: [] };
  subjects: string[] = ['Web Development', 'AI ML', 'Cloud Computing', 'DevOps'];

  @Output() filtersChanged = new EventEmitter<iselectedFilters>();
  @Output() searchQueryChanged = new EventEmitter<string>();

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.dropdownVisible = !this.dropdownVisible;
  }

  onFilterChange(type: 'ratings' | 'subjects', value: string,event: Event): void {
    const target = event.target as HTMLInputElement; 
    const isChecked = target.checked;
    if (isChecked) {
      this.selectedFilters[type].push(value);
    } else {
      this.selectedFilters[type] = this.selectedFilters[type].filter(filter => filter !== value);
    }
  }

  applyFilters(): void {
    this.dropdownVisible = false;
    this.filtersChanged.emit(this.selectedFilters);
  }

  onSearchChange(){
    this.searchQueryChanged.emit(this.searchQuery.trim())
;  }
}
