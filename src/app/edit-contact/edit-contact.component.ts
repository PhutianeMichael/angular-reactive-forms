import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactsService } from '../contacts/contacts.service';
import { addressTypeValues, phoneTypeValues } from '../contacts/contact.model';
import { restrictedWords } from '../validators/restricted-words-validator.directive';
import { DateValueAccessorDirective } from '../date-value-accessor/date-value-accessor.directive';
import { ProfileIconSelectorComponent } from '../profile-icon-selector/profile-icon-selector.component';
import { debounceTime, distinctUntilChanged } from 'rxjs';

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
    if (!contactId) {
      this.subscribeToAddressChanges();
      return
    }

    this.contactsService.getContact(contactId).subscribe(contact => {
      if (!contact) return;

      for (let i = 1; i < contact.phones.length; i++) {
        this.addPhone()
      }

      for (let i = 1; i < contact.addresses.length; i++) {
        this.addAddress();
      }
      this.contactForm.setValue(contact);
      this.subscribeToAddressChanges();
    })
  }

  addPhone() {
    this.contactForm.controls.phones.push(this.createPhonesFormGroup());
  }

  addAddress() {
    this.contactForm.controls.addresses.push(this.createAddressesFormGroup());
  }

  stringifyCompare(a: any, b: any) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  createPhonesFormGroup() {
    const phoneGroup = this.fb.nonNullable.group({
      phoneNumber: '',
      phoneType: '',
      preferred: false
    })

    phoneGroup.controls.preferred.valueChanges
      .pipe(distinctUntilChanged(this.stringifyCompare))
      .subscribe(value => {
      if (value) {
        phoneGroup.controls.phoneNumber.setValidators([Validators.required]);
      } else {
        phoneGroup.controls.phoneNumber.removeValidators([Validators.required]);
      }
      phoneGroup.controls.phoneNumber.updateValueAndValidity()
    })
    return phoneGroup;
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

  subscribeToAddressChanges() {
    const addressGroups = this.contactForm.controls.addresses;
    addressGroups.valueChanges
      .pipe(distinctUntilChanged(this.stringifyCompare))
      .subscribe(() => {
        for (const controlName in addressGroups.controls) {
          addressGroups.get(controlName)?.removeValidators([Validators.required]);
          addressGroups.get(controlName)?.updateValueAndValidity();
        }
      });

    addressGroups.valueChanges
      .pipe(debounceTime(3000), distinctUntilChanged(this.stringifyCompare))
      .subscribe(() => {
        for (const controlName in addressGroups.controls) {
          addressGroups.get(controlName)?.addValidators([Validators.required]);
          addressGroups.get(controlName)?.updateValueAndValidity();
        }
      });
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
