import { Recipe } from './recipe.model';
import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
  recipeSelected = new Subject<Recipe>();
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];
  // private recipes: Recipe[]  = [
  //     // tslint:disable-next-line: max-line-length
  //     new Recipe('Tasty Schnitzel',
  //            'A super-tasty Schnitzel - just awesome!',
  //             'https://assets.bonappetit.com/photos/57ae1afd53e63daf11a4e26f/2:1/w_880,c_limit/chicken-schnitzel.jpg?mbid=social_retweet',
  //           [
  //             new Ingredient('Meat', 1),
  //             new Ingredient('French Fries', 20)
  //           ]),
  //     // tslint:disable-next-line: max-line-length
  //     new Recipe('Big Fat Burger',
  //            'What else you need to say?',
  //             'https://www.seriouseats.com/recipes/images/2015/07/20150702-sous-vide-hamburger-anova-primary-1500x1125.jpg',
  //             [
  //               new Ingredient('Buns', 2),
  //               new Ingredient('Meat', 1)
  //             ])
  //   ];

  constructor(private slService: ShoppingListService) {

  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients : Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe)
  {
    this.recipes[index]=newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  deleteRecipe(index: number){
    this.recipes.splice(index,1);
    this.recipesChanged.next(this.recipes.slice());
  }

}
