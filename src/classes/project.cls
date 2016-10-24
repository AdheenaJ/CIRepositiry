public class project {
    @AuraEnabled
    public static list<Project__c> getDetails() {
        list<Project__c> lstproject =new list<Project__c>();
        
        lstproject= [Select id,Name,End_date__c,Start_date__c,Status__c,image__c from project__c ];
        //where End_date__c > TODAY
        System.debug('list:::' +lstproject);
        return lstproject;
    }

}