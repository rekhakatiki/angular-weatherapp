import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  private baseurl = environment.weather?.baseurl;

  constructor(private http: HttpClient) { }

  /**
   * Get Http call based on query params
   * @param queryParams 
   * @returns Observable<any>
   */
  get(queryParams:any): Observable<any> {
      return this.http.get(this.baseurl, {params: queryParams})
  }

  /**
   * Get the error message based on http error response
   * @param error HttpErrorResponse
   * @returns string
   */
  getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 404: {
        return `Not Found: ${error.message}`;
      }
      case 403: {
        return `Access Denied: ${error.message}`;
      }
      case 500: {
        return `Internal Server Error: ${error.message}`;
      }
      default: {
        return `Unknown Server Error: ${error.message}`;
      }
    }
  }
}
