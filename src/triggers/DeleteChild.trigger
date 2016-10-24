trigger DeleteChild on ParentObj__c ( after update) {
   // for( ParentObj__c a : Trigger.New) {
   List<ParentObj__c> p=Trigger.New;
   List<ChildObj__c> cList = [SELECT id FROM ChildObj__c WHERE ParentObject__c IN: p];
delete cList;
    
}