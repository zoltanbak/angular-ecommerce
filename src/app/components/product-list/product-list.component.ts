import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Product } from 'src/app/model/product';
import { ProductService } from 'src/app/services/product.service';
import { Page } from 'src/app/model/page';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // Properties for pagination
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;
  readonly paginationMaxSize: number = 5;

  previousKeyword: string = "";

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  // Similar to @PostConstruct
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts(): void {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleListProducts(): void {
    // Check if "id" param is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      // Get the "id" param string and convert to a number using the "+" operator
      // this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
      this.currentCategoryId = +this.route.snapshot.params['id'];
      // this.currentCategoryId = +this.route.params.subscribe((params: Params) => {
      //   this.currentCategoryId = +params['id1'];
      // });
    } else {
      this.currentCategoryId = 1;
    }

    //
    // Check if we have a different category than previous
    // Note: Angular will reuse a component if it is currently being viewed
    //

    // If we have different category id than previous
    // then set the page number back to one
    if (this.previousCategoryId !== this.currentCategoryId) {
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, pageNumber=${this.pageNumber}`);

    // Get the products for the given category id
    // Method is invoked once "subscribe"
    this.productService.getProductListPaginate(this.pageNumber - 1,
                                               this.pageSize,
                                               this.currentCategoryId)
      .subscribe(this.processResult());
  }

  handleSearchProducts(): void {
    const keyword: string = this.route.snapshot.params['keyword'];

    // Set page number to 1 if the keyword is different than previously
    if (this.previousKeyword !== keyword) {
      this.pageNumber = 1;
    }

    this.previousKeyword = keyword;
    console.log(`currentKeyword=${keyword}, pageNumber=${this.pageNumber}`);

    // Search for the products using keyword
    this.productService.searchProductsPaginate(this.pageNumber - 1,
                                               this.pageSize,
                                               keyword)
      .subscribe(this.processResult());
  }

  updatePageSize(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }

  private processResult() {
    return (data: { _embedded: {
                      products: Product[];
                    };
                    page: {
                      number: number;
                      size: number;
                      totalElements: number; 
                    };
    }) => {
      // Assign results to the Product array
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }
}
