import { Component, Input} from '@angular/core';
import { Recipe } from '../../recipe.model';

@Component({
  selector : 'app-recipe-item',
    standalone: false,

  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent {
 @Input() recipe: Recipe;
 @Input() index: number;

  
  
}
