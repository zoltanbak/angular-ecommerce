import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from 'src/app/model/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  shoppingCart: CartItem[] = [];
  // cartItem: CartItem[] = [];

  // Subject is a subclass of Observable, we can use Subject to publish events in our code
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(cartItem: CartItem): void {
      // Check if already have the item in our cart
      let alreadyExistsInCart: boolean = false;
      let existingCartItem: CartItem | undefined;

      if (this.shoppingCart.length > 0) {

        // Method returns the frist element in the array that passes a given test
        // 1. executes the test for each element in the array until the test passes
        // 2. if the test passes, then returns the first element in the array that passed
        // 3. if test fails for ALL elements, then returns undefined
        existingCartItem = this.shoppingCart.find( tempCartItem => tempCartItem.id === cartItem.id );
        //                                         current array element => test conditional

        alreadyExistsInCart = (existingCartItem != undefined);
      }

      if (alreadyExistsInCart && existingCartItem != undefined) {
        existingCartItem.quantity++;
      } else {
        this.shoppingCart.push(cartItem);
      }

      this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    
    for (let currentCartItem of this.shoppingCart) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // Publish new values so all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // Log cart data for debug
    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  logCartData(price: number, quantity: number): void {
    console.log('Content of the cart');

    for (let cartItem of this.shoppingCart) {
      const subTotalPrice: number = cartItem.quantity * cartItem.unitPrice;
      console.log(`name: ${cartItem.name}, quantity=${cartItem.quantity}, unitPrice=${cartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${price.toFixed(2)}, totalQuantity: ${quantity}`);
    console.log('====');
  }

}
