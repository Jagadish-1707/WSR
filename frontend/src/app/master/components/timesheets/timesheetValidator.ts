import { AbstractControl, ValidatorFn, FormArray } from '@angular/forms';

export function dailyHoursValidator(): ValidatorFn {
  return (formArray: AbstractControl): { [key: string]: any } | null => {
    const dailyTotals: { [key: number]: number } = {};

    (formArray as FormArray).controls.forEach((control: AbstractControl) => {
      const logs = (control.get('logs') as FormArray).controls;
      logs.forEach((logControl: AbstractControl, index: number) => {
        if (!dailyTotals[index]) {
          dailyTotals[index] = 0;
        }
        dailyTotals[index] += logControl.get('logHours')?.value;
      });
    });

    const exceedsLimit = Object.values(dailyTotals).some(total => total > 24);

    return exceedsLimit ? { totalHoursExceeded: true } : null;
  };
}
