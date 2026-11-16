import { Component, ElementRef, ViewChild, computed, effect, inject } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { TransactionService } from '../../../../core/services/transaction';

Chart.register(...registerables);

@Component({
  selector: 'app-expense-chart',
  standalone: true,
  template: `
    <div class="bg-white p-6 mt-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
      <h2 class="text-lg font-semibold text-slate-800 mb-4 self-start">Struktura wydatków</h2>
      @if (hasExpenses()) {
        <div class="w-full max-w-[260px]">
          <canvas #chartCanvas></canvas>
        </div>
      } @else {
        <p class="text-sm text-slate-500 py-12 text-center">Dodaj wydatki, aby zobaczyć wykres kategorii.</p>
      }
    </div>
  `
})
export class ExpenseChartComponent {
  private transactionService = inject(TransactionService);
  private chart: Chart | null = null;

  @ViewChild('chartCanvas') set canvasRef(el: ElementRef<HTMLCanvasElement> | undefined) {
    if (el) {
      this.renderChart(el.nativeElement);
    }
  }

  // Grupowanie wydatków według kategorii
  expensesByCategory = computed(() => {
    const map = new Map<string, number>();
    this.transactionService.transactions()
      .filter(t => t.type === 'expense')
      .forEach(t => map.set(t.category, (map.get(t.category) || 0) + t.amount));
    return map;
  });

  hasExpenses = computed(() => this.expensesByCategory().size > 0);

  constructor() {
    // Automatyczna aktualizacja wykresu po dodaniu lub usunięciu wydatku
    effect(() => {
      const dataMap = this.expensesByCategory();
      if (this.chart && dataMap.size > 0) {
        this.chart.data.labels = Array.from(dataMap.keys());
        this.chart.data.datasets[0].data = Array.from(dataMap.values());
        this.chart.update();
      }
    });
  }

  private renderChart(canvas: HTMLCanvasElement): void {
    if (this.chart) this.chart.destroy();

    const dataMap = this.expensesByCategory();
    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: Array.from(dataMap.keys()),
        datasets: [{
          data: Array.from(dataMap.values()),
          backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}
