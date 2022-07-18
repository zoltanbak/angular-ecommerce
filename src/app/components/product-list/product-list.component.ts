import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Product } from 'src/app/model/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 0;
  searchMode: boolean = false;

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

    // Get the products for the given category id
    // Method is invoked once "subscribe"
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        // Assign results to the Product array
        this.products = data;
      }
    );
  }

  handleSearchProducts(): void {
    const keyword: string = this.route.snapshot.params['keyword'];

    // Search for the products using keyword
    this.productService.searchProducts(keyword).subscribe(
      data => {
        this.products = data;
      }
    );
  }
}
