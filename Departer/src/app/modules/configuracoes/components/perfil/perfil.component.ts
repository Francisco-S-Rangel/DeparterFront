import { SnackBarTheme } from './../../../shared/models/snackbat.theme.enum';
import { SnackbarComponent } from './../../../shared/components/snackbar/snackbar.component';
import { Router } from '@angular/router';
import { ValidatorField } from './../../../../helpers/ValidatorField';
import { FormGroup, FormControl, Validators, AbstractControlOptions } from '@angular/forms';
import { FuncionarioDto } from './../../../shared/models/funcionarioDto';
import { FuncionarioService } from './../../services/funcionario.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  funcionario!: FuncionarioDto;
  modoEditar = false;
  editUserForm!: FormGroup;

  @ViewChild('nome') nome!: ElementRef;

  hasError = false;
  errorMessage = "";

  get f(): any {
    return this.editUserForm.controls;
  }

  constructor(private funcionarioService: FuncionarioService, private router: Router, private readonly snackbarComponent: SnackbarComponent) { }

  ngOnInit(): void {
    this.modoEditar = false;
    this.getUser();
  }

  public getUser(): void {
    this.funcionarioService.getFuncionarioLogado().subscribe(
      (res) => {
        this.funcionario = res.data;
      },
      (err) => {
        this.hasError = true;
        this.errorMessage = err.error.message;
      },
      () => this.userValidation()
    )
  }

  public userValidation(): void {

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('senha', 'confirmarSenha')
    }

    this.editUserForm = new FormGroup({
      nome: new FormControl(this.funcionario.nome, [Validators.required, Validators.minLength(5)]),
      email: new FormControl(this.funcionario.email, [Validators.required, Validators.email]),
      apelido: new FormControl(this.funcionario.apelido, [Validators.required]),
      senha: new FormControl(this.funcionario.senha, [Validators.required, Validators.minLength(6)]),
      confirmarSenha: new FormControl(this.funcionario.senha, [Validators.required]),
      imagem: new FormControl(this.funcionario.imagem, [Validators.required]),
    }, formOptions);
  }

  public changeFuncionario(): void {
    if(this.editUserForm.valid){
      let funcionarioPut = this.editUserForm.value;
      funcionarioPut.id = this.funcionario.id;

      this.funcionarioService.putFuncionario(funcionarioPut).subscribe(
        (res) => {
          this.snackbarComponent.openSnackBar("Usúario alterado com sucesso !",SnackBarTheme.success,3000);
        },
        (err) => {
          this.hasError = true;
          this.errorMessage = err.error.message;
          this.snackbarComponent.openSnackBar("Erro ao alterar usúario", SnackBarTheme.error, 3000);
        },
        () => {this.ngOnInit();}
      );

    } else {
      //aviso
    }
  }

  public cssValidator(campoForm: FormControl): any {
    return { 'is-invalid': campoForm.errors && campoForm.touched }
  }

  public changeEditMode(): void {
    this.modoEditar = !this.modoEditar;
    if(this.modoEditar)
      this.nome.nativeElement.focus();
    this.userValidation();
  }

  

}
