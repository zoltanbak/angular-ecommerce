import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/model/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    // Get a handle to cart items
    this.cartItems = this.cartService.shoppingCart;

    // Subscribe to the cart total price
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // Subscribe to the cart total quantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    // Compute cart total price and total quantity
    this.cartService.computeCartTotals();
  }

  incrementQuantity(cartItem: CartItem): void {
    this.cartService.addToCart(cartItem);
  } 
  
  decrementQuantity(cartItem: CartItem): void {
    this.cartService.decrementQuantity(cartItem);
  }

  remove(cartItem: CartItem): void {
    this.cartService.remove(cartItem);
  }

}
