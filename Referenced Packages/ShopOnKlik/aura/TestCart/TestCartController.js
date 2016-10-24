({
    itemList : function(component, event, helper) {       
        var usertypeAction=component.get("c.getuserType");
        usertypeAction.setCallback(this,function(response){
            var usertype=response.getReturnValue();
            component.set("v.GUEST",usertype);
            if(usertype=='GuestLogin'){
                component.set("v.UserFlag",true);
            }                                             
            var object_name='User';
            var field_name='EmailEncodingKey';
            var currentdate = new Date();
            var initsearchKey="";
            var tempItems;
            
            component.set("v.searchKey",initsearchKey);
            //To get the picklist values of the field Category__c 
            var cats=[];
            var getCategoriesAction=component.get("c.getCategories");            
            getCategoriesAction.setCallback(this, function(response){             
                if(response.getState()=="SUCCESS"){                       
                    cats=response.getReturnValue();          
                    component.set("v.categories",cats);}
            }); 
            $A.enqueueAction(getCategoriesAction);
            var proPic=component.get("c.GetProPic");
            proPic.setCallback(this,function(response){
                var proPic=response.getReturnValue();
                
                for(var p=0;p<response.getReturnValue().length;p++)
                {
                    component.set("v.ProPicStr",response.getReturnValue()[p].FullPhotoUrl);
                    component.set("v.CustomerNameStr",response.getReturnValue()[p].Name);
                }
                
                
                
            });
            $A.enqueueAction(proPic);       
            // CREATE OPPORTUNITY FOR NEW USER
            var CreateOppAction=component.get("c.CreateOpp");
            
            
            
            CreateOppAction.setCallback(this,function(response){
                
            });
            $A.enqueueAction(CreateOppAction);  
            
            //to get user contact id
            var getUserContactAction=component.get("c.getUserContact");
            
            getUserContactAction.setCallback(this, function(response){
                var usercartlist;
                
                if(response.getState()=="SUCCESS"){
                    
                    
                    var userContactId=response.getReturnValue();
                    
                    {
                        
                    }
                    
                }});
            
            
            if(usertype!='GuestLogin'){
                // get old wish list
                var getOldWishAction=component.get(" c.getOldWish");
                getOldWishAction.setCallback(this, function(response){
                    
                    if(response.getState()=="SUCCESS"){
                        var userOldWish=response.getReturnValue();
                        var itemlst=component.get("v.Items");
                        for(var q=0;q<userOldWish.length;q++)
                        {
                            userOldWish[q].wish=true;
                            for(var r=0;r<itemlst.length;r++){
                                if(userOldWish[q].item.Product2.Name==itemlst[r].item.Product2.Name)
                                {
                                    itemlst[r].wish=true;
                                }
                            }
                        }
                        
                        component.set("v.wish",userOldWish);
                        component.set("v.Items",itemlst);
                        
                    }
                    
                    var wishCnt=document.getElementById("wishlistItemCount");
                    wishCnt.style.display="inline-block";
                    var wishCntMob=document.getElementById("wishlistItemCountMob");
                    wishCntMob.style.display="inline-block";
                    wishCnt.innerHTML=userOldWish.length;
                    wishCntMob.innerHTML=userOldWish.length;
                    if(userOldWish.length==0)
                    {
                        wishCnt.style.display="none";
                        wishCntMob.style.display="none";   
                    }
                });
                $A.enqueueAction(getOldWishAction);
                //Get old cart
                var getOldCartAction=component.get("c.getOldCart");
                
                getOldCartAction.setCallback(this, function(response){
                    if(response.getState()=="SUCCESS"){
                        var userOldCart=response.getReturnValue();
                        component.set("v.cart",userOldCart);
                    }
                    var total=0;
                    for(var i=0;i<userOldCart.length;i++){
                        
                        total=total+userOldCart[i].itemprice;
                        
                    }
                    
                    component.set("v.total",total);
                    var cartCount=document.getElementById("cartItemCount");
                    cartCount.style.display="inline-block";
                    var cartCountMob=document.getElementById("cartItemCountMob");
                    cartCountMob.style.display="inline-block";
                    cartCount.innerHTML=userOldCart.length;
                    cartCountMob.innerHTML=userOldCart.length;
                    document.getElementById("cartPageData").style.display="block";
                    if(userOldCart.length==0){
                        document.getElementById("cartPageData").style.display="none";
                        cartCount.style.display="none";
                        cartCountMob.style.display="none";
                    }
                });
                $A.enqueueAction(getOldCartAction);                
                $A.enqueueAction(getUserContactAction);
            }
        });
        
        $A.enqueueAction(usertypeAction);
    },  
    updateUsercart : function(component, event, helper){
        
        var usertype=component.get("v.GUEST");
        if(usertype!='GuestLogin'){
            var currentCart=component.get("v.cart");
            var userContactId=component.get("v.userContactId");
            var oldcart;
            var updatedcart=[];
            
            var action3=component.get("c.getOldcart");
            var newItemName=[];
            var newItemQuantity=[];
            var newItemPrice=[];
            var flag='false';
            
            action3.setCallback(this, function(response){
                oldcart=response.getReturnValue();
                var k=0;
                for(var i=0;i<currentCart.length;i++){
                    flag='false';
                    for(var j=0;j<oldcart.length;j++){
                        if(currentCart[i].item.Name==oldcart[j].ItemName__c && userContactId==oldcart[j].Contact__c){
                            oldcart[j].Quantity__c=currentCart[i].item.Quantity__c;
                            oldcart[j].Price__c=currentCart[i].itemprice;
                            flag='true';
                            
                        }
                        
                    }
                    if (flag!='true'){
                        
                        newItemName[k]=currentCart[i].item.Name;
                        newItemQuantity[k]=currentCart[i].item.Quantity__c;
                        newItemPrice[k]=currentCart[i].item.Price__c;
                        k++;
                    }
                }
                
                var action=component.get("c.updateusercart");
                action.setParams({ "oldcartApex" : oldcart,"newitemquantity":newItemQuantity,"newitemname":newItemName,"IPrice" :newItemPrice});
                
                $A.enqueueAction(action);
            });
            
            $A.enqueueAction(action3);
        }
        else{
            //alert('11');
            document.getElementById("id03").style.display="block";
        }
    },    
    CheckOutJS:function(component,event){
        var usertype=component.get("v.GUEST");
        if(usertype!='GuestLogin'){
            document.getElementById("id02").style.display="none";
            
            var CheckOutaction=component.get("c.CheckOut");
            CheckOutaction.setCallback(this,function(response){
                
            });
            
            $A.enqueueAction(CheckOutaction);
            var tot=component.get("v.total");
            tot=0;
            component.set("v.total",tot);
            
            var myCartItems=component.get("v.cart");
            for(var i=0;i<myCartItems.length;i++){
                myCartItems.splice(i,1);
            }
            component.set("v.cart",myCartItems);
            var cartCount=document.getElementById("cartItemCount");
            cartCount.style.display="none";
            var cartCountMob=document.getElementById("cartItemCountMob");
            cartCountMob.style.display="none";
            document.getElementById("cartPageData").style.display="none";
            document.getElementById("productPage").style.display="block";
            document.getElementById("cartPage").style.display="none";
            document.getElementById("sliderDiv").style.display="block";
        }
        else{
            //alert('111');
        }
    },
    
    performInit : function(component, event, helper) {
        var x = document.getElementById("navDemo");
        if (x.className.indexOf("w3-show") == -1) {
            x.className += " w3-show";
        } else {
            x.className = x.className.replace(" w3-show", "");
        }
    },
    addToCart:function(component,event){
        var usertype=component.get("v.GUEST");
        if(usertype!='GuestLogin'){
            var modal = document.getElementById("ticketModal");
            modal.style.display = "block";
            var cartCount=document.getElementById("cartItemCount");
            cartCount.style.display="inline-block";
            var cartCountMob=document.getElementById("cartItemCountMob");
            cartCountMob.style.display="inline-block";
            document.getElementById("cartPageData").style.display="block";    
            var currentItem = event.target.id; 
            var myCartItems = component.get("v.cart");
            var allItem = component.get("v.Items"); 
            var newTotal = component.get("v.total");
            var itemTotal=component.get("v.itemTotal");
            var flag = false; 
            var  s;
            var userContactId=component.get("v.userContactId");
            var CartOrWish='Cart';
            
            for(var i=0;i<allItem.length;i++){
                
                if(allItem[i].item.Product2.Name == currentItem ){
                    
                    if(myCartItems.length >0){
                        for(var j=0;j<myCartItems.length;j++){
                            if(myCartItems[j].item.Product2.Name == currentItem){
                                myCartItems[j].Quantity++;
                                
                                var discount=allItem[i].item.shoponklik__Discount__c;
                                
                                if(discount==null){
                                    newTotal = parseInt(newTotal) + parseInt(allItem[i].item.UnitPrice);
                                    flag = true;
                                    myCartItems[j].itemprice=parseInt(myCartItems[j].itemprice)+parseInt(allItem[i].item.UnitPrice);
                                    s=myCartItems[j];
                                    {
                                        var UpdateOppProductAction=component.get("c.UpdateOppProduct");// Updtae OPPORTUNITY product FOR NEW USER
                                        UpdateOppProductAction.setParams({"userID":userContactId,"ProductName":currentItem,"Quant":myCartItems[j].Quantity,"CartOrWish":CartOrWish});
                                        
                                        $A.enqueueAction(UpdateOppProductAction);
                                    }
                                }
                                else{
                                    
                                    for(var q=0;q<myCartItems.length;q++){
                                        if(myCartItems[q].item.Product2.Name==currentItem)
                                        {
                                            myCartItems[q].itemprice=parseInt(myCartItems[q].itemprice)+parseInt(discountRs);
                                            myCartItems[q].itemtotalMRP=parseInt(myCartItems[q].itemtotalMRP)+parseInt(allItem[i].item.UnitPrice); 
                                        }
                                    }
                                    newTotal = parseInt(newTotal) + parseInt(discountRs);
                                    flag=true;
                                    s=myCartItems[j];
                                }
                                
                                break;
                            }                       
                        }
                        var suggItems=[];
                        var curItemPrice=allItem[i].item.UnitPrice;
                        var curItemCat=allItem[i].item.shoponklik__Category__c;
                        for(var k=0;k<allItem.length;k++)
                        {
                            if(allItem[k].item.shoponklik__Category__c==curItemCat && allItem[k].item.UnitPrice>=(parseInt(curItemPrice)-20) && allItem[k].item.UnitPrice<=(parseInt(curItemPrice)+20)) 
                            {
                                suggItems.push(allItem[k]);
                            }
                            
                        }
                    }  
                    if( !flag ){
                        var curItemPrice=allItem[i].item.UnitPrice;
                        var curItemCat=allItem[i].item.shoponklik__Category__c;
                        var suggItems=[];
                        var discount;
                        
                        for(var k=0;k<allItem.length;k++)
                        {
                            if(allItem[k].item.shoponklik__Category__c==curItemCat && allItem[k].item.UnitPrice>=(parseInt(curItemPrice)-20) && allItem[k].item.UnitPrice<=(parseInt(curItemPrice)+20)) 
                            {
                                suggItems.push(allItem[k]);
                            }
                            
                        }
                        
                        allItem[i].Quantity = 1;
                        myCartItems.push(allItem[i]);  
                        
                        //   if(discount==null){
                        
                        var UpdateOppProductAction=component.get("c.UpdateOppProduct");// Updtae OPPORTUNITY product FOR NEW USER
                        UpdateOppProductAction.setParams({"userID":userContactId,"ProductName":currentItem,"Quant":allItem[i].Quantity,"CartOrWish":CartOrWish});
                        
                        $A.enqueueAction(UpdateOppProductAction);
                        
                        newTotal = parseInt(newTotal) + parseInt(allItem[i].item.UnitPrice);
                        
                        
                        s=allItem[i];      
                    }
                    
                }
            }
            cartCount.innerHTML=myCartItems.length;
            cartCountMob.innerHTML=myCartItems.length;
            component.set("v.suggList",suggItems);
            component.set("v.SelectedItem",s);
            component.set("v.total",newTotal);
            component.set("v.cart",myCartItems);
            
        }
        else
        {
            
            document.getElementById("id03").style.display="block";
        }
    },   
    addToWish:function(component,event){
        var currentItemHeart = event.target.id; 
        var wishCnt=document.getElementById("wishlistItemCount");
        wishCnt.style.display="inline-block";
        var wishCntMob=document.getElementById("wishlistItemCountMob");
        wishCntMob.style.display="inline-block";
        
        var d=document.getElementById(currentItemHeart);
        var currentItem=currentItemHeart.substring(5,currentItemHeart.length);
        var myWishItems = component.get("v.wish");
        var allItem = component.get("v.Items"); 
        var flag = false; 
        var CartOrWish='Wish';
        
        for(var i=0;i<allItem.length;i++){
            
            if(allItem[i].item.Product2.Name == currentItem){
                
                if(myWishItems.length >0){
                    for(var j=0;j<myWishItems.length;j++){
                        if(myWishItems[j].item.Product2.Name == currentItem){
                            if(myWishItems[j].wish){
                                var userContactId=component.get("v.userContactId");
                                {
                                    var UpdateOppProductAction=component.get("c.UpdateOppProduct");// Updtae OPPORTUNITY product FOR NEW USER
                                    UpdateOppProductAction.setParams({"ProductName":currentItem,"Quantity":1,"CartOrWish":CartOrWish});
                                    
                                    $A.enqueueAction(UpdateOppProductAction);  
                                }
                                
                                allItem[i].wish='false';
                                myWishItems.splice(j,1);
                                flag = true;  
                                break;
                            }
                            
                        }                       
                    }
                    
                }                        
                if( !flag ){
                    var userContactId=component.get("v.userContactId");
                    
                    {
                        var UpdateOppProductAction=component.get("c.UpdateOppProduct");// Updtae OPPORTUNITY product FOR NEW USER
                        UpdateOppProductAction.setParams({"userID":userContactId,"ProductName":currentItem,"Quantity":1,"CartOrWish":CartOrWish});
                        
                        $A.enqueueAction(UpdateOppProductAction);                               
                    }
                    var newItemName;
                    
                    newItemName=currentItem;
                    
                    allItem[i].wish='True';
                    
                    myWishItems.push(allItem[i]);  
                    
                }
            }  
        }
        component.set("v.wish",myWishItems);
        component.set("v.Items",allItem);
        wishCnt.innerHTML=myWishItems.length;
        wishCntMob.innerHTML=myWishItems.length;
        if(myWishItems.length==0){
            var wishCnt=document.getElementById("wishlistItemCount");
            wishCnt.style.display="none";
            var wishCntMob=document.getElementById("wishlistItemCountMob");
            wishCntMob.style.display="none";
        }
    },   
    displayWish:function(component,event){
        document.getElementById("OrdersPage").style.display="none";
        document.getElementById("OrderDetails").style.display="none";
        document.getElementById("cartPage").style.display="none";
        document.getElementById("productPage").style.display="none";
        document.getElementById("sliderDiv").style.display="none";
        document.getElementById("wishlistPage").style.display="block";
        document.getElementById("profilePage").style.display="none";
        document.getElementById("profilePageEdit").style.display="none";
    },
    displayHome:function(component,event){
        document.getElementById("OrdersPage").style.display="none";
        document.getElementById("OrderDetails").style.display="none";
        document.getElementById("profilePageEdit").style.display="none";
        document.getElementById("profilePage").style.display="none";
        document.getElementById("id01").style.display="none";
        document.getElementById("id02").style.display="none";
        document.getElementById("cartPage").style.display="none";
        document.getElementById("productPage").style.display="block";
        document.getElementById("wishlistPage").style.display="none";
        document.getElementById("sliderDiv").style.display="block";
        var action=component.get("c.getItemList");
        component.set("v.cat",'home');
        var d=component.get("v.cat");        
        var wishItems=component.get("v.wish");        
        
        action.setCallback(this, function(response)
                           {            
                               var tempItems=response.getReturnValue();
                               var state= response.getState();
                               if (state == "SUCCESS")
                               {
                                   var f = [];
                                   
                               }
                               var t=[];
                               for(var i = 0; i<tempItems.length;i++)
                               { 
                                   
                                   if(response.getReturnValue()[i].item.shoponklik__Discount__c==null){
                                       tempItems[i].disc='false';
                                   }
                                   else
                                   {
                                       tempItems[i].disc='true';
                                   }
                                   
                                   for(var j=0;j<wishItems.length;j++){
                                       
                                       if(tempItems[i].item.Product2.Name==wishItems[j].item.Product2.Name){
                                           
                                           tempItems[i].wish='True';
                                       }
                                   }
                                   t.push(response.getReturnValue()[i].item.shoponklik__Weight__c);
                               }
                               component.set("v.Items",tempItems);
                               component.set("v.temp",t);
                           });
        
        $A.enqueueAction(action);
    },    
    displayCategory:function(component,event){
        document.getElementById("OrdersPage").style.display="none";
        document.getElementById("OrderDetails").style.display="none";
        document.getElementById("profilePageEdit").style.display="none";
        document.getElementById("cartPage").style.display="none";
        document.getElementById("productPage").style.display="block";
        document.getElementById("wishlistPage").style.display="none";
        document.getElementById("profilePage").style.display="none";
        var categoryJS=event.target.id;
        document.getElementById("search_text").value= "";
        var action=component.get("c.getItemList");        
        component.set("v.cat",categoryJS);
        var d=component.get("v.cat");
        var wishItems=component.get("v.wish");
        action.setCallback(this, function(response){
            var state= response.getState();
            if (state == "SUCCESS"){
                var f = [];
                var tempItems=response.getReturnValue();
                for(var i=0;i<response.getReturnValue().length;i++)
                {
                    
                    if(response.getReturnValue()[i].item.shoponklik__Discount__c==null){
                        tempItems[i].disc='false';
                    }
                    else
                    {
                        tempItems[i].disc='true';
                    }
                    
                    
                    
                    if(response.getReturnValue()[i].item.Product2.Family==categoryJS &&response.getReturnValue()[i].item.Pricebook2.Name=='ShopOnKlikPB'){ 
                        for(var j=0;j<wishItems.length;j++){  
                            
                            if(tempItems[i].item.Product2.Name==wishItems[j].item.Product2.Name)
                            {
                                
                                
                                tempItems[i].wish='True';
                                
                            }
                        }
                        f.push(tempItems[i]);
                    }
                }
                
                component.set("v.Items",f);
                
                var t = [];
                for(var i = 0; i<response.getReturnValue().length;i++)
                {
                    if(response.getReturnValue()[i].item.Family==categoryJS)
                    {
                        
                    }
                }
                
                component.set("v.temp",t);  
                
            }});
        $A.enqueueAction(action);     
        
    },   
    search : function(component,event){
        
        var elemVal = document.getElementById('search_text').value;
        
        var currentItem = component.get("v.Items");
        
        component.set("v.searchKey",elemVal);
        var myEvent = $A.get("e.shoponklik:SearchKeyChange");
        myEvent.setParams({"searchKey": elemVal });
        myEvent.fire();
    },
    searchMob : function(component,event){
        
        var elemVal = document.getElementById('search_textMob').value;
        
        var currentItem = component.get("v.Items");
        
        component.set("v.searchKey",elemVal);
        var myEvent = $A.get("e.shoponklik:SearchKeyChange");
        myEvent.setParams({"searchKey": elemVal });
        myEvent.fire();
    },
    openModal:function(component, event, helper) {
        document.getElementById('ticketModal').style.display='block';
    },
    closeModal:function(component, event, helper) {
        document.getElementById('ticketModal').style.display='none';
    },  
    
    
    callSlider:function(component, event, helper) {
        
        var $slider = $("#slider");
        
        var maxProdVal=0;
        var stepsize=0;
        var action=component.get("c.getItemList"); 
        action.setCallback(this, function(response){
            var state= response.getState();            
            var tempItems;
            if (state == "SUCCESS"){
                tempItems=response.getReturnValue();
                for(var i = 0; i<tempItems.length;i++){
                    
                    if(response.getReturnValue()[i].item.UnitPrice>maxProdVal)
                    {
                        maxProdVal=response.getReturnValue()[i].item.UnitPrice;
                       
                        if(maxProdVal>=50000){
                            stepsize=1000;
                            
                        }
                        else if(maxProdVal>=10000 && maxProdVal<50000){
                            stepsize=500;
                            
                        }
                            else if(maxProdVal>=2000 && maxProdVal<10000){
                                stepsize=250;
                            }
                                else if(maxProdVal<2000 && maxProdVal>=1000){
                                    stepsize=100;
                                }
                                    else{
                                        stepsize=50;
                                    } 
                    }
                    /*checking discount*/
                      if(response.getReturnValue()[i].item.shoponklik__Discount__c==null){
                        tempItems[i].disc='false';
                    }
                    else
                    {
                        tempItems[i].disc='true';
                    }
                    
                    
                }
                
                
                component.set("v.Items",tempItems);           
                
                
                
                $slider.noUiSlider({
                    
                    
                    start: [0, maxProdVal],
                    connect: true,
                    step: stepsize,
                    range: {
                        'min': 0,
                        'max': maxProdVal
                    }
                });
                $slider.Link('lower').to('-inline-<div class="tooltip"></div>', function ( value ) {
                    
                    $(this).html(
                        '<span>' + '₹ '+(value / 1) + '</span>'
                    );
                });
                $slider.Link('upper').to('-inline-<div class="tooltip"></div>', function ( value ) {
                    $(this).html(
                        '<span>' + '₹ '+(value / 1) + '</span>'
                    );
                });
                $slider.on({
                    change: function(event){
                        var minMax =  $slider.val();
                        
                        component.set("v.minprice",minMax[0]);
                        component.set("v.maxprice",minMax[1]);
                        var myEvent = $A.get("e.shoponklik:PriceSelectionChange");
                        myEvent.fire();
                        
                    }
                });
            }});
        
        $A.enqueueAction(action);
        
    },   
    filter:function(component,event){
        
        var elemVal= component.get("v.searchKey");
        var minprice=component.get("v.minprice");
        var maxprice=component.get("v.maxprice");
         var wishItems=component.get("v.wish");
        var action = component.get("c.searchAndFilter");
        var baseWeights=[];
        var catjs=component.get("v.cat");
        var wishItems=component.get("v.wish");
        var f=[];
        
        action.setParams({ "low" : minprice , "high":maxprice, "searchKey" : elemVal ,"c":catjs});
        action.setCallback(this, function(response){
            
            
            var state= response.getState();
            if (state == "SUCCESS"){
                var tempSearch=response.getReturnValue();
                for(var i=0;i<tempSearch.length;i++)
                { 
                    for(var j=0;j<wishItems.length;j++){  
                            
                            if(tempSearch[i].item.Product2.Name==wishItems[j].item.Product2.Name)
                            {
                                
                                tempSearch[i].wish='True';
                                
                            }
                        }
                    f.push(tempSearch[i]);
                }
                component.set("v.Items",f);
                
            }});
        $A.enqueueAction(action);
        
    },
    displayCart:function(component,event){
        document.getElementById("OrdersPage").style.display="none";
        document.getElementById("OrderDetails").style.display="none";
        document.getElementById("cartPage").style.display="block";
        document.getElementById("productPage").style.display="none";
        document.getElementById("wishlistPage").style.display="none";
        document.getElementById("sliderDiv").style.display="none";
        document.getElementById("profilePage").style.display="none";
        document.getElementById("profilePageEdit").style.display="none";
    },     
    removeItem: function(component,event){
        var cartCount=document.getElementById("cartItemCount");
        var cartCountMob=document.getElementById("cartItemCountMob");
        var myCartItems = component.get("v.cart");
        
        var removedElem =event.target.id;
        var newWeight;
        var s;
        var CartOrWish='Cart';
        for(var i=0;i<myCartItems.length;i++)
        {
            if(myCartItems[i].item.Product2.Name==removedElem)
            {
                var newTotal = component.get("v.total");
                if(myCartItems[i].Quantity>1)
                {
                    //if(discount==null)
                    {
                        s=myCartItems[i];
                        newTotal=newTotal-parseInt(myCartItems[i].item.UnitPrice);
                        myCartItems[i].Quantity--;
                        
                        myCartItems[i].itemprice=parseInt(myCartItems[i].itemprice)-parseInt(myCartItems[i].item.UnitPrice);
                        
                        var UpdateOppProductAction=component.get("c.UpdateOppProduct");// Updtae OPPORTUNITY product FOR NEW USER
                        
                        UpdateOppProductAction.setParams({"ProductName":removedElem,"Quant":myCartItems[i].Quantity,"CartOrWish":CartOrWish});
                        $A.enqueueAction(UpdateOppProductAction);
                    }
                    
                }
                
                else if(myCartItems[i].Quantity==1)
                {
                    //if(discount==null)
                    {
                        
                        newTotal=parseInt(newTotal)-parseInt(myCartItems[i].item.UnitPrice);
                        
                        var DeleteOppProductAction=component.get("c.DeleteOppProduct");// Updtae OPPORTUNITY product FOR NEW USER
                        
                        DeleteOppProductAction.setParams({"ProductName":removedElem,"CartOrWish":CartOrWish});
                        $A.enqueueAction(DeleteOppProductAction); 
                        myCartItems.splice(i,1);
                        cartCount.innerHTML=myCartItems.length;
                        cartCountMob.innerHTML=myCartItems.length;
                        
                    }
                    
                }
                
            }
        }
        component.set("v.cart",myCartItems);
        component.set("v.total",newTotal);
        component.set("v.SelectedItem",s);
        
        if(myCartItems.length==0)
        {
            cartCount.style.display="none";
            cartCountMob.style.display="none";
            document.getElementById("cartPageData").style.display="none";
            document.getElementById("ticketModal").style.display="none";
            
        }
        
    },   
    deleteCartItemFull:function(component,event){
        var myCartItems = component.get("v.cart");
        var cartCount=document.getElementById("cartItemCount");
        var cartCountMob=document.getElementById("cartItemCountMob");
        var removedElem =event.target.id;
        var CartOrWish='Cart';
        
        var action=component.get("c.deleteCartOrWishRecord");
        action.setParams({"ProductName":removedElem,"CartOrWish":CartOrWish});
        
        for(var i=0;i<myCartItems.length;i++)
        {
            var newTotal = component.get("v.total");
            if(myCartItems[i].item.Product2.Name==removedElem)
            {
                
                var temp=parseInt(myCartItems[i].itemprice);
                newTotal=parseInt(newTotal)-parseInt(myCartItems[i].itemprice);
                console.log('newTotal:::' + newTotal);
                myCartItems.splice(i,1);
                
                component.set("v.total",newTotal);
            }
        }
        cartCount.innerHTML=myCartItems.length;
        cartCountMob.innerHTML=myCartItems.length;
        if(myCartItems.length==0)
        {
            cartCount.style.display="none";
            cartCountMob.style.display="none";
            document.getElementById("cartPageData").style.display="none";
            document.getElementById("ticketModal").style.display="none";
        }
        $A.enqueueAction(action);
        
        component.set("v.cart",myCartItems);
        
        
    },
    deleteWishItemFull:function(component,event){
        var wishCnt=document.getElementById("wishlistItemCount");
        var wishCntMob=document.getElementById("wishlistItemCount");
        var wishItemName=event.target.id;
        var CartOrWish='Wish';
        var myWishItems = component.get("v.wish");
        for(var i=0;i<myWishItems.length;i++)
        {
            if(wishItemName==myWishItems[i].item.Product2.Name)
            {
                var action=component.get("c.deleteCartOrWishRecord");
                action.setParams({"ProductName":wishItemName,"CartOrWish":CartOrWish});
                myWishItems.splice(i,1);
            }
            if(myWishItems.length==0)
            {
                
                document.getElementById("wishlistItemCount").style.display="none";
                document.getElementById("wishlistItemCountMob").style.display="none";
            }
        }
        component.set("v.wish",myWishItems);
        wishCnt.innerHTML=myWishItems.length;
        wishCntMob.innerHTML=myWishItems.length;
        $A.enqueueAction(action);
    },
    userLogout:function(component,event){
        window.location.replace("./secur/logout.jsp");
    },
    couponModalOpen:function(component,event){
        var couponCode="DISC100";
        var status="False";
        var tAmount=component.get("v.total");
        var coupChance=component.get("v.cChance");
        var getCouponCode=document.getElementById("couponTxt1").value;
        if(getCouponCode==null)
        {
            getCouponCode=document.getElementById("couponTxt12").value;
        }
        
        if(getCouponCode==couponCode)
        {
            
            if(coupChance==0){
                tAmount=parseInt(tAmount)-100;
                component.set("v.total",tAmount);
                coupChance=1;
                component.set("v.cChance",coupChance);
                status="true";
                
                component.set("v.couponStatus",status);
            }
            else
            {
                status="false";
                
                component.set("v.couponStatus",status);
            }
        }
        else
        {
            status="false";
            
            component.set("v.couponStatus",status);
        }
        document.getElementById("id01").style.display="block";
    },
    couponModalClose:function(component,event){
        document.getElementById("id01").style.display="none";
    },
    openCheckoutWin:function(component,event){
        var modal = document.getElementById("ticketModal");
        modal.style.display = "none";
        document.getElementById("id02").style.display="block";
    },
    closeCheckoutWin:function(component,event){
        document.getElementById("id02").style.display="none";
        document.getElementById("id03").style.display="none";
    },
    hui:function(component,event){
        var x = document.getElementById("201").parentElement.classList.toggle("open");
    },
    getProfileu:function(component,event){
        document.getElementById("OrdersPage").style.display="none";
        document.getElementById("OrderDetails").style.display="none";
        document.getElementById("profilePageEdit").style.display="none";
        document.getElementById("profilePage").style.display="block";
        document.getElementById("cartPage").style.display="none";
        document.getElementById("productPage").style.display="none";
        document.getElementById("wishlistPage").style.display="none";
        document.getElementById("sliderDiv").style.display="none";
        var profaction=component.get("c.getProfileDetails");
        
        profaction.setCallback(this, function(response){
            
            if(response.getState()=="SUCCESS"){
                
                var userProfD=response.getReturnValue();
                
                for(var d=0;d<userProfD.length;d++){
                    
                    var userConId=userProfD[0].Id;
                }		
                component.set("v.userProfDetails",userProfD);
            }});
        
        $A.enqueueAction(profaction);
        
    },
    saveProfile:function(component,event){
        var userProfile=[];
        var p=component.get("v.userProfDetails");
        userProfile=component.get("v.ContactDetails");
        var profileSaveAction=component.get("c.saveContactDetails");
        profileSaveAction.setParams({"obj":userProfile});
        
        profileSaveAction.setCallback(this, function(response){
            
            if(response.getState()=="SUCCESS"){
                alert('UPDATED USER DETAILS');
            }
            else
            {
                alert('UPDATE FAILED');
            }
        });
        
        document.getElementById("OrdersPage").style.display="none";
        document.getElementById("OrderDetails").style.display="none";
        document.getElementById("profilePageEdit").style.display="none";
        document.getElementById("profilePage").style.display="block";
        document.getElementById("cartPage").style.display="none";
        document.getElementById("productPage").style.display="none";
        document.getElementById("wishlistPage").style.display="none";
        document.getElementById("sliderDiv").style.display="none";
        var profaction=component.get("c.getProfileDetails");
        
        profaction.setCallback(this, function(response){
            
            if(response.getState()=="SUCCESS"){
                
                var userProfD=response.getReturnValue();
                
                for(var d=0;d<userProfD.length;d++){
                    
                    var userConId=userProfD[0].Id;
                }		
                component.set("v.userProfDetails",userProfD);
            }});
        $A.enqueueAction(profileSaveAction);
        $A.enqueueAction(profaction);
        
    },
    editProfile:function(component,event){
        document.getElementById("profilePageEdit").style.display="block";
        document.getElementById("profilePage").style.display="none";
        document.getElementById("OrdersPage").style.display="none";
        document.getElementById("OrderDetails").style.display="none";
        
    },
    getOrders:function(component,event){
        
        document.getElementById("OrdersPage").style.display="block";
        document.getElementById("OrderDetails").style.display="block";
        document.getElementById("profilePageEdit").style.display="none";
        document.getElementById("profilePage").style.display="none";
        document.getElementById("cartPage").style.display="none";
        document.getElementById("productPage").style.display="none";
        document.getElementById("wishlistPage").style.display="none";
        document.getElementById("sliderDiv").style.display="none";
        
        var getOrdersAction=component.get("c.getOrdersApex");
        getOrdersAction.setCallback(this, function(response){
            
            var OLE = getOrdersAction.getReturnValue();
            component.set("v.orderProducts",OLE);            
            var orderItemsKeys = [];
            var tile='<ul class="w3-ul w3-card-4 w3-padding">';
            
            for (var key in OLE){
                orderItemsKeys.push(key); 
                tile += '<p class="w3-text-black w3-xlarge">Order Number - '+ key;                
                for(var i=0;i<OLE[key].length;i++){
                    
                    tile += '<li>';
                    
                    tile += '<p>ITEM - '+ OLE[key][i].item.Product2.Name;
                    tile += '<p>ORDER DATE - '+ OLE[key][i].createdDate +'</p>';
                    tile += '<p>QUANTITY - '+ OLE[key][i].Quantity +'</p>';
                    tile += '<p>PRICE - '+ OLE[key][i].itemprice +'</p>';
                    tile += '</li>';
                    
                } 
            }
            tile += '</ul>';
            document.getElementById("OrderDetails").innerHTML = tile; 
            var k='80128000000C3hVAAS';
            component.set("v.key",orderItemsKeys);
        });
        
        $A.enqueueAction(getOrdersAction);    
    },
    userLogin:function(component,event){
        window.location.replace("./secur/logout.jsp");
    }
})