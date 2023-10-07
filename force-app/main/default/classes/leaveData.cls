public class leaveData {
   @AuraEnabled(cacheable=true)
   public static list<Leave_Request__c> getLeaves(string uid){
       return [SELECT id, name, To_Date__c, From_Date__c, Number_of_Days_Leave__c, Reason__c, Leave_Type__c, Manager_Comment__c, Status__c from Leave_Request__c where User__c = : uid];

   }

      @AuraEnabled(cacheable=true)
   public static string getLeaveToApprove(string mid){
       list<Leave_Request__c> lr = [SELECT id, name, To_Date__c, From_Date__c, Number_of_Days_Leave__c, Reason__c, Leave_Type__c, Manager_Comment__c, Status__c from Leave_Request__c where Approver__c = :(mid).substring(0, 15)];
       if(lr.size()>0){
       return JSON.serialize(lr);
       }else{
           return ' No data';
       }

   }

    @AuraEnabled(cacheable=true)
   public static list<User_Leave__c> getLeaveChart(string cid){
       return [SELECT id , User__c,Total_Consumed__c,
                              Total_Allocated__c,Remaining_Leaves__c,
                              Leave_Type__c from User_leave__c where User__c = : cid];
   }

}