trigger ClosedOpportunityTrigger on Opportunity (after insert,after update) {
List<Task> taskList = new List<Task>();  

    Task t=new Task();
    for(Opportunity oppo :[SELECT Id, StageName FROM Opportunity WHERE StageName = 'Closed Won' AND Id IN :Trigger.new])
    {
       
        //t.Subject='Follow Up Test Task';
       // t.WhatId=oppo.id;
       // taskList.add(t);
       taskList.add(new Task(Subject = 'Follow Up Test Task',
                                  WhatId = oppo.Id));
       
    	
    }
    
    if(taskList.size()>0){
     insert taskList;     
    }
    
}