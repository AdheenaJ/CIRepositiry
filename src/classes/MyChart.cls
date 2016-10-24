public class  MyChart {
     public List<Months__c> month{get;set;}
    //public list<Integer> j{get; set;}
    public MyChart(){
        month=[select id,jan__c,feb__c from Months__c ];
		system.debug('month.......'+month[0].jan__c);
        
    }

}