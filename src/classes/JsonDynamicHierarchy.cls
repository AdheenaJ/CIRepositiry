//Json gets salesforce field data in heirarchy order
//JsonDynamicHierarchy jh=new JsonDynamicHierarchy();
//jh.Serialize();

public class JsonDynamicHierarchy 
{    
    public  void Serialize() 
    {   
        String jStringg;
        JSONGenerator gen = JSON.createGenerator(false);
        List<Json__c> jsonList = [select id,Name,Parent__c from Json__c];
        List<Json__c> newList= jsonList;
        Integer l=newList.size();
        gen.writeStartArray();
        gen.writeStartObject();   
        for(Json__c elements:jsonList)
        {
            if(elements.Parent__c==null)
            gen.writeStringField(elements.Name,elements.Name);
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
                    gen.writeIdField('Parent',compare.Parent__c);					
                } 
            }
            if(i==1)
            gen.writeEndObject();
        }
        gen.writeEndObject();
        gen.writeEndArray();
        jStringg = gen.getAsString();        
        System.debug('list of json' + jStringg);
    }
}