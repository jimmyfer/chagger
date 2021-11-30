import { Component, OnInit } from '@angular/core';
import { faCoffee, faFolder, faPlay, faPlus, faRocket, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {
  public isLogged = false;
  user: any;
  faCoffee = faCoffee;
  faUser = faUser;
  faFolder = faFolder;
  faPlay = faPlay;
  faRocket = faRocket;
  faPlus = faPlus;

  constructor(private authService: AuthService) { }

  async ngOnInit() {
  }

  onLogOut() {
    this.authService.signOut();
  }

}
