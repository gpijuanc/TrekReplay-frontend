import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ViatgeService } from '../../services/viatge'; 
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-venedor-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './venedor-dashboard.html',
  styleUrls: []
})
export class VenedorDashboard implements OnInit {
  readonly #destroyRef = inject(DestroyRef);
  meusViatges: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private viatgeService: ViatgeService) {}

  ngOnInit(): void {
    this.carregarMeusViatges();
  }

     // Carregar els vaitges
  carregarMeusViatges() {
    this.errorMessage = '';
    this.successMessage = '';

    this.viatgeService.getMyViatges().pipe(
            takeUntilDestroyed(this.#destroyRef)
        ).subscribe({
      next: (data) => {
        this.meusViatges = data;
      },
      error: (err) => {
        console.error("Error carregant els meus viatges", err);
        this.errorMessage = "Error al carregar els teus viatges.";
      }
    });
  }

  // Esborrar viatge 
  esborrarViatge(id: number) {
    if (!confirm('Estàs segur que vols esborrar aquest viatge? Aquesta acció no es pot desfer.')) {
      return;
    }

    this.viatgeService.deleteViatge(id).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: (res) => {
        this.successMessage = res.message; 
        this.carregarMeusViatges(); 
      },
      error: (err) => {
        console.error("Error esborrant viatge", err);
        this.errorMessage = "Error a l'esborrar el viatge.";
      }
    });
  }

  // Deshabilitar o habilitar viatge
  canviarEstatPublicacio(id: number, estatActual: boolean) {
    const nouEstat = !estatActual;
    const accioText = nouEstat ? 'publicar' : 'deshabilitar';

    this.viatgeService.updateViatge(id, { publicat: nouEstat }).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: () => {
        this.successMessage = `Viatge ${accioText} correctament.`;
        this.carregarMeusViatges();
      },
      error: (err) => {
        console.error(`Error al ${accioText} el viatge`, err);
        this.errorMessage = `Error al ${accioText} el viatge.`;
      }
    });
  }
}