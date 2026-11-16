import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TransactionService } from './core/services/transaction';
import { TransactionFormComponent } from './features/dashboard/components/transaction-form/transaction-form';
import { TransactionListComponent } from './features/dashboard/components/transaction-list/transaction-list';
import { ExpenseChartComponent } from './features/dashboard/components/expense-chart/expense-chart';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TransactionFormComponent,
    TransactionListComponent,
    ExpenseChartComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  transactionService = inject(TransactionService);
}
