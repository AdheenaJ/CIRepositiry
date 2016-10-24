public class MyController {
    public Resume__c Resume {get; set;}    
    public list<string> skills{get; set;}
     public list<string> ac{get; set;}
    public MyController() {
        Resume = [SELECT Id, Name__c,email__c, Last_Name__c,City__c,Career_Objective__c,Co_Curricular_activities__c,Declaration__c, 
                  District__c,Project_Def__c,House_Name__c,Pin__c, Project__c,Strengths__c,Technical_Skills__c ,
                  (Select Board_University__c,Level_of_Qualification__c,
                  Percentage__c,Year_of_Passing__c FROM Qualification__r)FROM Resume__c 
                       WHERE Id =:'a0F28000003TJ8H'];
    skills=Resume.Technical_Skills__c.split(';');      
            ac=Resume.Strengths__c.split(',');  
	}
}