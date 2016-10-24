@istest
public class TestTrigger_StatusTest {
         
        
      public static testMethod void CheckActiveStatus() 
         {
           TestTrigger__c Parent=CreateParent();
           TestTrigger__c Child=CreateChild('Active',Parent.Id);
           List<TestTrigger__c> ParentList=[select id, status__c from TestTrigger__c where id=:Parent.Id];
           system.assertEquals('Active', ParentList[0].status__c);
           
         }
    
     public static testMethod void CheckInactiveStatus() 
         {
           TestTrigger__c Parent=CreateParent();
           TestTrigger__c Child=CreateChild('Inactive',Parent.Id);
           List<TestTrigger__c> ParentList=[select id, status__c from TestTrigger__c where id=:Parent.Id];
           system.assertEquals('Inactive', ParentList[0].status__c);
            
         }
    
     public static testMethod void CheckDiffrentStatus() 
         {
           TestTrigger__c Parent=CreateParent();
           TestTrigger__c Child1=CreateChild('Active',Parent.Id);
           TestTrigger__c Child2=CreateChild('Inactive',Parent.Id);
           List<TestTrigger__c> ParentList=[select id, status__c from TestTrigger__c where id=:Parent.Id];
           system.assertEquals('Active', ParentList[0].status__c);
            
         }
    
	   public static testMethod void CheckStatusBulk() 
         {
           
           TestTrigger__c Parent=CreateParent();
           list<TestTrigger__c> tstchild=new list<TestTrigger__c>();
             for(integer i=0;i<20;i++ )
             {
          TestTrigger__c tobj=new TestTrigger__c();
                 tobj.Name='child'+i;
                 tobj.status__c='Active';
                 tobj.TestTriggerlook__c=Parent.Id;
                 tstchild.add(tobj);
                 
             }
             Test.startTest();
             insert tstchild;
           List<TestTrigger__c> ParentList=[select id, status__c from TestTrigger__c where id=:Parent.Id];
          	system.assertEquals('Active', ParentList[0].status__c);
            system.debug('actvchild'+ tstchild);
             Test.stopTest();
             
         }
      public static TestTrigger__c CreateParent()
        {    
 			TestTrigger__c TestParent1 = new TestTrigger__c();
       	 	TestParent1.Name='Test123';
       		insert TestParent1;
        	return TestParent1;
        }  
        
        public static TestTrigger__c CreateChild(string status, id parentid)
        {
        	TestTrigger__c TestObjChild1 = new TestTrigger__c();
     	   	TestObjChild1.Name='child1';
     	   	TestObjChild1.TestTriggerlook__c=parentid;
      	  	TestObjChild1.status__c=status;      
        	insert TestObjChild1;
            return TestObjChild1;
        }
     }