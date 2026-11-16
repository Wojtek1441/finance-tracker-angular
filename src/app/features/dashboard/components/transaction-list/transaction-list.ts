import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { TransactionService } from '../../../../core/services/transaction';
import { TransactionType } from '../../../../models/transaction.model';
import { CurrencySignPipe } from '../../../../shared/pipes/currency-sign-pipe';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [DatePipe, NgClass, CurrencySignPipe],
  templateUrl: './transaction-list.html'
})
export class TransactionListComponent {
  private transactionService = inject(TransactionService);

  // Sygnały przechowujące aktualny stan filtrów
  searchQuery = signal<string>('');
  selectedType = signal<'all' | TransactionType>('all');
  selectedCategory = signal<string>('all');

  readonly categories = ['all', 'Jedzenie', 'Rachunki', 'Transport', 'Rozrywka', 'Wynagrodzenie', 'Inne'];

  // Automatycznie przeliczana lista transakcji na podstawie aktywnych filtrów
  filteredTransactions = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const type = this.selectedType();
    const category = this.selectedCategory();

    return this.transactionService.transactions().filter(transaction => {
      const matchesQuery = transaction.title.toLowerCase().includes(query);
      const matchesType = type === 'all' || transaction.type === type;
      const matchesCategory = category === 'all' || transaction.category === category;

      return matchesQuery && matchesType && matchesCategory;
    });
  });

  // Metody aktualizujące filtry z poziomu HTML
  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  onTypeChange(type: 'all' | TransactionType): void {
    this.selectedType.set(type);
  }

  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCategory.set(select.value);
  }

  deleteTransaction(id: string): void {
    this.transactionService.deleteTransaction(id);
  }
}
