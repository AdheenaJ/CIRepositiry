//Get field values to json format for array and list
//JsonArray json=new JsonArray();
//json.Serialize();

public class JsonArray 
{
    List<Json__c> jsonList = [select id,Name,Type__c,Parent__c from Json__c];
    List<Json__c> newList= jsonList;   
    JSONGenerator gen = JSON.createGenerator(true);
    
    
    public void getData()
    {        
        for(Json__c element:jsonList)
        {
            if(element.Type__c=='array')
                    array(element);
            else
               child(element); 
        }
     }
    
    
    
    public void array(Json__c element)
    {  
        //gen.writeFieldName(element.Name);
        gen.writeStartArray();
		gen.writeStringField(element.Name,element.Name);        
        child(element);        
        gen.writeEndArray();       
        String jStringg = gen.getAsString();        
        System.debug('list of json' + jStringg);
    }
    
    
    
    public  void child(Json__c elements)
    {
        integer i=0;
        for(Json__c compare:newList)
        {                       
            if(compare.Parent__c==elements.Id)
            {
                if(i==0)
                {
                    gen.writeFieldName(elements.Name);                                       
                    gen.writeStartObject();
                    i=i+1;
                }                
                gen.writeStringField(compare.Name,compare.Name);
                child(compare);
            }
        }
        if(i==1)
            gen.writeEndObject();
    }
}