import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { BookService } from '../../../services/book.service';
import { AuthorService } from '../../../services/author.service';
import { Book } from '../../../models/book.model';
import { Author } from '../../../models/author.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink, MatButtonModule,
    MatInputModule, MatFormFieldModule, MatIconModule, MatCardModule,
    MatSelectModule, MatPaginatorModule
  ],
  template: `
  <div style="padding: 24px; display: flex; flex-direction: column; gap: 24px;">

    <!-- STAT BLOKKOK -->
    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
      <mat-card style="flex: 1; min-width: 150px; background: linear-gradient(135deg, #3f51b5, #5c6bc0); color: white; border-radius: 12px;">
        <mat-card-content style="padding: 20px;">
          <div class="stat-number" style="font-size: 32px; font-weight: 700;">{{ books.length }}</div>
          <div style="font-size: 14px; opacity: 0.9; margin-top: 4px;">📚 Összes könyv</div>
        </mat-card-content>
      </mat-card>
      <mat-card style="flex: 1; min-width: 150px; background: linear-gradient(135deg, #ff4081, #f48fb1); color: white; border-radius: 12px;">
        <mat-card-content style="padding: 20px;">
          <div class="stat-number" style="font-size: 32px; font-weight: 700;">{{ authors.length }}</div>
          <div style="font-size: 14px; opacity: 0.9; margin-top: 4px;">✍️ Szerzők száma</div>
        </mat-card-content>
      </mat-card>
      <mat-card style="flex: 1; min-width: 150px; background: linear-gradient(135deg, #00897b, #4db6ac); color: white; border-radius: 12px;">
        <mat-card-content style="padding: 20px;">
          <div class="stat-number" style="font-size: 32px; font-weight: 700;">{{ getLatestYear() }}</div>
          <div style="font-size: 14px; opacity: 0.9; margin-top: 4px;">📅 Legújabb könyv éve</div>
        </mat-card-content>
      </mat-card>
      <mat-card style="flex: 1; min-width: 150px; background: linear-gradient(135deg, #f57c00, #ffb74d); color: white; border-radius: 12px;">
        <mat-card-content style="padding: 20px;">
          <div class="stat-number" style="font-size: 32px; font-weight: 700;">{{ getGenreCount() }}</div>
          <div style="font-size: 14px; opacity: 0.9; margin-top: 4px;">🎭 Különböző műfajok</div>
        </mat-card-content>
      </mat-card>
    </div>

    <!-- FORM KÁRTYA -->
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ editingId ? '✏️ Könyv szerkesztése' : '📘 Új könyv hozzáadása' }}</mat-card-title>
      </mat-card-header>
      <mat-card-content style="padding-top: 16px; display: flex; flex-wrap: wrap; gap: 12px;">
        <mat-form-field appearance="outline" style="flex: 1; min-width: 200px;">
          <mat-label>Cím</mat-label>
          <mat-icon matPrefix>menu_book</mat-icon>
          <input matInput [(ngModel)]="form.title" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="flex: 1; min-width: 200px;">
          <mat-label>Szerző</mat-label>
          <mat-icon matPrefix>person</mat-icon>
          <mat-select [(ngModel)]="form.authorId">
            <mat-option *ngFor="let a of authors" [value]="a.id">{{ a.name }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" style="flex: 1; min-width: 120px;">
          <mat-label>Év</mat-label>
          <mat-icon matPrefix>calendar_today</mat-icon>
          <input matInput type="number" [ngModel]="form.year || ''" (ngModelChange)="form.year = $event" placeholder="pl. 2024" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="flex: 1; min-width: 150px;">
          <mat-label>Műfaj</mat-label>
          <mat-icon matPrefix>category</mat-icon>
          <input matInput [(ngModel)]="form.genre" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="flex: 2; min-width: 300px;">
          <mat-label>Leírás</mat-label>
          <mat-icon matPrefix>description</mat-icon>
          <textarea matInput [(ngModel)]="form.description" rows="1"></textarea>
        </mat-form-field>
      </mat-card-content>
      <mat-card-actions style="padding: 0 16px 16px 16px;">
        <button mat-raised-button color="primary" (click)="save()">
          <mat-icon>save</mat-icon>
          {{ editingId ? 'Mentés' : 'Hozzáadás' }}
        </button>
        <button mat-button *ngIf="editingId" (click)="cancelEdit()" style="margin-left: 8px">
          <mat-icon>cancel</mat-icon>
          Mégse
        </button>
      </mat-card-actions>
    </mat-card>

    <!-- KÖNYVLISTA KÁRTYA -->
    <mat-card>
      <mat-card-header>
        <mat-card-title>📚 Könyvlista</mat-card-title>
      </mat-card-header>
      <mat-card-content style="padding-top: 16px;">

        <div *ngIf="pagedBooks.length === 0" style="text-align: center; padding: 32px; color: #999;">
          <mat-icon style="font-size: 48px; width: 48px; height: 48px;">menu_book</mat-icon>
          <p style="margin-top: 8px;">Még nincs könyv felvéve</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <mat-card *ngFor="let b of pagedBooks" class="fade-in" style="border-left: 4px solid #3f51b5; border-radius: 8px;">
            <mat-card-content style="padding: 16px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <a [routerLink]="['/books', b.id]" style="font-size: 18px; font-weight: 600; color: #3f51b5;">
                  {{ b.title }}
                </a>
                <div style="margin-top: 4px; color: #666; font-size: 14px;">
                  <mat-icon style="font-size: 14px; width: 14px; height: 14px; vertical-align: middle;">person</mat-icon>
                  {{ getAuthorName(b.authorId) }} &bull;
                  <mat-icon style="font-size: 14px; width: 14px; height: 14px; vertical-align: middle;">calendar_today</mat-icon>
                  {{ b.year }}
                </div>
                <div style="margin-top: 4px;">
                  <span style="background: #e8eaf6; color: #3f51b5; padding: 2px 10px; border-radius: 12px; font-size: 12px;">
                    {{ b.genre }}
                  </span>
                </div>
              </div>
              <div>
                <button mat-icon-button color="primary" (click)="edit(b)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="delete(b.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <mat-paginator
          [length]="books.length"
          [pageSize]="pageSize"
          [pageSizeOptions]="[5, 10, 20]"
          (page)="onPage($event)"
          [showFirstLastButtons]="true"
          aria-label="Oldalak"
          style="margin-top: 16px;">
        </mat-paginator>

      </mat-card-content>
    </mat-card>

  </div>
  `
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  pagedBooks: Book[] = [];
  authors: Author[] = [];
  form: Book = { title: '', authorId: '', year: null, genre: '', description: '' };
  editingId: string | null = null;
  pageSize = 5;
  pageIndex = 0;

  constructor(private bookService: BookService, private authorService: AuthorService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.load();
    this.authorService.getAll().subscribe(a => {
      this.authors = a;
      this.cdr.detectChanges();
    });
  }

  load() {
    this.bookService.getAll().subscribe(data => {
      this.books = data;
      this.updatePage();
      this.cdr.detectChanges();
    });
  }

  updatePage() {
    const start = this.pageIndex * this.pageSize;
    this.pagedBooks = this.books.slice(start, start + this.pageSize);
  }

  onPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePage();
  }

  getAuthorName(authorId: string): string {
    const author = this.authors.find(a => a.id === authorId);
    return author ? author.name : 'Ismeretlen';
  }

  getLatestYear(): number | string {
    if (this.books.length === 0) return '-';
    return Math.max(...this.books.map(b => b.year ?? 0));
  }

  getGenreCount(): number {
    return new Set(this.books.map(b => b.genre).filter(g => g)).size;
  }

  save() {
    if (this.editingId) {
      this.bookService.update(this.editingId, this.form).subscribe(() => {
        setTimeout(() => {
          this.editingId = null;
          this.form = { title: '', authorId: '', year: null, genre: '', description: '' };
          this.cdr.detectChanges();
          this.load();
        });
      });
    } else {
      this.bookService.create(this.form).subscribe(() => {
        setTimeout(() => {
          this.form = { title: '', authorId: '', year: null, genre: '', description: '' };
          this.cdr.detectChanges();
          this.load();
        });
      });
    }
  }

  edit(book: Book) {
    this.editingId = book.id!;
    this.form = { ...book };
  }

  cancelEdit() {
    this.editingId = null;
    this.form = { title: '', authorId: '', year: null, genre: '', description: '' };
  }

  delete(id: string | undefined) {
    if (id) this.bookService.delete(id).subscribe(() => this.load());
  }
}