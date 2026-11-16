import { Injectable, signal, computed, effect } from '@angular/core';
import { Transaction } from '../../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly STORAGE_KEY = 'finance_tracker_transactions';

  // 1. Główny stan aplikacji (inicjalizowany danymi z LocalStorage)
  private readonly transactionsSignal = signal<Transaction[]>(this.loadFromStorage());

  // 2. Publiczny sygnał tylko do odczytu (komponenty nie mogą go przypadkowo nadpisać)
  readonly transactions = this.transactionsSignal.asReadonly();

  // 3. Automatyczne wyliczenia (Computed Signals)
  readonly totalIncome = computed(() =>
    this.transactions()
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  readonly totalExpense = computed(() =>
    this.transactions()
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  readonly balance = computed(() => this.totalIncome() - this.totalExpense());

  constructor() {
    // 4. Automatyczny zapis do LocalStorage przy każdej zmianie sygnału
    effect(() => {
      const currentData = this.transactions();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentData));
    });
  }

  // Metody do modyfikacji stanu (CRUD)
  addTransaction(transaction: Omit<Transaction, 'id'>): void {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID() // Wbudowany w przeglądarkę generator unikalnego ID
    };

    this.transactionsSignal.update(list => [newTransaction, ...list]);
  }

  deleteTransaction(id: string): void {
    this.transactionsSignal.update(list => list.filter(t => t.id !== id));
  }

  // Prywatna metoda pomocnicza do odczytu przy starcie aplikacji
  private loadFromStorage(): Transaction[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
    loadMockData(): void {
    const today = new Date().toISOString().slice(0, 10);
    const mockTransactions: Transaction[] = [
      { id: crypto.randomUUID(), title: 'Wypłata za projekt', amount: 6500, type: 'income', category: 'Wynagrodzenie', date: today },
      { id: crypto.randomUUID(), title: 'Czynsz i media', amount: 1850, type: 'expense', category: 'Rachunki', date: today },
      { id: crypto.randomUUID(), title: 'Zakupy spożywcze', amount: 420.50, type: 'expense', category: 'Jedzenie', date: today },
      { id: crypto.randomUUID(), title: 'Bilet miesięczny / Paliwo', amount: 310, type: 'expense', category: 'Transport', date: today },
      { id: crypto.randomUUID(), title: 'Kino i kolacja', amount: 190, type: 'expense', category: 'Rozrywka', date: today }
    ];

    this.transactionsSignal.set(mockTransactions);
  }

}
