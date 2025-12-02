import { Component, inject, OnInit, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router'; 
import { ViatgeService } from '../../services/viatge'; 
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
    const idParam = this.#route.snapshot.paramMap.get('id');
    
    if (idParam) {
      const id = +idParam; 

      this.viatgeService.getViatgeById(id).subscribe({
        next: (data) => {
          this.viatge = data;

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

  // TO-DO: Que farem en un futur?
  afegirAlCarret() {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.viatge && this.viatge.tipus_viatge === 'Paquet Tancat') {
      
      this.carretService.addItem(this.viatge.id).subscribe({
        next: (res) => {
          console.log("Item afegit", res);
          this.successMessage = 'Producte afegit al carret!';
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