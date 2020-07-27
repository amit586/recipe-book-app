import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  id: number;
  editMode =false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute,
          private recipeService: RecipeService,
          private router: Router) {
            // this.initForm();
           }

  ngOnInit() {
    this.route.params.subscribe(
      (params :Params) => {
        //console.log(params);
        this.id =+params['id'];
        this.editMode = params['id']!=null;
        //console.log(this.id);
        this.initForm();
      }
    )
  }

  onSubmit(){
    const newRecipe = new Recipe(
      this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imagePath'],
      this.recipeForm.value['ingredients'],
      this.recipeForm.value['directions']

       )
    if(this.editMode)
    {
      this.recipeService.updateRecipe(this.id,this.recipeForm.value);
    }
    else{
      this.recipeService.addRecipe(this.recipeForm.value);
    }

    this.router.navigate(['../'],{ relativeTo:this.route});
  }

  private initForm(){
    let recipeName  = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);
    let recipeDirections = '';

    if(this.editMode){
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription  = recipe.description;
      recipeDirections = recipe.directions;
      if(recipe['ingredients']){
        for(let ingredient of recipe.ingredients)
        {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name,Validators.required),
              'amount': new FormControl(ingredient.amount,[
                Validators.required,
                // Validators.pattern(/^[1-9]+[0-9]*$/)
                ])
            })
          );
        }
      }
    }
    //console.log(recipeIngredients);

    this.recipeForm = new FormGroup({
      'name':new FormControl(recipeName, Validators.required),
      'imagePath':new FormControl(recipeImagePath,Validators.required),
      'description' :new FormControl(recipeDescription,Validators.required),
      'ingredients' : recipeIngredients,
      'directions':new FormControl(recipeDirections,Validators.required)
    });
  }

  get controls() {
    //console.log((<FormArray>this.recipeForm.get('ingredients')).controls);
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(name,Validators.required),
        'amount': new FormControl(null,[
          Validators.required,
        ])
      })
    )

  }

  onDeleteIngredient(index: number){
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

}
