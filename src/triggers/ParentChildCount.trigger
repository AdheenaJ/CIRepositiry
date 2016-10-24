trigger ParentChildCount on ParentObj__c (after insert,after update) {
    Integer childcount;
    List<ParentObj__c> parentLst=Trigger.new;
        List<ChildObj__c> childLst=new List<ChildObj__c>();
         //system.debug('WORK?');
        for(ParentObj__c p:parentLst) {
		    List<ParentObj__c> ids=[SELECT id from ParentObj__c where id =: p.id];      
            childcount=0;
            for(ChildObj__c c:childLst){                 
                childcount++;
            }
             system.debug('count :'+childcount);

          } 
   
}