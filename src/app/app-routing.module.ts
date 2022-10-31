import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth/auth.guard';

/* tslint:disable */ 
const routes: Routes = [
  { 
    path: '', 
    // redirectTo: 'home', 
    loadChildren: './pages/home/home.module#HomePageModule',
    pathMatch: 'full' 
  },
  { 
    path: 'home', 
    loadChildren: './pages/home/home.module#HomePageModule'
  },
  { 
    path: 'dashboard', 
    loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule',
  },
  { 
    path: 'profile', 
    loadChildren: './pages/profile/profile.module#ProfilePageModule',
    canLoad: [AuthGuard]
  },
  { 
    path: 'contact', 
    loadChildren: './pages/contact-us/contact-us.module#ContactUsPageModule' 
  },
  { 
    path: 'about-us', 
    loadChildren: './pages/about-us/about-us.module#AboutUsPageModule' 
  },
  { 
    path: 'cms/:action', 
    loadChildren: './pages/cms/cms.module#CmsPageModule' 
  },
  { 
    path: 'service/:action/:id',
    loadChildren: './pages/service/service.module#ServicePageModule' 
  },
  { 
    path: 'news-details/:id', 
    loadChildren: './pages/news-details/news-details.module#NewsDetailsPageModule',

  },
  { 
    path: 'join-team', 
    loadChildren: './pages/join-team/join-team.module#JoinTeamPageModule' 
  },
  { 
    path: 'buy-sell-properties', 
    loadChildren: './pages/buy-sell-properties/buy-sell-properties.module#BuySellPropertiesPageModule' 
  },
  { 
    path: 'request-appointment', 
    loadChildren: './pages/request-appointment/request-appointment.module#RequestAppointmentPageModule' 
  },
  { 
    path: 'properties', 
    loadChildren: './pages/properties/properties.module#PropertiesPageModule', 
  },
  { 
    path: 'all-agents',
   loadChildren: './pages/all-agents/all-agents.module#AllAgentsPageModule' 
  },
  {
    path: '**',   // redirects all other routes to the main page
    // redirectTo: 'home',
    loadChildren: './pages/home/home.module#HomePageModule',

  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled', preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }