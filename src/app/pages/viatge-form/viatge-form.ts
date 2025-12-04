import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ViatgeService } from '../../services/viatge';
import { QuillModule } from 'ngx-quill'; 
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-viatge-form',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule], 
  templateUrl: './viatge-form.html',
  styleUrls: []
})
export class ViatgeForm implements OnInit {
  
  readonly #destroyRef = inject(DestroyRef);
  viatge: any = {
    titol: '',
    blog: '',
    tipus_viatge: 'Afiliats', 
    preu: null,
    publicat: true,
    pais: [] 
  };

  portadaFile: File | null = null;
  galeriaFiles: FileList | null = null;

  isEditing: boolean = false;
  viatgeId: number | null = null;
  errorMessage: string = '';
  
  paisInput: string = '';

  // Configuració de l'Editor (Botons que apareixen)
  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'header': 1 }, { 'header': 2 }],
      ['link', 'image'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ]
  };
  savedSelection: any = null; 
  
  // Llista de plataformes
  plataformes = [
    { name: 'Booking.com', key: 'Booking.com' },
    { name: 'Revolut', key: 'Revolut' },
    { name: 'Trip.com', key: 'Trip.com' }
  ];
  
  // Variables 
  showAffiliateModal: boolean = false;
  affiliateData = { platform: 'Booking.com', url: '', text: '' };
  quillEditorInstance: any;

  constructor(
    private viatgeService: ViatgeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Comprovem si estem editant (si hi ha ID a la URL)
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditing = true;
      this.viatgeId = +idParam;
      this.carregarViatge(this.viatgeId);
    }
  }

  carregarViatge(id: number) {
    this.viatgeService.getViatgeById(id).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: (data) => {
        this.viatge = data;
        if (this.viatge.pais && Array.isArray(this.viatge.pais)) {
            this.paisInput = this.viatge.pais.join(', ');
        }
      },
      error: (err) => this.errorMessage = 'Error carregant el viatge'
    });
  }

  // Imatges
  onPortadaSelected(event: any) {
    this.portadaFile = event.target.files[0];
  }
  
  onGaleriaSelected(event: any) {
    this.galeriaFiles = event.target.files;
  }

  editorCreated(quill: any) {
    this.quillEditorInstance = quill;
  }

  obrirModalAfiliat() {
    const range = this.quillEditorInstance.getSelection();
    
    if (range) {
      this.savedSelection = range;
      
      if (range.length > 0) {
        this.affiliateData.text = this.quillEditorInstance.getText(range.index, range.length);
      } else {
        this.affiliateData.text = ''; 
      }
    } else {
        this.savedSelection = null;
        this.affiliateData.text = '';
    }

    this.affiliateData.url = '';
    this.showAffiliateModal = true;
  }

  inserirEnllacAfiliat() {
    if (!this.affiliateData.url || !this.affiliateData.text) {
        alert("Has d'omplir la URL i el Text.");
        return;
    }

    // Cridem al Back-end per obtenir la URL transformada
    this.viatgeService.generarEnllac(this.affiliateData.platform, this.affiliateData.url).pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (res) => {
            const urlFinal = res.url; // La URL amb els IDs ja posats
            
            const index = this.savedSelection ? this.savedSelection.index : (this.quillEditorInstance.getLength() - 1);
            const length = this.savedSelection ? this.savedSelection.length : 0;

            // HTML estàndard
            const linkHtml = `<a href="${urlFinal}" target="_blank" rel="nofollow noopener noreferrer">${this.affiliateData.text}</a>`;
            
            if (length > 0) {
                this.quillEditorInstance.deleteText(index, length);
            }
            this.quillEditorInstance.clipboard.dangerouslyPasteHTML(index, linkHtml);
            
            this.showAffiliateModal = false;
        },
        error: (err) => {
            console.error(err);
            alert("Error generant l'enllaç. Revisa la URL.");
        }
      });
  }

  //GUARDAR
  onSubmit() {
    // 1. Processar el país
    this.viatge.pais = this.paisInput.split(',').map(p => p.trim()).filter(p => p !== '');

    if (this.isEditing && this.viatgeId) {
      this.viatgeService.updateViatge(this.viatgeId, this.viatge).subscribe({
        next: () => this.pujarImatges(this.viatgeId!),
        error: (err) => this.errorMessage = 'Error actualitzant el viatge'
      });
    } else {
      this.viatgeService.createViatge(this.viatge).subscribe({
        next: (res) => this.pujarImatges(res.data.id),
        error: (err) => this.errorMessage = 'Error creant el viatge'
      });
    }
  }

  // Funció encadenada per pujar imatges després de desar el text
  pujarImatges(id: number) {
    const uploads = [];

    // 1. Portada
    if (this.portadaFile) {
      uploads.push(this.viatgeService.uploadImatgePrincipal(id, this.portadaFile));
    }

    // 2. Galeria (Bucle)
    if (this.galeriaFiles) {
      for (let i = 0; i < this.galeriaFiles.length; i++) {
        uploads.push(this.viatgeService.uploadFotoGaleria(id, this.galeriaFiles[i], 'Galeria'));
      }
    }

    // Si no hi ha imatges, acabem
    if (uploads.length === 0) {
        this.router.navigate(['/dashboard']);
        return;
    }

    // Executem totes les pujades (simulació simple, idealment amb forkJoin)
    let completats = 0;
    uploads.forEach(obs => {
        obs.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
            next: () => {
                completats++;
                if (completats === uploads.length) {
                    this.router.navigate(['/dashboard']);
                }
            },
            error: (e) => console.error("Error pujant imatge", e)
        });
    });
  }
}