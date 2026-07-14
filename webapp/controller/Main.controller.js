sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/message/MessageType"
], (Controller, myFormatter,Filter,FilterOperator,JSONModel,MessageType) => {
    "use strict";

    return Controller.extend("code.d01.examreview2.controller.Main", {
        formatter:myFormatter,


        onInit() {
            var oModel = new JSONModel({
                Input: this._initData()
            });
            var oView = this.getView();
            oView.setModel( oModel, "new");
        },
        _initData(){
            // var oI18nModel = this.getView().getModel("i18n");
            // var oResourceBundle = oI18nModel.getResourceBundle();
            // var sCity = oResourceBundle.getText("cityBusan");

            return{
                ProductName: "",
                Price: 0,
                Currency: "KRW",
                Quantity: 0,
                Unit: "BOX",
                City: {
                    Seoul: false,
                    Busan: true
                },
                Storage: "부산"
            }
        },

        onComboBoxSelectionChange(oEvent){
            let oItem = oEvent.getParameter("selectedItem");
            let sKey = oItem.getKey();
            let aFilter = [];
            if(sKey && sKey !== "A"){
                var oFilter = new Filter("StorageCode", FilterOperator.EQ, sKey);
                aFilter.push(oFilter);
            }
            var oList = this.byId("idList");
            // aggregration item는 현재 { path: '/Product', sorter {...}}로
            // Model의 데이터를 가져오기 위한 연결 정보가 기록되어 있다.
            // 그 연결 정보를 가져와서 filter 정보도 추가시키도록한다.
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilter);
        },
        onButtonAddPress(){
            // alert("1")
            // 입력된 값이 올바른지 검사
            var oInputProductName = this.byId("idProductNameInput");
            var sProductName = oInputProductName.getValue();
            if(sProductName && sProductName.length > 0){
                // 정상, 제품명이 있음
            }
            else{
                sap.m.MessageBox.error("제품명이 비어있습니다.");
                return;
            }
            //Message Manager에 오류 메세지가 존재하면 중단한다.
            let oMessageManager = sap.ui.getCore().getMessageManager();
            let aMessageData = oMessageManager.getMessageModel().getData();
            let hasError = aMessageData.some((m)=> m.type === MessageType.Error);

            if(hasError){
                sap.m.MessageBox.error("에러가 존재합니다");
                return;
            }




            // 입력된 값이 올바른지 검사

            // 검사가 통과되면 상품 목록에 추가하는 로직을 실행한다.

            let oView = this.getView();
            let oNewModel = oView.getModel("new");
            /*
            경로 /Input의 데이터를 가져온다.
            이 데이터는 다음과 같이 이뤄져 있다. 이 데이터는 oNewProduct에 전달된다.
            {
                ProductName: "~~~~~~~"
                Price: 1234~~~~~,
                Currency:"KRW"
                Unit: "BOX"
                City: {
                    Seoul: true/false
                    Busan: false/ true
                },
                Storage: "서울" / "부산"
            }
            */
            let oNewProduct = oNewModel.getProperty("/Input");

            if(oNewProduct.City.Seoul) {
                oNewProduct.Storage = "서울"
                oNewProduct.StorageCode = "S"
            }else if(oNewProduct.City.Busan){
                oNewProduct.Storage = "부산"
                oNewProduct.StorageCode = "B"
            }else {
                oNewProduct.Storage = "?"
                oNewProduct.StorageCode = ""
            }

            //기본 모델을 가져와서 경로 /Products에 신규 상품 정보를 추가한다.
            var oModel = oView.getModel();
            var aProducts = oModel.getProperty("/Products");
            aProducts.push(oNewProduct);


            oModel.refresh();
            oNewModel.setProperty("/Input", this._initData());


        }
    });
});