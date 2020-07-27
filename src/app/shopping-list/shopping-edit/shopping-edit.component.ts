import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  subscription :Subscription;
  editMode = false;
  editedItemIndex:number;
  editedItem: Ingredient;
  @ViewChild('f',{static:false}) slForm: NgForm;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.slService.startedEditing.subscribe((index: number)=>{
      this.editedItemIndex = index;
      this.editMode = true;
      this.editedItem = this.slService.getIngredient(this.editedItemIndex);
      this.slForm.setValue({
        name:this.editedItem.name,
        amount: this.editedItem.amount
       })
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  onClear(){
    this.editMode =false;
    this.slForm.reset();
  }

  onDelete(){
    this.slService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }

  onAddItem(form: NgForm){
    const value = form.value;
    // console.log(form);
    const newIngredient = new Ingredient(value.name,value.amount);
    if(this.editMode) {
      this.slService.updateIngredient(this.editedItemIndex,newIngredient);
      this.editMode = false;
    } else {
      this.slService.addIngredient(newIngredient);
    }
    this.slForm.reset();
  }
}
