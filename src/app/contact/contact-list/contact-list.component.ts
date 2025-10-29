import { Component, computed, inject } from '@angular/core';
import { ContactsService } from '../services/contacts.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Contact } from '../models/contact.model';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-contact-list',
  imports: [
    RouterLink,
    NgOptimizedImage,
  ],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.scss',
})
export class ContactListComponent {
  contactsService = inject(ContactsService);

  contacts = toSignal(this.contactsService.getContacts(), {initialValue: []});
  favouriteContacts = computed(() => this.contacts().filter(c => c.favoritesRanking && c.favoritesRanking > 0));

  contact = toSignal(this.contactsService.getContactById('A6rwe'), {})

  trackById(_index: number, item: Contact | null) {
    return item ? item.id : null;
  }

  onContactSelected(selectedContact: Contact) {
    console.log(selectedContact);
  }
}
