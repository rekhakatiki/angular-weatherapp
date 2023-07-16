import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ApiServiceService } from './api-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Weather App';
  form!: FormGroup;
  submitted = false;
  weatherdata: any;
  currentLocationWeatherdata: any;
  locationAccess!: Boolean;
  errorMsg!: string;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiServiceService
  ) {}

  ngOnInit() {
    this.getCurrentLocation();
    this.form = this.fb.group({
      location: new FormControl('', Validators.required),
    });
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          this.locationAccess = true;
          this.apiService.get({lat: position.coords.latitude, lon:position.coords.longitude, units: 'imperial' }).pipe(
            catchError((error) => {
              if (error.error instanceof ErrorEvent) {
                this.errorMsg = `Error: ${error.error.message}`;
              } else {
                this.errorMsg = this.apiService.getServerErrorMessage(error);
              }
              return throwError(() => error);
            })
          )
          .subscribe((data: any) => {
            this.currentLocationWeatherdata = data;
          });
        }
      );
    } else {
      this.locationAccess = false;
    }
  }

  onSubmit(form: FormGroup) {
    this.weatherdata = null;
    this.submitted = true;
    this.errorMsg = '';
    if (form.valid) {
      const location = form.value?.location?.trim();
      const params = this.setParamsBasedOnLocationValue(location);
      this.apiService
        .get(params)
        .pipe(
          catchError((error) => {
            if (error.error instanceof ErrorEvent) {
              this.errorMsg = `Error: ${error.error.message}`;
            } else {
              this.errorMsg = this.apiService.getServerErrorMessage(error);
            }
            return throwError(() => error);
          })
        )
        .subscribe((data: any) => {
          this.weatherdata = data;
        });
    }
  }

  setParamsBasedOnLocationValue(location: string) {
    const params: any = {
      units: 'imperial'
    };
    if (!Number.isNaN(parseInt(location))) {
      let locationArr = location.split(',');
      if (typeof locationArr === 'object') {
        locationArr = locationArr.filter((location: any) => location);
      }
      if (locationArr.length >= 2) {
        params.lat = locationArr[0]?.trim();
        params.lon = locationArr[1]?.trim();
      } else {
        params.zip = locationArr[0]?.trim();
      }
    } else {
      params.q = location;
    }
    return params;
  }


}
