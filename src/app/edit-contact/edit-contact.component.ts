import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactsService } from '../contacts/contacts.service';
import { addressTypeValues, phoneTypeValues } from '../contacts/contact.model';
import { restrictedWords } from '../validators/restricted-words-validator.directive';
import { DateValueAccessorDirective } from '../date-value-accessor/date-value-accessor.directive';
import { ProfileIconSelectorComponent } from '../profile-icon-selector/profile-icon-selector.component';

@Component({
  imports: [CommonModule, NgOptimizedImage, ReactiveFormsModule, DateValueAccessorDirective, ProfileIconSelectorComponent],
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css'],
})
export class EditContactComponent implements OnInit {
  contactForm = this.fb.nonNullable.group({
    id: '',
    icon: '',
    personal: false,
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    lastName: ['', [Validators.required, Validators.minLength(3)]],
    dateOfBirth: <Date | null>null,
    favoritesRanking: <number | null>null,
    phones: this.fb.array([this.createPhonesFormGroup()]),
    addresses: this.fb.array([this.createAddressesFormGroup()]),
    notes: ['', restrictedWords(['foo', 'bar'])],
  })

  phoneTypes = phoneTypeValues;
  addressTypes = addressTypeValues;

  constructor(
    private route: ActivatedRoute,
    private contactsService: ContactsService,
    private router: Router,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    const contactId = this.route.snapshot.params['id'];
    if (!contactId) return

    this.contactsService.getContact(contactId).subscribe(contact => {
      if (!contact) return;

      for (let i = 1; i < contact.phones.length; i++) {
        this.addPhone()
      }

      for (let i = 1; i < contact.addresses.length; i++) {
        this.addAddress();
      }
      this.contactForm.setValue(contact);
    })
  }

  addPhone() {
    this.contactForm.controls.phones.push(this.createPhonesFormGroup());
  }

  addAddress() {
    this.contactForm.controls.addresses.push(this.createAddressesFormGroup());
  }

  createPhonesFormGroup() {
    return this.fb.nonNullable.group({
      phoneNumber: '',
      phoneType: '',
    })
  }

  createAddressesFormGroup() {
    return this.fb.nonNullable.group({
      streetAddress: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      addressType: '',
    })
  }

  get firstName() {
    return this.contactForm.controls.firstName;
  }

  get lastName() {
    return this.contactForm.controls.lastName;
  }

  get notes() {
    return this.contactForm.controls.notes;
  }

  saveContact() {
    this.contactsService.saveContact(this.contactForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/contacts']),
    })
  }
}
