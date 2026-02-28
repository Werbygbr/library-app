import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookService } from '../../../services/book.service';
import { AuthorService } from '../../../services/author.service';
import { Book } from '../../../models/book.model';
import { Author } from '../../../models/author.model';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div style="padding: 24px; max-width: 600px">
      <a mat-button routerLink="/books">
        <mat-icon>arrow_back</mat-icon> Vissza
      </a>

      <mat-card *ngIf="book" style="margin-top: 16px">
        <mat-card-header>
          <mat-card-title>{{ book.title }}</mat-card-title>
          <mat-card-subtitle>{{ book.genre }} · {{ book.year }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content style="padding-top: 16px">
          <p><strong>Szerző:</strong> {{ author?.name ?? 'Ismeretlen' }}</p>
          <p><strong>Nemzetiség:</strong> {{ author?.nationality }}</p>
          <p><strong>Leírás:</strong> {{ book.description }}</p>
        </mat-card-content>
      </mat-card>

      <p *ngIf="!book">Betöltés...</p>
    </div>
  `
})
export class BookDetailComponent implements OnInit {
  book?: Book;
  author?: Author;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private authorService: AuthorService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.bookService.getById(id).subscribe(b => {
      setTimeout(() => {
        this.book = b;
        this.authorService.getById(b.authorId).subscribe(a => {
          setTimeout(() => {
            this.author = a;
            this.cdr.detectChanges();
          });
        });
        this.cdr.detectChanges();
      });
    });
  }
}