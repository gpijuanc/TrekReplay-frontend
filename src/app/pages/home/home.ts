import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViatgeService } from '../../services/viatge'; 
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule,FormsModule], 
  templateUrl: './home.html',
  styleUrls: []
})

export class Home implements OnInit {
  
  errorMessage: string = '';
  viatgesFiltrats: any[] = [];
  mostrarPaquets: boolean = true;
  totsElsViatges: any[] = [];
  cercaText: any;
  filtrePreuMaxim: number = 3000;
  preuMaximReal: number = 1;
  mostrarAfiliats: boolean = true;
  filtrePais: string = '';

  constructor(private viatgeService: ViatgeService) {}

  // Detall: 'ngOnInit' s'executa quan el component es carrega
  ngOnInit(): void {
    this.carregarViatges();
  }

  carregarViatges() {
    this.viatgeService.getViatges().subscribe({
      next: (data) => {
        this.totsElsViatges = data;
        this.calcularPreuMaxim();
        this.filtrePreuMaxim = this.preuMaximReal;
        this.aplicarFiltres();
      },
      error: (err) => {
        console.error('Error carregant viatges', err);
        this.errorMessage = 'Error al carregar els viatges.';
      }
    });
  }

  calcularPreuMaxim() {
    if (this.totsElsViatges.length === 0) return;

    // Busquem el valor més alt a la propietat 'preu'
    const max = this.totsElsViatges.reduce((acc, viatge) => {
      // Convertim a número, si és null (afiliats) compta com 0
      const preu = parseFloat(viatge.preu) || 0;
      return Math.max(acc, preu);
    }, 0);

    // Si el màxim és 0 (només hi ha afiliats), posem un mínim visual de 100
    this.preuMaximReal = max > 0 ? max : 100;
  }

  aplicarFiltres() {
    this.viatgesFiltrats = this.totsElsViatges.filter(viatge => {
      
      // 1. Filtre de Text (Cerca)
      const coincideixText = viatge?.titol?.toLowerCase().includes(this.cercaText?.toLowerCase());

      // 2. Filtre de Tipus (Checkboxes)
      let coincideixTipus = false;
      if (this.mostrarPaquets && viatge.tipus_viatge === 'Paquet Tancat') {
        coincideixTipus = true;
      }
      if (this.mostrarAfiliats && viatge.tipus_viatge === 'Afiliats') {
        coincideixTipus = true;
      }

      // 3. Filtre de Preu
      // Si és 'Afiliats' (preu null), sempre el mostrem si el checkbox està actiu
      // Si és 'Paquet Tancat', mirem el preu
      let coincideixPreu = true;
      if (viatge.tipus_viatge === 'Paquet Tancat') {
        coincideixPreu = parseFloat(viatge.preu) <= this.filtrePreuMaxim;
      }
      //Filtre de pais (com afegim la llista de paisos?)
      let coincideixPais = true;      
      if (this.filtrePais !== '') {
         // Comprovem si el viatge té països definits
         if (viatge.pais && Array.isArray(viatge.pais)) {
             // Mirem si ALGUN dels països del viatge coincideix amb el filtre
             // (Fem servir toLowerCase per evitar problemes de majúscules)
             coincideixPais = viatge.pais.some((p: string) => 
                p.toLowerCase().includes(this.filtrePais.toLowerCase())
             );
         } else {
             coincideixPais = false;
         }
      }

      return coincideixText && coincideixTipus && coincideixPreu && coincideixPais;
    });
  }
}