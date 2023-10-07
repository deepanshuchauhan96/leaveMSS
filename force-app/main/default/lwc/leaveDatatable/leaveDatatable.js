import { LightningElement, api, wire } from 'lwc';
const columns = [
    { label: 'Leave Id', fieldName: 'Name' },
    { label: 'From Date', fieldName: 'From_Date__c', type: 'date' },
    { label: 'To Date', fieldName: 'To_Date__c', type: 'date' },
    { label: 'Days', fieldName: 'Number_of_Days_Leave__c'},
    { label: 'Leave Type', fieldName: 'Leave_Type__c' },
    { label: 'Reason', fieldName: 'Reason__c' },
    { label: 'Status', fieldName: 'Status__c' },
    { label: 'Manager Comment', fieldName: 'Manager_Comment__c' },
    {
        type: "button", label: 'Edit', initialWidth: 100, typeAttributes: {
            label: 'Edit',
            name: 'Edit',
            title: 'Edit',
            disabled: { fieldName: 'isdisabled' },
            value: 'edit',
            iconPosition: 'left',
            iconName:'utility:edit',
            variant:'success',
            
        }
    }
    
];
export default class LeaveDatatable extends LightningElement {
    
columns = columns;
@api type;
@api ldata = [];
data = {
    id : '',
    type : '',
}
 callRowAction(event){
     console.log(event.detail);
     this.data.id = event.detail.row.Id;
     this.data.type = this.type;
     const cevent = new CustomEvent('updateleave',{
         detail : this.data,
     });
     this.dispatchEvent(cevent)
        
       
    }

     
}