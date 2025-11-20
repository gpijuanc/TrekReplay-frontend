import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarretService } from '../../services/carret';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-carret',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carret.html',
  styleUrls: []
})
export class Carret implements OnInit {

  items: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private carretService: CarretService) {}

  ngOnInit(): void {
    this.carregarItems();
  }

  carregarItems() {
    this.carretService.getItems().subscribe({
      next: (data) => {
        this.items = data;
        console.log("Items del carret:", data);
      },
      error: (err) => {
        console.error("Error carregant carret", err);
        this.errorMessage = "Error al carregar el carret.";
      }
    });
  }

  esborrarItem(viatgeId: number) {
    this.carretService.removeItem(viatgeId).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        // Recarreguem els items per actualitzar la vista
        this.carregarItems(); 
      },
      error: (err) => {
        console.error("Error esborrant item", err);
        this.errorMessage = "Error a l'esborrar l'item.";
      }
    });
  }

  // Funció per calcular el total (simulació)
  calcularTotal() {
    return this.items.reduce((total, item) => total + parseFloat(item.viatge.preu), 0);
  }
}