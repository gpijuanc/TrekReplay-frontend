import { Component, DestroyRef, inject, OnInit, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router'; 
import { ViatgeService } from '../../services/viatge'; 
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../services/auth';
import { CarretService } from '../../services/carret';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-viatge-detall',
  imports: [CommonModule],
  templateUrl: './viatge-detall.html',
  styleUrls: []
})
export class ViatgeDetall implements OnInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly #route= inject(ActivatedRoute);
  
  viatge: any = null; 
  blogHtml: SafeHtml | null = null; 
  errorMessage: string = '';
  isLoggedIn: boolean = false;
  successMessage: string = '';
  backendUrl = 'http://127.0.0.1:8000';
  totesLesImatges: any[] = [];
  indexActual: number = 0;

  constructor(
    private viatgeService: ViatgeService, 
    private sanitizer: DomSanitizer,
    private carretService: CarretService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isLoggedIn = this.authService.isLoggedIn(); 
  }

  ngOnInit(): void {
    const idParam = this.#route.snapshot.paramMap.get('id');
    
    if (idParam) {
      const id = +idParam; 

      this.viatgeService.getViatgeById(id).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
        next: (data) => {
          this.viatge = data;
          this.prepararCarrusel();

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


  prepararCarrusel() {
    this.totesLesImatges = [];

    // Funció que neteja i munta la URL perfecta
    const muntarUrl = (path: string) => {
      if (!path) return 'assets/placeholder.png'; 
      if (path.startsWith('http')) return path;  
      
      let rutaNeta = path;

      if (!rutaNeta.startsWith('/')) {
        rutaNeta = '/' + rutaNeta;
      }

      if (!rutaNeta.startsWith('/storage')) {
        rutaNeta = '/storage' + rutaNeta;
      }

      return this.backendUrl + rutaNeta;
    };

    if (this.viatge.imatge_principal) {
      this.totesLesImatges.push({
        url: muntarUrl(this.viatge.imatge_principal),
        alt: this.viatge.titol
      });
    }

    if (this.viatge.fotos && this.viatge.fotos.length > 0) {
      this.viatge.fotos.forEach((f: any) => {
        this.totesLesImatges.push({
          url: muntarUrl(f.imatge_url),
          alt: f.alt_text
        });
      });
    }
  }

  seguentFoto() {
    if (this.indexActual < this.totesLesImatges.length - 1) {
      this.indexActual++;
    } else {
      this.indexActual = 0; 
    }
  }

  anteriorFoto() {
    if (this.indexActual > 0) {
      this.indexActual--;
    } else {
      this.indexActual = this.totesLesImatges.length - 1;
    }
  }

  afegirAlCarret() {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.viatge && this.viatge.tipus_viatge === 'Paquet Tancat') {
      this.carretService.addItem(this.viatge.id).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
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