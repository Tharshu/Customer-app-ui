import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SlideComponent } from './pages/slide/slide.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [

    { path: '', component: AppComponent,
        children: [
            {path: '', redirectTo: 'home', pathMatch: 'full'},
            {path: 'home', canActivate:[], component: HomeComponent},
            // {path: 'register', canActivate:[], component: RegisterComponent},
        ]

    }
];
