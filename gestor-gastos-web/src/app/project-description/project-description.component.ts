import { Component, OnInit, ViewChild } from '@angular/core';
import { Project } from '../project';
import { LocalStorageService } from '../local-storage.service';
import { Subscription } from 'rxjs';
import { ProjectService } from '../project.service';
import { User } from '../user';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateExpenseComponent } from '../dialog-create-expense/dialog-create-expense.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectExpensesTableComponent } from '../project-expenses-table/project-expenses-table.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogProjectDeleteComponent } from '../dialog-project-delete/dialog-project-delete.component';

@Component({
  selector: 'app-project-description',
  templateUrl: './project-description.component.html',
  styleUrls: ['./project-description.component.css'],
})
export class ProjectDescriptionComponent implements OnInit {
  formGroup: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
  });
  project: Project = new Project();
  localStorageService = new LocalStorageService();
  routeSub: Subscription = new Subscription();
  projectId: any;
  user: User = new User();

  @ViewChild(ProjectExpensesTableComponent)
  expensesTable!: ProjectExpensesTableComponent;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    try {
      this.routeSub = this.route.params.subscribe(
        (params: { [x: string]: any }) => {
          this.projectId = params['projectId'];
        }
      );
      ProjectService.loadProjectData(this.projectId).then((response) => {
        this.project = response as Project;
        this.formGroup.controls['name'].setValue(this.project.name);
        this.formGroup.controls['category'].setValue(this.project.category);
        User.loadUser(this.project.admin).then((response) => {
          this.user = response;
        });
      });
    } catch (error) {}
  }

  modifyProject() {
    if (this.formGroup.valid) {
      this.project.name = this.formGroup.controls['name'].value;
      this.project.category = this.formGroup.controls['category'].value;
      this.project.update().then((response) => {
        if (response.hasOwnProperty('project_info')) {
          this.snackBar.open('Project updated successfully', 'Close', {
            duration: 3 * 1000,
          });
        } else if (response.hasOwnProperty('message')) {
          this.snackBar.open('Error in parameters', 'Close', {
            duration: 3 * 1000,
          });
        }
      });
    }
  }

  deleteProject() {
    const ref = this.dialog.open(DialogProjectDeleteComponent, {
      data: { project: this.project },
    });

    ref.componentInstance.onDeleteEmitter.subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  createExpense() {
    const ref = this.dialog.open(DialogCreateExpenseComponent, {
      data: {
        projectId: this.projectId,
      },
    });

    ref.componentInstance.onCreateEmmiter.subscribe((data) => {
      this.expensesTable.updateExpenseList();
    });
  }
}
