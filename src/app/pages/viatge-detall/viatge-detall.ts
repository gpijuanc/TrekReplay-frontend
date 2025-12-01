import { Component, inject, OnInit, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router'; // Per llegir l'ID de la URL
import { ViatgeService } from '../../services/viatge'; // El nostre servei
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // Per renderitzar HTML
import { AuthService } from '../../services/auth';
import { CarretService } from '../../services/carret';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viatge-detall',
  imports: [CommonModule],
  templateUrl: './viatge-detall.html',
  styleUrls: []
})
export class ViatgeDetall implements OnInit {
  readonly #route= inject(ActivatedRoute);
  viatge: any = null; 
  blogHtml: SafeHtml | null = null; 
  errorMessage: string = '';
  isLoggedIn: boolean = false;
  successMessage: string = '';

  constructor(
    private viatgeService: ViatgeService, 
    private sanitizer: DomSanitizer,
    private carretService: CarretService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isLoggedIn = this.authService.isLoggedIn(); //ngOninit?
  }

  ngOnInit(): void {
    // 1. Obtenim l'ID de la URL
    const idParam = this.#route.snapshot.paramMap.get('id');
    
    if (idParam) {
      const id = +idParam; // Convertim el string 'id' a número
      
      // 2. Cridem el servei per obtenir el viatge
      this.viatgeService.getViatgeById(id).subscribe({
        next: (data) => {
          this.viatge = data;
          
          // 3. Si és un viatge d'Afiliats, netegem l'HTML
          // (Això és vital per seguretat i per renderitzar el blog)
          if (this.viatge.tipus_viatge === 'Afiliats') {
            this.blogHtml = this.sanitizer.sanitize(SecurityContext.HTML, this.viatge.blog);
          }
        },
        error: (err) => {
          console.error('Error carregant el viatge', err);
          this.errorMessage = 'No s\'ha pogut trobar el viatge.';
        }
      });
    }
  }

  // TO-DO: Aquesta funció la implementarem quan fem el Carret
  afegirAlCarret() {
    // 1. Comprova si està loguejat
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    // 2. Comprova si és un paquet tancat (doble verificació)
    if (this.viatge && this.viatge.tipus_viatge === 'Paquet Tancat') {
      
      this.carretService.addItem(this.viatge.id).subscribe({
        next: (res) => {
          console.log("Item afegit", res);
          this.successMessage = 'Producte afegit al carret!';
          // Esborra el missatge després de 3 segons
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          console.error("Error afegint al carret", err);
          this.errorMessage = err.error.message || 'Error a l\'afegir al carret.';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }
}