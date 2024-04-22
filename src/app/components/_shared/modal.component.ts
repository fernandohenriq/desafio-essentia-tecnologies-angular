import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="show"
      (click)="onShadowClick()"
      class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-white p-8 rounded-lg" (click)="$event.stopPropagation()">
        <ng-content></ng-content>
        <div class="flex justify-end mt-4">
          <button
            (click)="onConfirm()"
            class="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            *ngIf="confirm.observers.length > 0"
          >
            Confirm
          </button>
          <button
            (click)="onCancel()"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            *ngIf="cancel.observers.length > 0"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class ModalComponent {
  @Input() show: boolean = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() shadowClick = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

  onShadowClick() {
    this.shadowClick.emit();
  }
}
