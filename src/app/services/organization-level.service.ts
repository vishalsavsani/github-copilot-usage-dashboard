import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrganizationLevelService {

  private copilotUsageDataUrl = 'assets/copilot_usage_data.json'; // URL to JSON data
  private copilotSeatsDataUrl = 'assets/copilot_seats_data.json'; // URL to JSON data

  constructor(private http: HttpClient) { }

  getCopilotUsageData(): Observable<any>  {
    // sample dta loaded from local file
    //return this.http.get(this.copilotUsageDataUrl);
    // uncomment below line to invoke API
    // modify the environment file to add your token
    // modify the organization name to your organization
     return this.invokeCopilotUsageApi();
  }

  getCopilotSeatsData(): Observable<any>  {
    // sample dta loaded from local file
    //return this.http.get(this.copilotSeatsDataUrl);
    // uncomment below line to invoke API
    // modify the environment file to add your token
    // modify the organization name to your organization
     return this.invokeCopilotSeatApi();
  }

  invokeCopilotUsageApi(): Observable<any> {
    const orgName = environment.orgName; 
    const apiUrl = `${environment.ghBaseUrl}/${orgName}/${environment.copilotUsageApiUrl}`;
    const token = environment.token; 
    
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28'
    });

    return this.http.get(apiUrl, { headers });
  }

  invokeCopilotSeatApi(): Observable<any> {
    const orgName = environment.orgName; 
    const apiUrl = `${environment.ghBaseUrl}/${orgName}/${environment.copilotSeatApiUrl}`;
    var data:any;
    var firstPage=true;
    var pageNo=1;
    var totalPages=1;

    // get the paginated Copilot Seat allocation data
    return this.getPaginatedSeatsData(apiUrl, pageNo).pipe(
        map((response: any) => {
          if (firstPage) {
            data = response;
            firstPage = false;
            totalPages = response.total_pages;
          } else {
            data.seats = data.seats.concat(response.seats);
          }

          // If there are more pages, recursively call this method
          if (pageNo < totalPages) {
            return this.invokeCopilotSeatApi();
          } else {
            // If there are no more pages, return the data
            return data;
          }
        })
    );
  }

  getPaginatedSeatsData(apiUrl:any, pageNo:any): Observable<any> {
    const token = environment.token; 
    
    const headers = new HttpHeaders({
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28'
    });

    return this.http.get(apiUrl+"?page="+pageNo, { headers });

  }

}
