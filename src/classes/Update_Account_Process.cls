public class Update_Account_Process 
{
    
    @InvocableMethod
    public static void invocableMatchOppo(List<Opportunity> Oppo)
    {
        
        System.debug('working?');
List<id> ToUpdateAcc= new List<id>();
// List<Opportunity> requiredopp = [SELECT  AccountId FROM Opportunity where StageName = 'Closed Won'];
for(Opportunity op:oppo)
{
    if(op.StageName=='Closed Won')
    {
        
      ToUpdateAcc.add(op.AccountId);
    }
}
        List<Account> accountlist =[select id, Rating from Account where id in:  ToUpdateAcc ];
        List<Account> acclst=new List<Account>();
        
        for(Account acc: accountlist)
        {
         	acc.Rating = 'Cold';
            acclst.add(acc);
        }
      update acclst;

    }
}