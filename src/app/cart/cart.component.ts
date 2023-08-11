import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { Cart } from '../_models/cart';
import { User } from '../_models/user';
import { CartService } from '../_services/cart.service';
import { OrderItem } from '../_models/orderItem';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public cart!: Cart;
  public _fetchCart$: Observable<Cart>;

  constructor(
    private cartService: CartService,
    private toastr: ToastrService
  ) {
    const userJson = localStorage.getItem('user')
    const user: User = userJson !== null ? JSON.parse(userJson) : null;
    this._fetchCart$ = this.cartService.getCart$(user.id);
    this._fetchCart$.subscribe(res => {
      this.cart = res;
    })
  }

  ngOnInit(): void {
    console.log(this.cart)
  }

  get cart$(): Observable<Cart>{
    return this._fetchCart$;
  }

  quantityChanged(item: OrderItem){
    console.log(this.cart);

    this.cart.recalculateTotalPrice();
    this.cartService.editCart(this.cart).subscribe(res => {
      console.log("Cart edited successfully.")
    })

  }

  removeProduct(item: OrderItem){
    this.cart.removeItem(item);
    this.cartService.editCart(item).subscribe(res => {
      this.toastr.success("Product removed from cart.")
    })
  }

  order(){
    this.toastr.info("This function has not been implemented.")
  }
}
