//JSon get salesforce field data in heirarchy by Hardcoding
//JsonHierarchy jh=new JsonHierarchy();
//jh.Serialize();
public class JsonHierarchy {
public  void Serialize() 
    {   
        String jStringg;
        JSONGenerator gen = JSON.createGenerator(true);
        List<Json__c> jsonList = [select id,Name,Parent__c from Json__c];
		List<Json__c> newList= jsonList;
       	gen.writeStartArray();
        gen.writeStartObject();   
        for(Json__c elements:jsonList)
        {

         if(elements.Parent__c==null)
         {
                     
         	gen.writeStringField('Name',elements.Name);
             if(elements.Name=='doctor_name')
                {
                	gen.writeFieldName('Doctor');
                    gen.writeStartObject();
                    for(Json__c compare:newList)
                    {
                        if(compare.Parent__c==elements.Id)
                        {
                           gen.writeStringField('Name',compare.Name);
                           gen.writeIdField('Parent',compare.Parent__c); 
                        } 
                    }
                    gen.writeEndObject();
             	} 
         }                 
		 
        }
        gen.writeEndObject();
        gen.writeEndArray();
        jStringg = gen.getAsString();        
		System.debug('lissttttt' + jStringg);
  	}
    
}