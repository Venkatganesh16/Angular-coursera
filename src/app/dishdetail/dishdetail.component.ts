import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap, scan } from 'rxjs/operators';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Comment } from '../shared/comment';
import { visibility, flyInOut,  expand } from '../animations/app.animation';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      visibility(),
      expand()
    ]
})
export class DishdetailComponent implements OnInit {
  
  dish: Dish;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;

  @ViewChild('fform') commentsFormFormDirective;
 
  commentsForm: FormGroup;
  comments: Comment;
  dishcopy: Dish;
  visibility = 'shown';
 
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

      this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
        errmess => this.errMess = <any>errmess);
	
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
	  this.dishcopy.comments.push(this.comments);
    this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess;});
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
