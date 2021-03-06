import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogCreateExpenseComponent } from '../dialog-create-expense/dialog-create-expense.component';
import { DialogProjectDeleteComponent } from '../dialog-project-delete/dialog-project-delete.component';
import { ExpensesTableComponent } from '../expenses-table/expenses-table.component';
import { FileManagerService } from '../file-manager.service';
import { LocalStorageService } from '../local-storage.service';
import { Project } from '../project';
import { User } from '../user';

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
  fileManagerService = new FileManagerService();
  localStorageService = new LocalStorageService();
  routeSub: Subscription = new Subscription();
  projectId: any;
  user: User = new User();
  selectedFile: File | null = null;
  selectedFileSrc: string | null = null;
  selectedFileName: String | null = null;

  @ViewChild(ExpensesTableComponent)
  expensesTable!: ExpensesTableComponent;

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
      Project.load(this.projectId).then((response) => {   
        if ('project_info' in response) {
          this.project = Project.jsontoObject(response['project_info']);
          this.formGroup.controls['name'].setValue(this.project.name);
          this.formGroup.controls['category'].setValue(this.project.category);
          User.loadUser(this.project.admin).then((response) => {
            this.user = response;
          });
        } else {
          this.snackBar.open('Project can not be found', 'Close', {
            duration: 3 * 1000,
          });
        }
      });
    } catch (error) {}
  }

  modifyProject() {
    if (this.formGroup.valid) {
      this.project.name = this.formGroup.controls['name'].value;
      this.project.category = this.formGroup.controls['category'].value;
      if (this.selectedFile != null) this.project.img = this.selectedFile;
      this.project.update().then((response) => {
        if ('project_info' in response) {
          this.snackBar.open('Project updated successfully', 'Close', {
            duration: 3 * 1000,
          });
        } else if ('message' in response) {
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
        admin: this.user,
      },
    });

    ref.componentInstance.onCreateEmmiter.subscribe((data) => {
      this.expensesTable.updateExpenseList();
    });
  }

  onFileSelected(event: any) {
    const reader = new FileReader();
    if (event.target.files) {
      this.selectedFile = event.target.files[0];
      this.selectedFileName = this.fileManagerService.fixFileName(
        event.target.files[0]['name']
      );
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.selectedFileSrc = reader.result as string;
      };
    }
  }
}
