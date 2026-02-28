import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AuthorService } from '../../../services/author.service';
import { Author } from '../../../models/author.model';

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatButtonModule,
    MatInputModule, MatFormFieldModule, MatIconModule, MatCardModule,
    MatPaginatorModule
  ],
  template: `
  <div style="padding: 24px; display: flex; flex-direction: column; gap: 24px;">

    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ editingId ? '✏️ Szerző szerkesztése' : '👤 Új szerző hozzáadása' }}</mat-card-title>
      </mat-card-header>
      <mat-card-content style="padding-top: 16px; display: flex; flex-wrap: wrap; gap: 12px;">
        <mat-form-field appearance="outline" style="flex: 1; min-width: 200px;">
          <mat-label>Név</mat-label>
          <mat-icon matPrefix>badge</mat-icon>
          <input matInput [(ngModel)]="form.name" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="flex: 1; min-width: 200px;">
          <mat-label>Nemzetiség</mat-label>
          <mat-icon matPrefix>flag</mat-icon>
          <input matInput [(ngModel)]="form.nationality" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="flex: 1; min-width: 150px;">
          <mat-label>Születési év</mat-label>
          <mat-icon matPrefix>cake</mat-icon>
          <input matInput type="number" [ngModel]="form.birthYear || ''" (ngModelChange)="form.birthYear = $event" placeholder="pl. 1965" />
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

    <mat-card>
      <mat-card-header>
        <mat-card-title>👥 Szerzők listája</mat-card-title>
      </mat-card-header>
      <mat-card-content style="padding-top: 16px;">

        <div *ngIf="pagedAuthors.length === 0" style="text-align: center; padding: 32px; color: #999;">
          <mat-icon style="font-size: 48px; width: 48px; height: 48px;">person</mat-icon>
          <p style="margin-top: 8px;">Még nincs szerző felvéve</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <mat-card *ngFor="let a of pagedAuthors" class="fade-in" style="border-left: 4px solid #ff4081; border-radius: 8px;">
            <mat-card-content style="padding: 16px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 18px; font-weight: 600; color: #333;">{{ a.name }}</div>
                <div style="margin-top: 4px; color: #666; font-size: 14px;">
                  <mat-icon style="font-size: 14px; width: 14px; height: 14px; vertical-align: middle;">flag</mat-icon>
                  {{ a.nationality }} &bull;
                  <mat-icon style="font-size: 14px; width: 14px; height: 14px; vertical-align: middle;">cake</mat-icon>
                  {{ a.birthYear }}
                </div>
              </div>
              <div>
                <button mat-icon-button color="primary" (click)="edit(a)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="delete(a.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <mat-paginator
          [length]="authors.length"
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
export class AuthorListComponent implements OnInit {
  authors: Author[] = [];
  pagedAuthors: Author[] = [];
  form: Author = { name: '', nationality: '', birthYear: null };
  editingId: string | null = null;
  pageSize = 5;
  pageIndex = 0;

  constructor(private authorService: AuthorService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.load(); }

  load() {
    this.authorService.getAll().subscribe(data => {
      this.authors = data;
      this.updatePage();
      this.cdr.detectChanges();
    });
  }

  updatePage() {
    const start = this.pageIndex * this.pageSize;
    this.pagedAuthors = this.authors.slice(start, start + this.pageSize);
  }

  onPage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePage();
  }

  save() {
    if (this.editingId) {
      this.authorService.update(this.editingId, this.form).subscribe(() => {
        setTimeout(() => {
          this.editingId = null;
          this.form = { name: '', nationality: '', birthYear: null };
          this.cdr.detectChanges();
          this.load();
        });
      });
    } else {
      this.authorService.create(this.form).subscribe(() => {
        setTimeout(() => {
          this.form = { name: '', nationality: '', birthYear: null };
          this.cdr.detectChanges();
          this.load();
        });
      });
    }
  }

  edit(author: Author) {
    this.editingId = author.id!;
    this.form = { ...author };
  }

  cancelEdit() {
    this.editingId = null;
    this.form = { name: '', nationality: '', birthYear: null };
  }

  delete(id: string | undefined) {
    if (id) this.authorService.delete(id).subscribe(() => this.load());
  }
}