# FinanceTracker

Aplikacja internetowa do zapisywania i przeglądania przychodów oraz wydatków. Interfejs działa w przeglądarce, a dane transakcji są przechowywane lokalnie w `localStorage`.

## Technologie

- Angular 21 z samodzielnymi komponentami (standalone components)
- TypeScript i Angular Signals do zarządzania stanem
- Reactive Forms do obsługi formularza transakcji
- Tailwind CSS 4 do stylowania interfejsu
- Chart.js 4 do prezentacji wydatków na wykresie
- Vitest do testów jednostkowych

## Architektura

Aplikacja jest podzielona według odpowiedzialności:

```text
src/
  app/
    app.ts                         główny komponent i składanie widoku
    app.html                       układ pulpitu
    app.config.ts                  konfiguracja aplikacji i routera
    app.routes.ts                  definicje tras
    core/
      services/
        transaction.ts             stan transakcji i logika biznesowa
    features/
      dashboard/
        components/
          transaction-form/        formularz dodawania transakcji
          transaction-list/        lista, wyszukiwanie i filtrowanie
          expense-chart/           wykres wydatków według kategorii
    models/
      transaction.model.ts         typ danych transakcji
    shared/
      pipes/
        currency-sign-pipe.ts      formatowanie kwot i znaku
      validators/
        no-future-date.validator.ts walidacja daty
  styles.css                       globalne style i import Tailwind CSS
.postcssrc.json                    konfiguracja wtyczki PostCSS dla Tailwind
```

### Przepływ danych

```text
Formularz ──dodaje──> TransactionService ──udostępnia──> Lista i wykres
                           │
                           ├── oblicza przychody, wydatki i saldo
                           └── zapisuje transakcje w localStorage
```

`TransactionService` jest wspólnym źródłem danych dla komponentów. Przechowuje transakcje w Angular Signal, udostępnia ich widok tylko do odczytu i oblicza sumy przychodów, wydatków oraz saldo. Po zmianie stanu zapisuje dane w `localStorage`, a przy uruchomieniu aplikacji odczytuje je ponownie.

Każda transakcja ma identyfikator, nazwę, kwotę, rodzaj (`income` lub `expense`), kategorię i datę. Formularz sprawdza poprawność danych, w tym to, czy data nie jest z przyszłości. Lista korzysta ze stanu serwisu, umożliwia wyszukiwanie i filtrowanie oraz zleca serwisowi usuwanie wpisów. Wykres grupuje wydatki według kategorii.

### Style i komponenty współdzielone

Tailwind CSS jest ładowany globalnie przez `src/styles.css` i konfigurowany w `.postcssrc.json`. Współdzielony pipe formatuje kwoty, a walidator daty może być używany w formularzach.

## Uruchomienie lokalne

Wymagany jest Node.js w wersji obsługiwanej przez Angular 21 (zalecana wersja LTS) oraz npm.

```bash
npm install
npm start
```

Następnie otwórz `http://localhost:4200/`. Serwer developerski odświeża aplikację po zmianach w kodzie.

## Polecenia

```bash
npm start       # uruchamia serwer developerski
npm run build   # tworzy kompilację produkcyjną w dist/
npm test        # uruchamia testy jednostkowe
```

## Przechowywanie danych

Dane są przechowywane tylko w przeglądarce, w `localStorage`, pod kluczem `finance_tracker_transactions`. Aplikacja nie korzysta z serwera ani zdalnej bazy danych. Dane nie są współdzielone między przeglądarkami lub urządzeniami; wyczyszczenie pamięci witryny usuwa zapisane transakcje.
