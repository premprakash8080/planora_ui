import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-input',
    templateUrl: './app-input.component.html',
    styleUrls: ['./app-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AppInputComponent),
            multi: true
        }
    ]
})
export class AppInputComponent implements ControlValueAccessor {
    @Input() label = '';
    @Input() placeholder = '';
    @Input() type: 'text' | 'password' | 'email' | 'number' | 'textarea' = 'text';
    @Input() required = false;
    @Input() disabled = false;
    @Input() readonly = false;
    @Input() error = '';
    @Input() hint = '';

    value: string = '';
    onChange: any = () => { };
    onTouch: any = () => { };

    writeValue(value: any): void {
        this.value = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.value = value;
        this.onChange(value);
        this.onTouch();
    }
}
