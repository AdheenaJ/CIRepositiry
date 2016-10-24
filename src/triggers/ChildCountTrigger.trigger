trigger ChildCountTrigger on ParentObj__c (after update) {
    
List<ParentObj__c> ParentLst=Trigger.new;
List<ChildObj__c> ChildLst=[SELECT id FROM ChildObj__c where ParentObject__c in: ParentLst];
    system.debug('Count of child : '+ ChildLst.size());
}