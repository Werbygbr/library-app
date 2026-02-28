import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { routes } from './app.routes';

function getMagyarPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  paginatorIntl.itemsPerPageLabel = 'Elemek oldalanként:';
  paginatorIntl.nextPageLabel = 'Következő oldal';
  paginatorIntl.previousPageLabel = 'Előző oldal';
  paginatorIntl.firstPageLabel = 'Első oldal';
  paginatorIntl.lastPageLabel = 'Utolsó oldal';
  paginatorIntl.getRangeLabel = (page, pageSize, length) => {
    if (length === 0 || pageSize === 0) return `0 / ${length}`;
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    return `${startIndex + 1} – ${endIndex} / ${length}`;
  };
  return paginatorIntl;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideNativeDateAdapter(),
    { provide: MatPaginatorIntl, useValue: getMagyarPaginatorIntl() }
  ]
};