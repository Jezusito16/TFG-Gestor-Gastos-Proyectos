import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Expense } from '../expense';
import { ExpenseService } from '../expense.service';

@Component({
  selector: 'app-dialog-expense-delete',
  templateUrl: './dialog-expense-delete.component.html',
  styleUrls: ['./dialog-expense-delete.component.css'],
})
export class DialogExpenseDeleteComponent {
  expense: Expense;
  durationInSeconds = 3;
  @Output() onDeleteEmitter = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<DialogExpenseDeleteComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.expense = data.expense as Expense;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    if(this.expense.id != null) {
      ExpenseService.delete(this.expense.id).then((response) => {
        if (response.hasOwnProperty('expense_info'))
          this.onDeleteEmitter.emit();
        else {
          if (response.hasOwnProperty('message'))
            this.snackBar.open('Unable to delete project', 'Close', {
              duration: this.durationInSeconds * 1000,
            });
        }
      });
      this.dialogRef.close();
    }
  }
}
