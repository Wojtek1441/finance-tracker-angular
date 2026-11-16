import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService } from '../../../../core/services/transaction';
import { TransactionType } from '../../../../models/transaction.model';
import { noFutureDateValidator } from '../../../../shared/validators/no-future-date.validator';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [ReactiveFormsModule], // Wymagane dla formularzy reaktywnych
  templateUrl: './transaction-form.html',
  styleUrls: ['./transaction-form.scss']
})
export class TransactionFormComponent {
  private fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);

  // Lista kategorii do wyboru w formularzu
  readonly categories = ['Jedzenie', 'Rachunki', 'Transport', 'Rozrywka', 'Wynagrodzenie', 'Inne'];

  // Definicja formularza z walidacją
  transactionForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    type: ['expense' as TransactionType, [Validators.required]],
    category: ['Jedzenie', [Validators.required]],
    date: [new Date().toISOString().split('T')[0], [Validators.required, noFutureDateValidator()]]
  });

  onSubmit(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched(); // Pokazuje błędy, jeśli user kliknął Zapisz na pustym formularzu
      return;
    }

    // Przekazanie danych do serwisu (Signals automatycznie przeliczą saldo)
    this.transactionService.addTransaction(this.transactionForm.getRawValue());

    // Reset formularza do wartości początkowych
    this.transactionForm.reset({
      title: '',
      amount: 0,
      type: 'expense',
      category: 'Jedzenie',
      date: new Date().toISOString().split('T')[0]
    });
  }
}
