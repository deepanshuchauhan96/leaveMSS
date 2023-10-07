import { LightningElement, api } from 'lwc';
import LightningModal from 'lightning/modal';
import Id from '@salesforce/user/Id'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class AddLeave extends LightningModal {
    @api content;
    @api description;
    user = Id;


    handleSubmit(event){
   event.preventDefault();       // stop the form from submitting
   const fields = event.detail.fields;
   if(this.content == ''){
       console.log('fresh');
   fields.User__c = this.user;
   }
   console.log(fields);
   this.template.querySelector('lightning-record-edit-form').submit(fields);
}

handleClose(){
this.close('ok');
}

handleSave(){
this.template.querySelector('[data-id="Green_Button"]').click();
}
handleSuccess(){
   
 const event = new ShowToastEvent({
        title: 'Success',
        message: (this.content == ''? 'Leave Applied Successfully' : 'Leave Updated Successfully' ),
        variant: 'success',
      
    });
    this.dispatchEvent(event);
     
    this.close('closed');

   
}

handleError(event){
    
    console.log(event.detail);
    const events = new ShowToastEvent({
        title: 'Error',
        message: event.detail.detail,
        variant: 'Error',
      
    });
    this.dispatchEvent(events);
}

handleOnload(event){
    console.log(event.detail.records);
}


}