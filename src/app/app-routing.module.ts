import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompilerComponent } from './components/compiler/compiler.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
{ path: '', redirectTo: '/compiler', pathMatch: 'full' },
{ path: 'compiler', component: CompilerComponent },
 { path: '**', component: NotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
