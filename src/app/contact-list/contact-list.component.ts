import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContactsService } from '../contacts/contacts.service';
import { Contact } from '../contacts/contact.model';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];

  destroy$ = new Subject<void>();

  constructor(private contactsService: ContactsService) {
  }

  ngOnInit() {
    this.contactsService.getAllContacts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(contacts => this.contacts = contacts);
  }

  get favoriteContacts(): Contact[] {
    return this.contacts
      .filter(c => c.favoritesRanking && c.favoritesRanking > 0)
      .sort(this.sortByFavoriteRanking);
  }

  sortByFavoriteRanking(a: Contact, b: Contact): number {
    if (!a.favoritesRanking)
      return -1;
    if (!b.favoritesRanking)
      return 1;
    if (a.favoritesRanking < b.favoritesRanking)
      return -1;
    else if (a.favoritesRanking > b.favoritesRanking)
      return 1;

    return 0;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
