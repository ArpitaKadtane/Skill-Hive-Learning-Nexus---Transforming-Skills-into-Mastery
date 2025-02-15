import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate } from '../models/candidate.model';
import { switchMap, catchError, map } from 'rxjs/operators';
import { AdditionalDetails } from '../models/candidate.model';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private candidatesUrl = 'http://localhost:3000/users';
  private additionalDetailsUrl = 'http://localhost:3000/additionalDetails_Candidates';

  constructor(private httpClient: HttpClient) { }


  getUserEmail() {
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('candidateEmail') == null) {
        return null;
      } else {
        return localStorage.getItem('candidateEmail');
      }
    } else {
      return false;
    }
  }

  getUserId() {
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('candidateId') == null) {
        return null;
      } else {
        return localStorage.getItem('candidateId');
      }
    } else {
      return false;
    }
  }

  getUserName() {
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('candidateName') == null) {
        return null;
      } else {
        return localStorage.getItem('candidateName');
      }
    } else {
      return false;
    }
  }

  // Register only additional details
  registerCandidate(additionalDetails: AdditionalDetails): Observable<void> {
    return this.httpClient.post<void>(this.additionalDetailsUrl, additionalDetails).pipe(
      catchError((error) => {
        console.error('Error during additional details registration:', error);
        throw new Error('Failed to register additional details. Try again.');
      })
    );
  }
  changePassword(email: string, currentPassword: string, newPassword: string): Observable<void> {
    return this.httpClient.get<Candidate[]>(`${this.candidatesUrl}?email=${email}`).pipe(
      switchMap((candidates: Candidate[]) => {
        if (candidates.length === 0) {
          throw new Error('Candidate not found');
        }
        const candidate = candidates[0];
        if (candidate.password !== currentPassword) {
          throw new Error('Current password is incorrect');
        }
        candidate.password = newPassword;
        return this.httpClient.put<void>(`${this.candidatesUrl}/${candidate.id}`, candidate);
      })
    );
  }

  loginCandidate(email: string, password: string): Observable<Candidate[]> {
    const url = `${this.candidatesUrl}?email=${email}&password=${password}`;
    localStorage.setItem('candidateEmail', email);
    return this.httpClient.get<Candidate[]>(url);
  }



  getCandidateByEmail(email: any): Observable<Candidate | null> {
    const url = `${this.candidatesUrl}?email=${email}`;
    return this.httpClient.get<Candidate[]>(url).pipe(
      map((candidates) => (candidates.length > 0 ? candidates[0] : null)),
      catchError((error) => {
        console.error('Error fetching candidate by email:', error);
        return new Observable<Candidate | null>((observer) => observer.next(null));
      })
    );
  }

  getAdditionalDetailsByEmail(email: any): Observable<AdditionalDetails | null> {
    const url = `${this.additionalDetailsUrl}?email=${email}`;
    // console.log('Fetching additional details with URL:', url); // Debugging log

    return this.httpClient.get<AdditionalDetails[]>(url).pipe(
      map((details) => {
        // console.log('API Response:', details); // Debugging log
        // Ensure the details array is not empty and contains data
        localStorage.setItem('candidateId', details[0]['id'])
        return details && details.length > 0 ? details[0] : null;
      }),
      catchError((error) => {
        console.error('Error fetching additional details by email:', error);
        return new Observable<AdditionalDetails | null>((observer) => observer.next(null));
      })
    );
  }

  updateProfile(candidate: Candidate, additionalDetails: AdditionalDetails): Observable<void> {
    // Construct URL to search for the candidate and additional details based on email
    const candidateUrl = `${this.candidatesUrl}?email=${candidate.email}`;
    const additionalDetailsUrl = `${this.additionalDetailsUrl}?email=${additionalDetails.email}`;

    return this.httpClient.get<Candidate[]>(candidateUrl).pipe(
      switchMap((candidateList) => {
        if (candidateList.length === 0) {
          throw new Error('Candidate not found');
        }
        // We assume email is unique and there will be exactly one match
        const candidateToUpdate = candidateList[0];  // Get the first matching candidate

        return this.httpClient.put<void>(`${this.candidatesUrl}/${candidateToUpdate.email}`, candidate).pipe( // Use email for PUT URL
          switchMap(() => {
            return this.httpClient.get<AdditionalDetails[]>(additionalDetailsUrl).pipe(
              switchMap((detailsList) => {
                if (detailsList.length === 0) {
                  throw new Error('Additional details not found');
                }
                // We assume email is unique and there will be exactly one match
                const detailsToUpdate = detailsList[0];  // Get the first matching additional details
                return this.httpClient.put<void>(`${this.additionalDetailsUrl}/${detailsToUpdate.email}`, additionalDetails); // Use email for PUT URL
              })
            );
          })
        );
      }),
      catchError((error) => {
        console.error('Error updating profile:', error);
        throw new Error('Error updating profile');
      })
    );
  }

  // Method to update any additional details based on email
  updateAdditionalDetails(email: string, details: any): Observable<void> {
    return this.httpClient.get<any[]>(`${this.additionalDetailsUrl}?email=${email}`).pipe(
      switchMap((candidates) => {
        if (candidates.length === 0) {
          throw new Error('Candidate not found');
        }

        const candidate = candidates[0];

        // Update the candidate's details
        Object.keys(details).forEach(key => {
          if (details[key]) {
            candidate[key] = details[key];  // Dynamically update the fields
          }
        });

        // Send the updated details to the server
        return this.httpClient.put<void>(`${this.additionalDetailsUrl}/${candidate.id}`, candidate);
      })
    );
  }
  checkPhoneNumber(phoneNumber: string, email: string): Observable<Candidate[]> {
    return this.httpClient.get<Candidate[]>(`${this.candidatesUrl}?phoneNumber=${phoneNumber}&email_ne=${email}`);
  }

}
