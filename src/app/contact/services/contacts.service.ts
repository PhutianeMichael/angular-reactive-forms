import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Contact } from '../models/contact.model';


@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  http = inject(HttpClient);

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>('/api/contacts').pipe(
      tap(value => console.debug('ContactsService.getContacts emitted:', value)),
      catchError((error: HttpErrorResponse) => {
        console.error('ContactsService.getContacts error', error);
        return throwError(() => error);
      })
    );
  }

  getContactById(id: string): Observable<Contact | undefined> {
    return this.http.get<Contact>(`/api/contacts/${id}`).pipe(
      tap(value => console.debug(`ContactsService.getContactById(${id}) emitted:`, value)),
      catchError((error: HttpErrorResponse) => {
        console.error('ContactsService.getContactById error', error);
        return throwError(() => error);
      })
    );
  }

  // Create a new contact. The in-memory API will assign an id if not provided.
  createContact(contact: Partial<Contact>): Observable<Contact> {
    return this.http.post<Contact>('/api/contacts', contact).pipe(
      tap(created => console.debug('ContactsService.createContact created:', created)),
      catchError((error: HttpErrorResponse) => {
        console.error('ContactsService.createContact error', error);
        return throwError(() => error);
      })
    );
  }

  // Update an existing contact (PUT to /api/contacts/:id)
  updateContact(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`/api/contacts/${contact.id}`, contact).pipe(
      tap(updated => console.debug('ContactsService.updateContact updated:', updated)),
      catchError((error: HttpErrorResponse) => {
        console.error('ContactsService.updateContact error', error);
        return throwError(() => error);
      })
    );
  }

  // Delete a contact by id
  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`/api/contacts/${id}`).pipe(
      tap(() => console.debug(`ContactsService.deleteContact deleted id=${id}`)),
      catchError((error: HttpErrorResponse) => {
        console.error('ContactsService.deleteContact error', error);
        return throwError(() => error);
      })
    );
  }
}
