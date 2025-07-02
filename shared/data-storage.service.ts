

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  // ✅ Save recipes to Firebase (with auth token via interceptor)
  storeRecipes() {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        const recipes = this.recipeService.getRecipes();
        return this.http.put(
          'https://ng-course-recipe-book-cabfa-default-rtdb.firebaseio.com/recipes.json',
          recipes
        );
      })
    );
  }

  // ✅ Fetch recipes from Firebase (can be used as-is)
  fetchRecipes(): Observable<Recipe[]> {
    return this.http
      .get<Recipe[]>(
        'https://ng-course-recipe-book-cabfa-default-rtdb.firebaseio.com/recipes.json'
      )
      .pipe(
        map(recipes => {
          return recipes.map(recipe => ({
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          }));
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
