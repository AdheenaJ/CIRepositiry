trigger QueryOutsideLoopCount on ChildObj__c (after insert) {
//Integer childcount;
	List<ParentObj__c> parentLst=new List<ParentObj__c>();
	 List<AggregateResult> count=[SELECT count(id) from ChildObj__c where id IN:Trigger.newMap.keySet()];
    ParentObj__c pobject=new ParentObj__c();
    for(ChildObj__c c:Trigger.new){
         pobject.id=c.ParentObject__c;
        pobject.child_count__c= (integer)count[0].get('expr0');
        parentLst.add(pobject);
    }
        update parentLst;

}