import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ViatgeService } from '../../services/viatge';
import { QuillModule } from 'ngx-quill'; 
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface ImatgePendent {
  file: File;
  previewUrl: string | ArrayBuffer | null;
  alt: string;
}

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

  imatgesViatge: ImatgePendent[] = [];
  intentEnviat: boolean = false;

  isEditing: boolean = false;
  viatgeId: number | null = null;
  errorMessage: string = '';
  
  paisInput: string = '';

  // Configuració de l'Editor 
 quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ 'header': 1 }, { 'header': 2 }],
        ['link', 'image'], 
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['clean']
      ],

      handlers: {
        'image': () => this.imageHandler()
      }
    }
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

  onImatgesSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imatgesViatge.push({
            file: file,
            previewUrl: e.target?.result || null,
            alt: '' 
          });
        };
        reader.readAsDataURL(file);
      }
    }
    event.target.value = ''; // Reset per poder tornar a seleccionar
  }

  removeImatge(index: number) {
    this.imatgesViatge.splice(index, 1);
  }

  editorCreated(quill: any) {
    this.quillEditorInstance = quill;
  }

  //LA FUNCIÓ MÀGICA QUE DEMANA EL ALT
  imageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click(); 

    // Quan l'usuari tria un fitxer...
    input.onchange = () => {
      const file = input.files ? input.files[0] : null;
      
      if (file) {
        let altText = null;
        while (!altText) {
            altText = prompt("⚠️ OBLIGATORI: Escriu una descripció (ALT) per a la imatge:");
            if (altText === null) return; 
            if (altText.trim() === '') altText = null;
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
            const range = this.quillEditorInstance.getSelection(true);
            const imgUrl = e.target.result; // Base64 de la imatge

            this.quillEditorInstance.insertEmbed(range.index, 'image', imgUrl);

            setTimeout(() => {
                const img = document.querySelector(`.ql-editor img[src="${imgUrl}"]`);
                if (img) {
                    img.setAttribute('alt', altText as string);
                    console.log("ALT afegit correctament:", altText);
                }
            }, 10);
            
            this.quillEditorInstance.setSelection(range.index + 1);
        };
        reader.readAsDataURL(file);
      }
    };
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
    // Processar el país
    this.viatge.pais = this.paisInput.split(',').map(p => p.trim()).filter(p => p !== '');
    this.intentEnviat = true;
    const hiHaImatgesSenseAlt = this.imatgesViatge.some(img => !img.alt || img.alt.trim() === '');
    if (hiHaImatgesSenseAlt) {
        alert("⚠️ Totes les imatges han de tenir una descripció (ALT).");
        return; 
    }

    if (this.isEditing && this.viatgeId) {
      this.viatgeService.updateViatge(this.viatgeId, this.viatge).subscribe({
        next: () => this.pujarImatges(this.viatgeId!),
        error: (err) => this.errorMessage = 'Error actualitzant el viatge'
      });
    } else {
      this.viatgeService.createViatge(this.viatge).subscribe({
        next: (res) => this.pujarImatges(res.data.id), // Passem ID
        error: (err) => this.errorMessage = 'Error creant viatge'
       });
    }
  }
  

  // Funció encadenada per pujar imatges després de desar el text
  pujarImatges(id: number) {
    if (this.imatgesViatge.length === 0) {
        this.router.navigate(['/dashboard']);
        return;
    }
    const uploads = [];

    for (let i = 0; i < this.imatgesViatge.length; i++) {
        const img = this.imatgesViatge[i];
        
        uploads.push(this.viatgeService.uploadFotoGaleria(id, img.file, img.alt));
    }

    if (uploads.length === 0) {
        this.router.navigate(['/dashboard']);
        return;
    }

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