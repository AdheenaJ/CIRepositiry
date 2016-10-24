trigger PerParentChildTrigger on ChildObj__c (after insert,after update) {
List<ParentObj__c> parentLst=new List<ParentObj__c>();
    for(ChildObj__c child:Trigger.new){
        List<AggregateResult> count=[SELECT count(id) from ChildObj__c where parentObject__c=: child.parentObject__c];
        ParentObj__c parent=new ParentObj__c();
        parent.id=child.ParentObject__c;
        parent.child_count__c= (integer)count[0].get('expr0');
        parentLst.add(parent);
            }
    update parentLst;
}