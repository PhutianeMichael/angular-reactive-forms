import { Component, forwardRef, Provider } from '@angular/core';
import { profileIconNames } from './profile-icon-names';
import { NgOptimizedImage } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const PROFILE_ICON_VALUE_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ProfileIconSelectorComponent),
  multi: true,
}

@Component({
  selector: 'app-profile-icon-selector',
  imports: [
    NgOptimizedImage,
  ],
  standalone: true,
  templateUrl: './profile-icon-selector.component.html',
  styleUrl: './profile-icon-selector.component.scss',
  providers: [PROFILE_ICON_VALUE_PROVIDER],
})
export class ProfileIconSelectorComponent implements ControlValueAccessor {

  profileIcons = profileIconNames;
  showAllIcons: boolean = true;
  selectedIcon!: string | null;

  onChange!: Function;
  onTouched!: Function;

  iconSelected(icon: string) {
    this.showAllIcons = false;
    this.selectedIcon = icon;
    this.onChange(icon);
  }

  writeValue(icon: string) {
    this.selectedIcon = icon;

    this.showAllIcons = !(icon && icon !== '');
  }

  registerOnChange(fn: Function) {
    this.onChange = (icon: string) => {
      fn(icon)
    };
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
