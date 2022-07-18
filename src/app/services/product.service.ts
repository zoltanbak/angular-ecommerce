import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from 'src/app/model/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { ProductCategory } from '../model/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // Spring Data REST return only 20 products by default, so need to override that by url-param: http://localhost:8080/api/products?size=100
  private baseUrl: string = 'http://localhost:8080/api';
  private productUrl: string = this.baseUrl + '/products/search/findByCategoryId?id=';
  private searchUrl: string = this.baseUrl + '/products/search/findByNameContaining?name=';
  private categoryUrl: string = this.baseUrl + '/product-category';

  constructor(private httpClient: HttpClient) { }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  getProductList(categoryId: number): Observable<Product[]> {
    const searchUrl: string = `${this.productUrl}${categoryId}`;
    return this.getProducts(searchUrl);
  }

  searchProducts(keyword: string): Observable<Product[]> {
    return this.getProducts(this.searchUrl + keyword);
  }

  private getProducts(url: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(url).pipe(
      // Map JSON data from Spring Data REST to Product Array
      map(response => response._embedded.products)
    );
  }
}

// Helper interface
// Unwraps the JSON from Spring Data REST API
/*
 * {
 *    _embedded: {
 *      products: [ ... ]
 *    }
 * }
 */
interface GetResponseProduct {
  _embedded: {
    products: Product[];
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}