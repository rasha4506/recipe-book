import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';  
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';


@Component({
 selector: 'app-header',
  standalone: false,
 templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{
    isAuthenticated = false;
    private userSub: Subscription;
    constructor(private dataStorageService: DataStorageService, private authService: AuthService){}

    ngOnInit(): void {
        this.userSub = this.authService.user.subscribe(user =>
        {
            this.isAuthenticated =!!user;
            console.log(!user);
            console.log(!!user);
        }
        );
    }
    @Output() featureSelected=new EventEmitter<string>();

    onSelect(feature: string){
        this.featureSelected.emit(feature);

    }
    // onSaveData(){
    //     this.dataStorageService.storeRecipes();
        
    // }

    onSaveData() {
  this.dataStorageService.storeRecipes().subscribe({
    next: (response) => {
      console.log('Recipe saved to Firebase!', response);
    },
    error: (err) => {
      console.error('Error saving recipe:', err);
    }
  });
}

    onFetchData(){
        this.dataStorageService.fetchRecipes().subscribe();

    }

    onLogout() {
        this.authService.logout();
    }

ngOnDestroy(): void {
    this.userSub.unsubscribe();
}

}