trigger ChangeStatus on TestTrigger__c (after insert,after update) 
{
      
        
  	 Integer i=0;
     TestTrigger__c tobj=new TestTrigger__c();
     List<TestTrigger__c> statusupdate=new List<TestTrigger__c>();
   //  List<TestTrigger__c> noway=new List<TestTrigger__c>();

   	 List<id>Testlist=new List<id>();
	 Map<Id, list<TestTrigger__c>> testmap = new Map<Id, list<TestTrigger__c>>();
      //List<TestTrigger__c> test=new List<TestTrigger__c>(); 
        //test.add();
       // if(test=='')
     for(TestTrigger__c updatedt:trigger.new)
     {if(updatedt.TestTriggerlook__c!=null)
        
         Testlist.add(updatedt.TestTriggerlook__c);
     } 
    for(TestTrigger__c tupdated: [Select id,Status__c,TestTriggerlook__c from TestTrigger__c where TestTriggerlook__c in : Testlist])
    {
        if(testmap.containsKey(tupdated.TestTriggerlook__c))
            {
                testmap.get(tupdated.TestTriggerlook__c).add(tupdated);
            }
            else
            {
                testmap.put(tupdated.TestTriggerlook__c, new List<TestTrigger__c> {tupdated});
            }  
    }
	System.debug(testmap);
     for(id parentId :  testmap.keySet())
     {
       	
        for(TestTrigger__c child: testmap.get(parentId))
        {
            if(child.status__c=='active')
            {
                i=1;
            }
            
        } 
        
         if(i==1)
            {
                tobj.Id=parentId;
                tobj.status__c='active';
            }
            else
            {
               tobj.Id=parentId;
               tobj.status__c='inactive'; 
            }
   statusupdate.add(tobj);      
}
        if(statusupdate.size()!=null)
   update statusupdate; 
        system.debug('status:'+statusupdate);
}