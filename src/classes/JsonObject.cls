public class JsonObject
{
    public  void SerializeRoundtrip() 
    {
        List<Json__c> jsonList = new List<Json__c>();
        jsonList=[select Name,parent__c from Json__c];
		system.debug('jsonList:::' + jsonList);
        String JSONString = JSON.serialize(jsonList);
        System.debug('Serialized list into JSON format: ' + JSONString);
    }
    
}