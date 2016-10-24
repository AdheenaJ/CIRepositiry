//Get field values to json format for every child object
//JsonAllChild json=new JsonAllChild();
//json.Serialize();

public class JsonAllChild 
{
    List<Json__c> jsonList = [select id,Name,Parent__c from Json__c];
    List<Json__c> newList= jsonList;
    Json__c elements=new Json__c();    
    JSONGenerator gen = JSON.createGenerator(false);
    
    public  void Serialize() 
    { 
        gen.writeStartArray();
        gen.writeStartObject();
        for(Json__c elements:jsonList)
        {
            if(elements.Parent__c==null)
            {
                gen.writeStringField(elements.Name,elements.Name);
            child(elements);
            }
        }
        gen.writeEndObject();
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