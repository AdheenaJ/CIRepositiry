//Get  data from salesforce object and field in random order
//JsonSerial js=new JsonSerial();
//js.Serialize();

public class JsonSerial
{   
    public  void Serialize() 
    {   
        String jStringg;
        JSONGenerator gen = JSON.createGenerator(true);
        List<Json__c> jsonList = [select Name,Parent__c from Json__c];        
        gen.writeStartArray();
        gen.writeStartObject();
        for(Json__c elements:jsonList)
        {

                   	 
         gen.writeStringField('Name',elements.Name); 
         if(elements.Parent__c!=null)
         	gen.writeIdField('Parent',elements.Parent__c);  	 
		 
        }
        gen.writeEndObject();
        gen.writeEndArray();
        jStringg = gen.getAsString();        
		System.debug('list of json' + jStringg);
  	}
    
}