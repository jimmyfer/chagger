import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  faCoffee,
  faFolder,
  faPlay,
  faPlus,
  faRocket,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { WorkspaceService } from 'src/app/services/workspace.service';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss'],
})

export class ConsoleComponent implements OnInit {

  @ViewChild('addWorkspaceInput', { static: false}) addWorkspaceInput: ElementRef<HTMLInputElement> = {} as ElementRef;

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

  consoleWorkspaces: { name: string; toggle: boolean }[] = [];

  addWorkspace: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private workspaceService: WorkspaceService
  ) {}

  ngOnInit() {
    this.userService.getUserWorkspaces().subscribe(resp => {
        this.consoleWorkspaces = [];
        resp.workspaces.forEach((workspace) => {
            this.consoleWorkspaces.push({name: workspace.name, toggle: false});
        })
    })
  }

  // FIXME: Needs return type
  onLogOut() {
    // FIXME: this promise is not being handled. It should be handled in case of error and in case of success
    this.authService.signOut();
  }

  workspaceClick(i: number, e: Event): void {
    e.preventDefault();
    this.consoleWorkspaces[i].toggle = !this.consoleWorkspaces[i].toggle;
  }

  newWorkspace( e: Event): void{
    e.preventDefault();
    console.log(e);
    switch (e.type) {
        case "click":
            this.addWorkspace = true;
            setTimeout(() => {
                this.addWorkspaceInput.nativeElement.focus();
            });
            break;
        case "blur":
            this.addWorkspace = false;
            this.addNewWorkspace(this.addWorkspaceInput.nativeElement.value);
            break;
        case "keyup":
            this.addWorkspace = false;
            this.addNewWorkspace(this.addWorkspaceInput.nativeElement.value);
            break;
    }
    
  }

  addNewWorkspace(workspaceName: string): void {
      this.workspaceService.addNewWorkspace({name: workspaceName});
  }
}
