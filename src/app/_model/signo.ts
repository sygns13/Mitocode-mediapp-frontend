import { Paciente } from './paciente';

export class Signo {
    idSigno: number;
    temperatura: string;
    pulso: string;
    ritmo: string;
    fecha: string; //2020-02-13T11:30:05 ISODate || moment.js
    paciente: Paciente;
}