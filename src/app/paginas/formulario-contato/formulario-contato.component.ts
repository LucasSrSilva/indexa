import { Component, OnInit } from '@angular/core';
import { ContainerComponent } from '../../componentes/container/container.component';
import { SeparadorComponent } from "../../componentes/separador/separador.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContatoService } from '../../services/contato.service';

@Component({
    selector: 'app-formulario-contato',
    standalone: true,
    templateUrl: './formulario-contato.component.html',
    styleUrl: './formulario-contato.component.css',
    imports: [
        ContainerComponent,
        SeparadorComponent,
        ReactiveFormsModule,
        RouterLink
    ]
})
export class FormularioContatoComponent implements OnInit {
  contatoForm!: FormGroup;

  constructor(
    private contatoService: ContatoService, 
    private router: Router,
    private activatedRoute: ActivatedRoute
  ){}

  ngOnInit() {
    this.incializarFormulario();
    this.carregarContato();
  }

  incializarFormulario(){
    this.contatoForm = new FormGroup({
      nome: new FormControl("", Validators.required),
      avatar: new FormControl(""),
      telefone: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required, Validators.email]),
      aniversario: new FormControl(""),
      redes: new FormControl(""),
      observacoes: new FormControl("")
    });
  }
  
  carregarContato(){
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if(id){
      this.contatoService.buscarPorId(parseInt(id)).subscribe((contato) => {
        this.contatoForm.patchValue(contato);
      });
    }
  }

  salvarContato(){
    const novoContato = this.contatoForm.value;
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    novoContato.id = id ? parseInt(id) : null

    this.contatoService.editarOuSalvarContato(novoContato).subscribe(() =>{
      this.contatoForm.reset();
      this.router.navigateByUrl('/lista-contatos');
    });

  }

  aoSelecionarArquivo(event: any){
    const file: File = event.target.files[0];
    if(file){
      this.lerArquivo(file)
    }
  }

  lerArquivo(file: File){
    const reader = new FileReader();
    reader.onload = () => {
      if(reader.result){
        this.contatoForm.get("avatar")?.setValue(reader.result);
      }
    }
    reader.readAsDataURL(file);
  }

  cancelar(){
    this.contatoForm.reset();
    this.router.navigateByUrl('/lista-contatos');
  }
}


