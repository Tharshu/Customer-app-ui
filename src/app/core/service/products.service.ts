import { inject, Injectable } from '@angular/core';
import { CachingService } from './caching.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiEndpoint, LocalStorage } from '../constants/constants';
import {
  Observable,
  switchMap,
  of,
  shareReplay,
  tap,
  catchError,
  throwError,
} from 'rxjs';
import { ApiResponse, PageResponse } from '../model/common.model';
import { Product } from '../model/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private cacheService = inject(CachingService);

  constructor(private http: HttpClient) {}

  // getUserToken() {
  //   if (typeof localStorage !== "undefined") {
  //     return localStorage.getItem(LocalStorage.token);
  //   }
  //   return null;
  // }

  // private getHeaders(): HttpHeaders {
  //   const token = this.getUserToken();
  //   return new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //   });
  // }

  getAllProductFilter(
    page: number,
    size: number,
    sort: string = 'id,asc',
    currencyCode: string // Added currency code as a parameter
  ): Observable<ApiResponse<PageResponse<Product>>> {
    const cacheKey = `products-${page}-${size}-${sort}`;
    return this.cacheService
      .get<ApiResponse<PageResponse<Product>>>(cacheKey)
      .pipe(
        switchMap((cachedData) => {
          if (cachedData) {
            return of(cachedData);
          } else {
            return this.http
              .get<ApiResponse<PageResponse<Product>>>(
                `${ApiEndpoint.Product.Prod}/filter?page=${page}&size=${size}&sort=${sort}`
              )
              .pipe(
                // map((response) => {
                //   response.data.content.forEach((product) => {
                //     const price = product.prices.find(
                //       (p) => p.currencyId.code === currencyCode
                //     );
                //     product.priceToDisplay = price ? price.amount : null;
                //   });
                //   return response;
                // }),
                shareReplay(1),
                tap((data) => this.cacheService.set(cacheKey, data)),
                catchError(this.handleError)
              );
          }
        })
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
