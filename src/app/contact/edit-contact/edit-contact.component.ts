import { Component, inject, Signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ContactsService } from '../services/contacts.service';
import { Contact } from '../models/contact.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-contact',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FormsModule,
  ],
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss'],
})
export class EditContactComponent {
  route = inject(ActivatedRoute);
  contactsService = inject(ContactsService);

  contact: Contact = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: null,
    favoritesRanking: 0,
    phone: {
      phoneNumber: '',
      phoneType: '',
    },
    address: {
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
      addressType: '',
    },
  }

  // Initialize the signal in a field initializer (an injection context). If no id is present,
  // create a signal from `of(undefined)` so the template can still bind safely.
  currentContact: Signal<Contact | undefined> = toSignal(
    this.route.snapshot.params['id']
      ? this.contactsService.getContactById(this.route.snapshot.params['id'])
      : of(undefined),
    {initialValue: undefined},
  );
  firstName: any;

  saveContact() {

  }
}
