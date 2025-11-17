import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViatgeService } from '../../services/viatge'; // Importem el servei
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule], // Afegim RouterModule per als enllaços
  templateUrl: './home.html',
  styleUrls: []
})
export class Home implements OnInit {
  
  viatges: any[] = []; // Array per desar els viatges
  errorMessage: string = '';

  constructor(private viatgeService: ViatgeService) {}

  // Detall: 'ngOnInit' s'executa quan el component es carrega
  ngOnInit(): void {
    this.carregarViatges();
  }

  carregarViatges() {
    // Cridem el servei per obtenir les dades de l'API
    this.viatgeService.getViatges().subscribe({
      next: (data) => {
        this.viatges = data; // Guardem les dades a l'array
      },
      error: (err) => {
        console.error('Error carregant viatges', err);
        this.errorMessage = 'Error al carregar els viatges.';
      }
    });
  }
}