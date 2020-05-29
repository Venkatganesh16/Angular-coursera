import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validator, Validators} from '@angular/forms';
import {Feedback, ContactType} from '../Shared/feedback';
import {expand, flyInOut, visibility} from '../animations/app.animation';
import {FeedbackService} from '../Services/feedback.service';
import set = Reflect.set;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [flyInOut(), visibility(),expand()]
})
export class ContactComponent implements OnInit {
feedbackForm: FormGroup;
feedback: Feedback;
feedbacks: Feedback[];
errmess: string;
ContactType = ContactType;
feedcopy: Feedback;
feedcopy1: Feedback;
@ViewChild('fform') feedbackFormDirective;
formErrors = {
  'firstname' : '',
  'lastname': '',
  'telnum': '',
  'email': ''
};
validationMessages = {
'firstname': {
  'required': 'First name required.',
  'minlength': 'at least 2 charachters.',
  'maxlength': 'max length 25.'
},
  'lastname': {
    'required': 'Last name required.',
    'minlength': 'at least 2 charachters.',
    'maxlength': 'max length 25.'
  },
  'telnum': {
  'required': 'Tel.number required.',
    'pattern': 'Tel.number must contain only numbers.'
  },
  'email': {
    'required': 'email required.',
    'email': 'email is not in valid format'
  },
};
  constructor(private fb: FormBuilder,
              private feedbackService: FeedbackService) {   this.createForm();
  }
  ngOnInit() {
  }
createForm() {
this.feedbackForm = this.fb.group({
  firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
  lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
  telnum: [0, [Validators.required, Validators.pattern]],
  email: ['', [Validators.required, Validators.email]],
  agree: false,
  contactType: 'None',
  message: ''

});
this.feedbackForm.valueChanges.subscribe(data => this.onValueChanged(data));
this.onValueChanged(); // (re)set form validations messages
}

  onValueChanged(data?: any) {
  if (!this.feedbackForm) {return;}
  const form = this.feedbackForm;
  for (const field in this.formErrors) {
    if (this.formErrors.hasOwnProperty(field)) {
      // clear previous error message
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors ) {
          if (control.errors.hasOwnProperty(key)) {
            this.formErrors[field] += messages[key] + ' ';
          }
        }
      }

    }
  }
  }


onSubmit() {
    this.feedback = this.feedbackForm.value;
    this.feedcopy = this.feedback;
    console.log(this.feedcopy);
  this.feedbackService.submitFeedback(this.feedcopy).subscribe(
    feedb => {this.feedback = feedb; this.feedcopy = feedb; this.feedcopy1= feedb; console.log(this.feedcopy);
      this.feedcopy = undefined;

      setTimeout(() => {
        this.feedcopy1 = undefined;
      }, 5000);

    },
    errmess => {this.errmess = <any>errmess; this.feedcopy = null; this.feedback = null; }
  );
  this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: 0,
      email: '',
      agree: false,
      contactType: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();

}


}
