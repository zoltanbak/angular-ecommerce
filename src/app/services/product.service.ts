import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from 'src/app/model/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { ProductCategory } from '../model/product-category';
import { Page } from '../model/page';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // Spring Data REST return only 20 products by default, so need to override that by url-param: http://localhost:8080/api/products?size=100
  private readonly baseUrl: string = 'http://localhost:8080/api';
  private readonly categoryUrl: string = this.baseUrl + '/product-category';
  private readonly productUrl: string = this.baseUrl + '/products'
  private readonly categoryIdUrl: string = this.productUrl + '/search/findByCategoryId?id=';
  private readonly nameUrl: string = this.productUrl + '/search/findByNameContaining?name=';

  constructor(private httpClient: HttpClient) { }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  getProductList(categoryId: number): Observable<Product[]> {
    const url: string = this.categoryIdUrl + categoryId;
    return this.getProducts(url);
  }

  getProductListPaginate(page: number,
                         pageSize: number,
                         categoryId: number): Observable<GetResponseProduct> {                
    const url: string = this.categoryIdUrl + categoryId + "&page=" + page + "&size=" + pageSize;
    return this.httpClient.get<GetResponseProduct>(url);
  }

  searchProducts(keyword: string): Observable<Product[]> {
    const url: string = this.nameUrl + keyword
    return this.getProducts(url);
  }

  searchProductsPaginate(page: number,
                         pageSize: number,
                         keyword: string): Observable<GetResponseProduct> {                
    const url: string = this.nameUrl + keyword + "&page=" + page + "&size=" + pageSize;
    return this.httpClient.get<GetResponseProduct>(url);
  }

  getProduct(id: number): Observable<Product> {
    const url: string = this.productUrl + '/' + id;
    return this.httpClient.get<Product>(url);
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
  },
  page: Page;
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}