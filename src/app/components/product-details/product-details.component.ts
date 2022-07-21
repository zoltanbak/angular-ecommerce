import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/model/cart-item';
import { Product } from 'src/app/model/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  // 
  product: Product = new Product();

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  handleProductDetails(): void {
    // Get the "id" param string and convert string to a number using "+" symbol
    const productId: number = +this.route.snapshot.params['id'];

    // Race condition, because this call is async and
    // property is not assigned a value until
    // data arrives from the ProductService method call
    this.productService.getProduct(productId).subscribe(
      data => {
        this.product = data;
      }
    );
  }

  addToCart(): void {
    console.log(`Adding to cart on product-details: ${this.product.name}, ${this.product.unitPrice}`);
    this.cartService.addToCart(new CartItem(this.product));
  }

}
