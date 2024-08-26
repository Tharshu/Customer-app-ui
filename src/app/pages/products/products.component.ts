import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../../core/service/products.service';
import { Product } from '../../core/model/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{

  productService = inject(ProductsService);

  loading: boolean = true;
  currentProductPage = 0;
  productPageSize = 20;
  products: Product[] = [];
  product: Product | undefined;
  productTotalItems = 0;




  ngOnInit(): void {

    this.getAllProduct();

  }


  getAllProduct() {
    this.loading = true;
    this.productService.getAllProductFilter(this.currentProductPage, this.productPageSize, "id,asc", "LKR").subscribe({
      next: (data) => {
        console.log("data {} ", data);
        this.products = data.data.content;
        console.log("product ", this.products);
        this.productTotalItems = data.data.totalElements;
        this.loading = false;
        console.log("Table data refreshed:", this.products);
      },
      error: (error) => {
        console.error("Error fetching products", error);
        this.loading = false;
      },
    });
  }


}
