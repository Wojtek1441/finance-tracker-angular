import { TestBed } from '@angular/core/testing';

import { Transaction } from './transaction';
import { TransactionService } from './transaction';

describe('Transaction', () => {
  let service: TransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

  loadMockData(): void {
    const today = new Date().toISOString().split('T');
    const mockTransactions: Transaction[] = [
      { id: crypto.randomUUID(), title: 'Wypłata za projekt', amount: 6500, type: 'income', category: 'Wynagrodzenie', date: today },
      { id: crypto.randomUUID(), title: 'Czynsz i media', amount: 1850, type: 'expense', category: 'Rachunki', date: today },
      { id: crypto.randomUUID(), title: 'Zakupy spożywcze', amount: 420.50, type: 'expense', category: 'Jedzenie', date: today },
      { id: crypto.randomUUID(), title: 'Bilet miesięczny / Paliwo', amount: 310, type: 'expense', category: 'Transport', date: today },
      { id: crypto.randomUUID(), title: 'Kino i kolacja', amount: 190, type: 'expense', category: 'Rozrywka', date: today }
    ];

    this.transactionsSignal.set(mockTransactions);
  }
