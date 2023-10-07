trigger LeaveRequest on Leave_Request__c (before insert, before update) {
    if (trigger.isInsert){
   map<id,Leave_Request__c> usmap = new map<id,Leave_Request__c >();
    for (Leave_Request__c lr : trigger.new){
        
        usmap.put(lr.User__c,lr);
        
    }
    if(usmap.size()>0){
    list<User_leave__c> ul = [select id , User__c,Total_Consumed__c,
                              Total_Allocated__c,Remaining_Leaves__c,
                              Leave_Type__c from User_leave__c where 
                              User__c in : usmap.keySet() ];
    
    list<User_leave__c> ulls = new list<User_leave__c>();
    for (User_leave__c ule : ul){
        if (usmap.get(ule.user__c).Leave_Type__c==ule.Leave_Type__c){
        
            ule.Total_Consumed__c = ule.Total_Consumed__c + (usmap.get(ule.user__c).Number_of_Days_Leave__c);
            if (usmap.get(ule.user__c).Number_of_Days_Leave__c > ule.Remaining_Leaves__c){
                usmap.get(ule.user__c).addError('You don not have sufficient leave');
            }else{
            ulls.add(ule);
            }
        }
    }
        if(ulls.size()>0){
    update ulls;
    }
    }
    }
    
    if(trigger.isUpdate){
        map<id,Leave_Request__c> olmap = trigger.oldmap;
        system.debug('ol=='+olmap);
         map<id,Leave_Request__c> usmap = new map<id,Leave_Request__c >();
        map<id,Leave_Request__c> rjmap = new map<id,Leave_Request__c >();
        
    for (Leave_Request__c lr : trigger.new){
        if (lr.Status__c == 'Pending' && (trigger.oldmap.get(lr.Id).From_Date__c != lr.From_Date__c  ||
                                          trigger.oldmap.get(lr.Id).To_Date__c != lr.To_Date__c)){
        usmap.put(lr.User__c,lr);
                                          }                                   
         if (lr.status__c =='Reject'){
             system.debug('rj');
             rjmap.put(lr.User__c,lr);
         }                                     
          
        
    }
    if(usmap.size()>0){
    list<User_leave__c> ul = [select id , User__c,Total_Consumed__c,
                              Total_Allocated__c,Remaining_Leaves__c,
                              Leave_Type__c from User_leave__c where 
                              User__c in : usmap.keySet() ];
    
    list<User_leave__c> ulls = new list<User_leave__c>();
    for (User_leave__c ule : ul){
        if (usmap.get(ule.user__c).Leave_Type__c==ule.Leave_Type__c){
            ule.Total_Consumed__c = ule.Total_Consumed__c + (usmap.get(ule.user__c).Number_of_Days_Leave__c-olmap.get(usmap.get(ule.user__c).Id).Number_of_Days_Leave__c);
            if (usmap.get(ule.user__c).Number_of_Days_Leave__c > ule.Remaining_Leaves__c){
                usmap.get(ule.user__c).addError('You don not have sufficient leave');
            }else{
            ulls.add(ule);
            }
        }
        
    }
    update ulls;
    }else if (rjmap.size()>0){
        system.debug('rjmap'+rjmap);
         list<User_leave__c> ul = [select id , User__c,Total_Consumed__c,
                              Total_Allocated__c,Remaining_Leaves__c,
                              Leave_Type__c from User_leave__c where 
                              User__c in : rjmap.keySet() ];
    
    list<User_leave__c> ulls = new list<User_leave__c>();
    for (User_leave__c ule : ul){
        if (rjmap.get(ule.user__c).Leave_Type__c==ule.Leave_Type__c){            
            ule.Total_Consumed__c = ule.Total_Consumed__c - rjmap.get(ule.user__c).Number_of_Days_Leave__c;
            ulls.add(ule);
        }
    }
    update ulls;
    }
    }
 
    
}