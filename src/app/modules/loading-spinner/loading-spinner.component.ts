import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'loading-spinner',
  styleUrls: [ `./loading-spinner.component.scss` ],
  templateUrl: `./loading-spinner.component.html`
})
export class LoadingSpinnerComponent {
  @Input() public isLoading: boolean = true;
}
