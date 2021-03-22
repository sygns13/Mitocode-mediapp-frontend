import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/_service/menu.service';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from 'src/environments/environment';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: string;
  roles: any;

  constructor(
    private menuService: MenuService
  ) { }

  ngOnInit(): void {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);

    const decodedToken = helper.decodeToken(token);
    this.usuario = decodedToken.user_name;
    this.roles = decodedToken.authorities;

    this.menuService.listarPorUsuario(this.usuario).subscribe(data => {
      this.menuService.setMenuCambio(data);
    });
  }

}
