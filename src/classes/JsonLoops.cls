//Get field values to json format for every child object
//JsonLoops jl=new JsonLoops();
//jl.Serialize();

public class JsonLoops 
{
  List<Json__c> jsonList = [select id,Name,Parent__c from Json__c];
  List<Json__c> newList= jsonList;
  List<Json__c> passList=new List<Json__c>();
  Json__c elements=new Json__c();
  integer length=jsonList.size();
  integer i=0,x=0; 
  JSONGenerator gen = JSON.createGenerator(true); 
  
  String jStringg;

  public  void Serialize() 
  {
    gen.writeStartArray();
    gen.writeStartObject();       
    display(elements);
  }
    
  public Integer display(Json__c compared)
  {     
    for(Json__c elements:jsonList)
    {
      if(i==0)
      {
        compared=elements;        
      }
      if(compared.Parent__c==null)
      gen.writeStringField(compared.Name,compared.Name);          
      for(Json__c compare:newList)
        {
          if(compared.Id==compare.Parent__c)
          { 
            if(x==0)
                    {
                    gen.writeFieldName(compared.Name);                                       
                    gen.writeStartObject();
                    x=x+1;
                    }
            gen.writeStringField(compare.Name,compare.Name);
            gen.writeIdField('Parent',compare.Parent__c);
            i=1;
            display(compare);
            i=0;
          }           
        } 
        if(x==1)
        gen.writeEndObject();
        //break;
    } 
      
      gen.writeEndObject();
      gen.writeEndArray();
      jStringg = gen.getAsString();        
      System.debug('list of json' + jStringg);
      return(1);
  }    
}