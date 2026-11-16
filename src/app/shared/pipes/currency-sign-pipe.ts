import { Pipe, PipeTransform } from '@angular/core';
import { TransactionType } from '../../models/transaction.model';

@Pipe({
  name: 'currencySign',
  standalone: true
})
export class CurrencySignPipe implements PipeTransform {
  transform(amount: number, type: TransactionType): string {
    const sign = type === 'income' ? '+' : '-';
    // Formatowanie kwoty do 2 miejsc po przecinku z polskim separatorem
    const formattedAmount = amount.toFixed(2).replace('.', ',');
    return `${sign} ${formattedAmount} PLN`;
  }
}
