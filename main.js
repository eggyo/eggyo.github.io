
Parse.Cloud.define("hello", function(req, res) {
  res.success("Hi");
});

Parse.Cloud.define('saveSellTransactionCloudRequest', function(request, response) {

                   console.log("run");
                   var product_name = request.params.productName;
                   var sell_date = request.params.date;
                   var sellDate = new Date(sell_date);

                   var sell_unit = request.params.unit;
                   var sell_payment = request.params.payment;
                   var customer_id = request.params.customerID;


                   var PRODUCT = Parse.Object.extend("productStock");
                   var SELL = Parse.Object.extend("sell");

                   var query = new Parse.Query("productStock");
                   query.equalTo("name", product_name);
                   query.find({
                              success: function(product_result) {
                              if(product_result.length == 0){
                              
                              response.success("");
                              
                              }else{
                              var sellObj = new SELL();
                              var productOBJ = new PRODUCT();
                              productOBJ =product_result[0];
                              Parse.Cloud.useMasterKey();

                              var price = productOBJ.get("price");
                              var grossPrice = price * sell_unit;
                              sellObj.set("product",productOBJ);
                              sellObj.set("unit",sell_unit);
                              sellObj.set("payment",sell_payment);
                              sellObj.set("grossPrice",grossPrice);
                              sellObj.set("createdAt",sellDate);

                              sellObj.save(null, {
                                          success: function() {
                                                response.success("save done");
                                          },
                                          error: function(error) {
                                                response.error("save failed:"+error);
                                          }
                                          });
                              }
                              },
                              error: function() {
                              response.error("get product failed");
                              }
                              
                              
                              
                              });
                   });

function getTotalSellInfo (request, response)
{
    
    var totalSellUnit = (request['totalSellUnit']) ? request['totalSellUnit'] : 0;
    var totalSellPayment = (request['totalSellPayment']) ? request['totalSellPayment'] : 0;
    var totalSellGrossPay = (request['totalSellGrossPay']) ? request['totalSellGrossPay'] : 0;
    var totalSellOverduePayment = (request['totalSellOverduePayment']) ? request['totalSellOverduePayment'] : 0;
    var totalSellError = (request['totalSellError']) ? request['totalSellError'] : 0;

    var skip = (request['skip']) ? request['skip'] : 0;
    
    var query = new Parse.Query("sell");
    
    query.limit(1000);
    query.skip(skip);
    query.find({
               success: function (results) {
               
               var totalSellUnit_result = 0;
               var totalSellPayment_result = 0;
               var totalSellGrossPay_result = 0;
               var totalSellOverduePayment_result = 0;
               var totalSellError_result = 0;
               
               if (results.length > 0) { // got results..
               for (var i = 0; i < results.length; ++i) {
               totalSellUnit_result += results[i].get("unit");
               totalSellPayment_result += results[i].get("payment");
               totalSellGrossPay_result += results[i].get("grossPrice");
               
               var overduePayNum;
               overduePayNum = results[i].get("overduePayNum");
               if(overduePayNum != null){
               totalSellOverduePayment_result += overduePayNum;
               }else{
               totalSellOverduePayment_result += 0;
               }
               
               var errorProb;
               errorProb = results[i].get("note");
               if(errorProb == "error"){
               totalSellError_result += results[i].get("grossPrice");
               }


               }
              
               var skip_result = results.length;
               var allSellUnit = totalSellUnit + totalSellUnit_result;
               var allSellPayment = totalSellPayment + totalSellPayment_result;
               var allSellGrossPay = totalSellGrossPay + totalSellGrossPay_result;
               var allSellOverduePay = totalSellOverduePayment + totalSellOverduePayment_result;
               var allSellError = totalSellError + totalSellError_result;

               getTotalSellInfo ({'totalSellError':allSellError,'totalSellUnit':allSellUnit,'totalSellPayment':allSellPayment,'skip':skip_result,'totalSellGrossPay':allSellGrossPay,'totalSellOverduePayment':allSellOverduePay}, response)
               
               }
               else { // we're done here
               response.success({"totalSellError":totalSellError,"totalSellUnit":totalSellUnit,"totalSellPayment":totalSellPayment,"totalSellGrossPay":totalSellGrossPay,"totalSellOverduePayment":totalSellOverduePayment});
               }
               },
               error: function (err) {
               response.error(err);
               }
               });


}
Parse.Cloud.define('getTotalSellInfoCloudRequest', function(request, response) {
                   getTotalSellInfo({}, {
                               success: function (result) {
                               // Do stuff with users
                               response.success(result);
                               },
                               error: function (error) {
                               response.error(error);
                               }
                               });
                   
 
   });



Parse.Cloud.define("updateQuantityAllPurchaseOrderCloudRequest", function(request, response) {
                   updateQuantityAllPurchaseOrder({}, {
                                    success: function (result) {
                                    // Do stuff with users
                                    response.success(result);
                                    },
                                    error: function (error) {
                                    response.error(error);
                                    }
                                    });
                   
                   
                   });
Parse.Cloud.define("updateQuantityAllSellCloudRequest", function(request, response) {
                   updateQuantityAllSell({}, {
                                                  success: function (result) {
                                                  // Do stuff with users
                                                  response.success(result);
                                                  },
                                                  error: function (error) {
                                                  response.error(error);
                                                  }
                                                  });
                   
                   
                   });
Parse.Cloud.define("setZeroQuantityAllproductStockCloudRequest", function(request, response) {
                   setZeroQuantityAllProductStock({}, {
                                         success: function (result) {
                                         // Do stuff with users
                                         response.success(result);
                                         },
                                         error: function (error) {
                                         response.error(error);
                                         }
                                         });
                   
                   
                   });
function setZeroQuantityAllProductStock (request, response)
{
    
    var skip = (request['skip']) ? request['skip'] : 0;
    
    var query = new Parse.Query("productStock");
    
    query.limit(1000);
    query.skip(skip);
    query.find({
               success: function (results) {
               
               if (results.length > 0) { // got results..
               for (var i = 0; i < results.length; ++i) {
               
               results[i].set("amount",0);
               results[i].set("sellNum",0);
               results[i].set("purchaseNum",0);

               results[i].save(null, {
                                success: function() {
                                
                                },
                                error: function(error) {
                                
                                }
                                });
               
               }
               
               var skip_result = results.length;
               
               setZeroQuantityAllProductStock ({'skip':skip_result}, response)
               }
               else { // we're done here
               response.success("done");
               }
               },
               error: function (err) {
               response.error(err);
               }
               });
    


}

function updateQuantityAllSell (request, response)
{
    var Product = Parse.Object.extend("productStock");

    var skip = (request['skip']) ? request['skip'] : 0;
    
    var query = new Parse.Query("sell");
    
    query.limit(1000);
    query.skip(skip);
    query.find({
               success: function (results) {
               
               
               if (results.length > 0) { // got results..
               for (var i = 0; i < results.length; ++i) {
               
               var product_obj = new Product();
               var quantity;
               
               product_obj = results[i].get("product");
               quantity= results[i].get("unit");
               console.log(product_obj.id+":"+quantity);
               product_obj.increment("amount",-1*quantity);
               product_obj.increment("sellNum",quantity);
               product_obj.save(null, {
                                success: function() {
                                
                                },
                                error: function(error) {
                                
                                }
                                });
               }
               
               var skip_result = results.length;
               
               updateQuantityAllSell ({'skip':skip_result}, response)
               }
               else { // we're done here
               response.success("done");
               }
               },
               error: function (err) {
               response.error(err);
               }
               });
    
    
}
function updateQuantityAllPurchaseOrder (request, response)
{
    var Product = Parse.Object.extend("productStock");

    var skip = (request['skip']) ? request['skip'] : 0;
    
    var query = new Parse.Query("purchaseOrder");
    
    query.limit(1000);
    query.skip(skip);
    query.find({
               success: function (results) {
               
               if (results.length > 0) { // got results..
               for (var i = 0; i < results.length; ++i) {
               
               var product_obj = new Product();
               var quantity;
               
               product_obj = results[i].get("product");
               quantity = results[i].get("quantity");

               console.log(product_obj.id+":"+quantity);

               product_obj.increment("amount",quantity);
               product_obj.increment("purchaseNum",quantity);
               product_obj.save(null, {
                           success: function() {

                           },
                           error: function(error) {
                           
                           }
                           });
               
               }
               
               var skip_result = results.length;
               
               updateQuantityAllPurchaseOrder ({'skip':skip_result}, response)
               }
               else { // we're done here
               response.success("done");
               }
               },
               error: function (err) {
               response.error(err);
               }
               });
    
    
}

function getTotalProductInfo (request, response)
{
 
    var totalProductUnit = (request['totalProductUnit']) ? request['totalProductUnit'] : 0;
    var totalProductGrossValue = (request['totalProductGrossValue']) ? request['totalProductGrossValue'] : 0;
    
    var query = new Parse.Query("productStock");
    
    query.limit(1000);
    query.find({
               success: function (results) {
               
               //Parse.Cloud.useMasterKey();

               var totalProductUnit_result = 0;
               var totalProductGrossValue_result = 0;
               
               if (results.length > 0) { // got results..
               for (var i = 0; i < results.length; ++i) {
               var amount = results[i].get("amount");
               var price = results[i].get("price");
               totalProductUnit_result += amount;
               totalProductGrossValue_result += amount * price;
               
               }
               
               var allProductUnit = totalProductUnit + totalProductUnit_result;
               var allProductGrossValue = totalProductGrossValue + totalProductGrossValue_result;
               
               response.success({"totalProductUnit":allProductUnit,"totalProductGrossValue":allProductGrossValue});
               
               }
               else { // we're done here
               response.success();

               }
               },
               error: function (err) {
               response.error(err);
               }
               });
    
    
}
Parse.Cloud.define('getTotalProductInfoCloudRequest', function(request, response) {
                   getTotalProductInfo({}, {
                                    success: function (result) {
                                    // Do stuff with users
                                    response.success(result);
                                    },
                                    error: function (error) {
                                    response.error(error);
                                    }
                                    });
                   
                   
                   });


function purchaseOderInfo (request, response)
{
    
    var totalPurchaseOrderUnit = (request['totalPurchaseOrderUnit']) ? request['totalPurchaseOrderUnit'] : 0;
    var totalPurchaseOrderPayment = (request['totalPurchaseOrderPayment']) ? request['totalPurchaseOrderPayment'] : 0;
    var totalPurchaseOrderGrossPay = (request['totalPurchaseOrderGrossPay']) ? request['totalPurchaseOrderGrossPay'] : 0;
    var totalPurchaseOrderOverduePayment = (request['totalPurchaseOrderOverduePayment']) ? request['totalPurchaseOrderOverduePayment'] : 0;
    var totalPurchaseError = (request['totalPurchaseError']) ? request['totalPurchaseError'] : 0;


    var skip = (request['skip']) ? request['skip'] : 0;
    
    var query = new Parse.Query("purchaseOrder");
    
    query.limit(1000);
    query.skip(skip);
    query.find({
               success: function (results) {
               
               var totalPurchaseOrderUnit_result = 0;
               var totalPurchaseOrderPayment_result = 0;
               var totalPurchaseOrderGrossPay_result = 0;
               var totalPurchaseOrderOverduePayment_result = 0;
               var totalPurchaseError_result = 0;

               if (results.length > 0) { // got results..
               for (var i = 0; i < results.length; ++i) {
               
               var q =results[i].get("quantity");
               var u =results[i].get("unitPrice");
               var g = q * u;

               totalPurchaseOrderUnit_result +=q;
               totalPurchaseOrderGrossPay_result += g;

               var paymentType;
               paymentType = results[i].get("paymentType");
               if(paymentType == "CREDIT"){
               totalPurchaseOrderOverduePayment_result += g;
               }else{
               totalPurchaseOrderPayment_result += g;
               }
               
               var errorProb;
               errorProb = results[i].get("note");
               if(errorProb == "error"){
               totalPurchaseError_result += g;
               }

               
               
               }
               
               var skip_result = results.length;
               var allPurchaseOrderUnit = totalPurchaseOrderUnit + totalPurchaseOrderUnit_result;
               var allPurchaseOrderPayment = totalPurchaseOrderPayment + totalPurchaseOrderPayment_result;
               var allPurchaseOrderGrossPay = totalPurchaseOrderGrossPay + totalPurchaseOrderGrossPay_result;
               var allPurchaseOrderOverduePayment = totalPurchaseOrderOverduePayment + totalPurchaseOrderOverduePayment_result;
               var allPurchaseError = totalPurchaseError + totalPurchaseError_result;


               purchaseOderInfo ({'totalPurchaseOrderUnit':allPurchaseOrderUnit,'totalPurchaseOrderPayment':allPurchaseOrderPayment,'skip':skip_result,'totalPurchaseOrderGrossPay':allPurchaseOrderGrossPay,'totalPurchaseOrderOverduePayment':allPurchaseOrderOverduePayment,'totalPurchaseError':allPurchaseError}, response)
               
               }
               else { // we're done here
               response.success({"totalPurchaseOrderUnit":totalPurchaseOrderUnit,"totalPurchaseOrderPayment":totalPurchaseOrderPayment,"totalPurchaseOrderGrossPay":totalPurchaseOrderGrossPay,"totalPurchaseOrderOverduePayment":totalPurchaseOrderOverduePayment,"totalPurchaseError":totalPurchaseError});
               }
               },
               error: function (err) {
               response.error(err);
               }
               });
    
    
}
Parse.Cloud.define("getTotalPurcahseOrderinfoCloudRequest", function(request, response) {
                   purchaseOderInfo({}, {
                                    success: function (result) {
                                    // Do stuff with users
                                    response.success(result);
                                    },
                                    error: function (error) {
                                    response.error(error);
                                    }
                                    });
                   
                   
                   });

Parse.Cloud.define("getOverdueCustomerCloudRequest", function(request, response) {

                   var SELL = Parse.Object.extend("sell");

                   var query = new Parse.Query("sell");
                   query.equalTo("paymentType", "CREDIT");
                   query.find({
                              success: function(sell_result) {
                              if(sell_result.length == 0){
                              response.success("");
                              }else{
                              for(int i =0;i<sell_result.limit;i++){
                              var sellObj = new SELL();
                              sellObj = sell_result[i];

                              
                              
                              
                              }
                              
                              
                              }
                              },
                              error: function() {
                              response.error("get product failed");
                              }
                              
                              
                              
                              });
                   
                   
                   });

