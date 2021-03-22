import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Paciente } from 'src/app/_model/paciente';
import { Signo } from 'src/app/_model/signo';
import { SignoService } from 'src/app/_service/signo.service';
import { switchMap } from 'rxjs/operators';
import { PacienteService } from 'src/app/_service/paciente.service';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import {MatCardModule} from '@angular/material/card';
import { PacienteDialogoComponent } from './paciente-dialogo/paciente-dialogo.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signo-edicion',
  templateUrl: './signo-edicion.component.html',
  styleUrls: ['./signo-edicion.component.css']
})
export class SignoEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;
  tipoFrm: string = 'Registro';

  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();

  pacientes: Paciente[];
  pacientes$: Observable<Paciente[]>;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private signoService: SignoService,
    private snackBar: MatSnackBar,
    private pacienteService: PacienteService) { }

    ngOnInit(): void {

      this.pacienteService.getPacienteCambio().subscribe(data => {
        this.listarPacientes();
      });
  
      this.pacienteService.getMensajeCambio().subscribe(data => {
        this.snackBar.open(data, 'AVISO', { duration: 2000 });
      });

      this.listarPacientes();

      this.fechaSeleccionada = new Date();
      this.fechaSeleccionada.setHours(0);
      this.fechaSeleccionada.setMinutes(0);
      this.fechaSeleccionada.setSeconds(0);
      this.fechaSeleccionada.setMilliseconds(0);

      this.form = new FormGroup({
        'id': new FormControl(0),
        'idPacienteSeleccionado': new FormControl(0),
        'fechaSeleccionada': new FormControl(this.fechaSeleccionada),
        'temperatura': new FormControl(''),
        'pulso': new FormControl(''),
        'ritmo': new FormControl(''),
      });
  
      this.route.params.subscribe((data: Params) => {
        this.id = data['id'];
        this.edicion = data['id'] != null;
        this.initForm();
      });
    }

    listarPacientes() {
      //this.pacienteService.listar().subscribe(data => this.pacientes = data);
      this.pacientes$ = this.pacienteService.listar();
    }

    operar() {
      let signo = new Signo();
      let paciente = new Paciente();
      paciente.idPaciente = this.form.value['idPacienteSeleccionado'];

      signo.idSigno = this.form.value['id'];
      signo.temperatura = this.form.value['temperatura'];
      signo.pulso = this.form.value['pulso'];
      signo.ritmo = this.form.value['ritmo'];
      signo.fecha = moment(this.form.value['fechaSeleccionada']).format('YYYY-MM-DDTHH:mm:ss');
      signo.paciente = paciente
  
      if (this.edicion) {
        //MODIFICAR
        //PRACTICA COMUN
        this.signoService.modificar(signo).subscribe(() => {
          this.signoService.listar().subscribe(data => {
            this.signoService.setSignoCambio(data);
            this.signoService.setMensajeCambio('SE MODIFICÓ');
          });
        });
      } else {
        //REGISTRAR
        //PRACTICA IDEAL
        this.signoService.registrar(signo).pipe(switchMap(() => {
          return this.signoService.listar();
        })).subscribe(data => {
          this.signoService.setSignoCambio(data);
          this.signoService.setMensajeCambio('SE REGISTRO');
        });
      }
  
      this.router.navigate(['pages/signo']);
  
    }
  
    initForm() {
      if (this.edicion) {
        this.tipoFrm = 'Edición';

        this.signoService.listarPorId(this.id).subscribe(data => {


          this.fechaSeleccionada = new Date();
          this.fechaSeleccionada = moment(data.fecha, 'YYYY-MM-DD').toDate();

          this.form = new FormGroup({
            'id': new FormControl(data.idSigno),
            'temperatura': new FormControl(data.temperatura),
            'pulso': new FormControl(data.pulso),
            'ritmo': new FormControl(data.ritmo),
            'fechaSeleccionada': new FormControl(this.fechaSeleccionada),
            'idPacienteSeleccionado': new FormControl(data.paciente.idPaciente),
          });
        });
      }
    }

    nuevoPaciente(){
      console.log("hola");
      this.dialog.open(PacienteDialogoComponent, {
        width: '500px'
      });
    }

}

