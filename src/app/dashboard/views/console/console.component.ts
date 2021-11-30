import { Component, OnInit } from '@angular/core';
import { faCoffee, faFolder, faPlay, faPlus, faRocket, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {
  // FIXME: Should be removed
  public isLogged = false;

  // FIXME: Should be removed (and "any" types should be avoided at all costs)
  user: any;

  // For the icons, the variables could be named by
  // their usage in the logic, and not what their "shape" is. This way,
  // we split the "logic" of the icons from the "visual" part.
  faCoffee = faCoffee;
  faUser = faUser;
  faFolder = faFolder;
  faPlay = faPlay;
  faRocket = faRocket;
  faPlus = faPlus;

  constructor(private authService: AuthService) { }

  // FIXME: Should be removed
  async ngOnInit() {
  }

  // FIXME: Needs return type
  onLogOut() {
    // FIXME: this promise is not being handled. It should be handled in case of error and in case of success
    this.authService.signOut();
  }

}
