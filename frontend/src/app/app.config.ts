import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DropdownModule } from 'primeng/dropdown';

import { ConfirmationService, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MetricsCalculationPipe } from './shared/pipes/metrics-calculation.pipe';

import { routes } from './app.routes';
import { importProvidersFrom } from '@angular/core'; // Import this function

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    DatePipe,
    provideAnimations(),
    MessageService,
    ConfirmationService,
    MetricsCalculationPipe,
    importProvidersFrom(
      SplitButtonModule,
      DropdownModule,
      MessagesModule
    ) // Correct way to import modules
  ]
};
