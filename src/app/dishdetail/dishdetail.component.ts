import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
	
  @ViewChild('fform') commentsFormFormDirective;
 
  dish: Dish;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;
  commentsForm: FormGroup;
  comments: Comment;
 
  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':  'Author Name is required.',
      'minlength': 'Author Name must be at least 2 characters long.'
    },
  	'comment': {
	    'required':  'Comment is required.'
	  }
	};

  
  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location, 
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) { 

		  this.createForm();
	
	}

 
  ngOnInit() {
    this.dishservice.getDishIds()
      .subscribe(dishIds => this.dishIds = dishIds);

    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); },
        errmess => this.errMess = <any> errmess);
	
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createForm() {
     this.commentsForm = this.fb.group({
        author:  ['', [Validators.required, Validators.minLength(2)]],
        comment: ['', [Validators.required]],
	      rating: 5,
	      date: ''
      });

    this.commentsForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }
  
  onValueChanged(data?: any) {
    if (!this.commentsForm) { return; }
    const form = this.commentsForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.comments = this.commentsForm.value;
    console.log(this.comments);
    
    //Add to the comments list
	  this.comments.date = Date.now().toString();
	  this.dish.comments.push(this.comments);
	
    //Reset Form
    this.commentsFormFormDirective.resetForm();
	  this.commentsForm.reset({
	    author: '',
      comment: '',
	    rating: 5,
	    date: ''
    });
  }

}
