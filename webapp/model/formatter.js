sap.ui.define(
    ["sap/ui/core/library"],
    function(coreLibrary){
        "use strict";

        var ValueState = coreLibrary.ValueState;

        var oFunctions= {
            quantityText(quantity){
                if(quantity>=3000){
                    return "많음";
                }else if(quantity<1000){
                    return "부족"
                }else return "보통"
            },
            quantityState(quantity){
                if(quantity>=3000){
                    return ValueState.Success;
                }else if(quantity<1000){
                    return ValueState.Error;;
                }else return  ValueState.Information;
            }
        }
        return oFunctions;
    }

)