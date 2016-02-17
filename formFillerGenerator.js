javascript: (function() {
    var head = document.head || document.getElementsByTagName('head')[0],
    script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.parsecdn.com/js/parse-latest.js';
    head.appendChild(script);
    
    FFG_initParse = function(){
        if (typeof(Parse) !== 'undefined'){
            Parse.initialize("dE4I09XAf3ydjQ6HAHJsux1WNU9kPwkh6dqjJyvt", "wqErrCU3Idz7s5XnG4MoA2qY7GvJohKpj8nnc3UB");
            FFG_listFormFillers();
        }else{
            setTimeout(FFG_initParse, 1000);
        }
    }
    
    FFG_listFormFillers = function(){
        var FormData = Parse.Object.extend("FormData");
        var query = new Parse.Query(FormData);
        query.find({
          success: function(results) {
            FFG_showMessage("Successfully retrieved " + results.length + " FormFillers.");
            var select = document.getElementById("FFG_formFillerSelection");
            var initialized = false;
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
              var option = document.createElement("option");
              option.text = object.get('appName')+' - '+ object.get('formName')+' - '+object.get('expectedResult');
              option.value = object.id;
              if (object.get('matchingUrl')){
                if (window.location.href.indexOf(object.get('matchingUrl')) !== -1){
                    option.className = "matched";
                    if (!initialized){
                        option.selected = "selected";
                        initialized = true;
                    } 
                }
              }
              select.add(option);
            }
          },
          error: function(error) { FFG_showMessage("Error: " + error.code + " " + error.message);}
        });
    }

    FFG_fillTheForm = function(){
        var FormData = Parse.Object.extend("FormData");
        var query = new Parse.Query(FormData);
        query.get( document.getElementById("FFG_formFillerSelection").value, {
          success: function(object) {
            FFG_showMessage("FormFiller successfuly retrieved");
            var select = document.getElementById("FFG_formFillerSelection");
            var selectValues = object.get('selectValues');
            var inputValues = object.get('inputValues');
            for (var i = 0; i < selectValues.length; i++) {
                FFG_fillSelect(selectValues[i][0], selectValues[i][1]);
            }
            for (var i = 0; i < inputValues.length; i++) {
                FFG_fillInput(inputValues[i][0], inputValues[i][1]);
            }
          },
          error: function(error) { FFG_showMessage("Error: " + error.code + " " + error.message);}
        });
    }

    FFG_saveNewFormFiller = function(){
        var FormData = Parse.Object.extend("FormData");
        var formData = new FormData();
        formData.set("appName", document.getElementById('FFG_appName').value || "");
        formData.set("formName", document.getElementById('FFG_formName').value || "");
        formData.set("expectedResult", document.getElementById('FFG_expectedResult').value || "");
        formData.set("matchingUrl", document.getElementById('FFG_matchingUrl').value || "");

        var formDataValues = FFG_getFormValues();
        formData.set("selectValues", formDataValues.selectValues);
        formData.set("inputValues", formDataValues.inputValues);
        formData.save(null, {
            success: function(formData) {
                FFG_showMessage('New Form Filler created with objectId: ' + formData.id);
            },
            error: function(formData, error) {
                FFG_showMessage('Failed to create new object, with error code: ' + error.message);
            }
        });
    }

    FFG_getFormValues = function() {
        var inputs, selects, index, formData = {selectValues: [], inputValues: []};
        inputs = document.getElementsByTagName('input');
        selects = document.getElementsByTagName('select');
        for (index = 0; index < selects.length; ++index) {
            if (!((index - 1 >= 0) && (selects[index - 1].name == selects[index].name))){
                if (selects[index].name && selects[index].name.indexOf("FFG_") !== 0){
                    formData.selectValues.push([selects[index].name, selects[index].options[selects[index].selectedIndex].text]);
                }
            }
        }
        for (index = 0; index < inputs.length; ++index) {
            if (!((index - 1 >= 0) && (inputs[index - 1].name == inputs[index].name))){
                if (inputs[index].name && inputs[index].name.indexOf("FFG_") !== 0){
                    if (inputs[index].type == "checkbox"){
                        formData.inputValues.push([inputs[index].name, inputs[index].checked]);
                    }else{
                        formData.inputValues.push([inputs[index].name, inputs[index].value.replace(/'/g, "")]);
                    }
                }
            }
        }
        return formData;
    }

    var FFG_fireEvent = function fireEvent(element, event) { if (document.createEventObject) { var evt = document.createEventObject(); return element.fireEvent("on" + event, evt) }
     else { var evt = document.createEvent("HTMLEvents"); evt.initEvent(event, true, true); /* event type,bubbling,cancelable*/ return !element.dispatchEvent(evt); }};
    var FFG_fillInput = function fillInput(name, value) { var elem = document.getElementsByName(name)[0]; if (elem) { if (elem.type == "checkbox"){ if (value) elem.click(); }else{ elem.click(); elem.value = value; } FFG_fireEvent(elem, "change"); }};
    var FFG_fillSelect = function fillSelect(name, value) { 
        var elem = document.getElementsByName(name)[0]; 
        if (elem && elem.tagName == "SELECT") {
            for (var i = 0; i < elem.options.length; i++) {
               if (elem.options[i].text == value) elem.value = elem.options[i].value;
            }
            FFG_fireEvent(elem, "change"); 
        }
    };

    FFG_showUseSection = function() {
        document.getElementById("useSectionTab").className = "active tab";
        document.getElementById("useSectionContent").className = "FFG_row";
        document.getElementById("createSectionTab").className = "inactive tab";
        document.getElementById("createSectionContent").className = "FFG_row hidden";
    }
    FFG_showCreateSection = function(){
        document.getElementById("createSectionTab").className = "active tab";
        document.getElementById("createSectionContent").className = "FFG_row";
        document.getElementById("useSectionTab").className = "inactive tab";
        document.getElementById("useSectionContent").className = "FFG_row hidden";
    }
    FFG_showMessage = function(msg){
        if(msg){
            document.getElementById("FFG_messageContainer").className ="FFG_row";
            var message = document.getElementById("FFG_message");
            message.innerHTML = "&raquo; "+msg;
        }
    }
    FFG_hideMessage = function(msg){ document.getElementById("FFG_messageContainer").className ="hidden"};

    function FFG_showCustomBox (){
        var boxContent =
            "<div id='FFG_tabContainer'>"+
                "<div id='useSectionTab' class='active tab' onclick='FFG_showUseSection()'>Use a Form Filler</div>"+
                "<div id='createSectionTab' class='inactive tab' onclick='FFG_showCreateSection()'>Create New Form Filler </div>"+
            "</div>" +
            "<div id='useSectionContent' class='FFG_row'>"+
                "Form Filler: <select id='FFG_formFillerSelection' name='FFG_formFillerSelection'></select>"+
                "<a id='FFG_fillTheForm' class='button' onclick='FFG_fillTheForm()'>Fill the Form</a>"+
            "</div>"+
            "<div id='createSectionContent' class='FFG_row hidden'>" +
                "<p style='margin: 5px 0;'>&raquo; This extracts the values of the current form to generate a new form filler</p>" +
                "<div class='FFG_inputsContainer'>"+
                    "<input class='third' type='text' id='FFG_appName' name='FFG_appName' placeholder='App name'/>" +
                    "<input class='third' type='text' id='FFG_formName' name='FFG_formName' placeholder='Form name'/>" +
                    "<input class='third' type='text' id='FFG_expectedResult' name='FFG_expectedResult' placeholder='Expected result'/>" +
                    "<input type='text' id='FFG_matchingUrl' name='FFG_matchingUrl' placeholder='Generic part of current URL, to identify the form'/>"+
                "</div>" +
                "<a id='FFG_saveNewFormFiller' class='button' onclick='FFG_saveNewFormFiller()'>Create Form Filler</a>" +
            "</div>" +
            "<p class='hidden FFG_row' id='FFG_messageContainer'><span id='FFG_message'></span> <span class='FFG_hideMessageButton' onclick='FFG_hideMessage()'>x</span></p>" +
            "<div id='FFG_alertClose'>x</div>";
        var id = "FFG_alertBox",
            alertBox, closeId = "alertClose",
            alertClose;
        alertBox = document.createElement("div");
        document.body.appendChild(alertBox);
        alertBox.id = id;
        alertBox.innerHTML = boxContent;
        alertClose = document.getElementById("FFG_alertClose");
        alertClose.onclick = function() {
            var box = document.getElementById("FFG_alertBox");
            box.parentNode.removeChild(box);
        }
        FFG_showMessage("Initializing...");
    }
    
    function FFG_appendCssStyles(){
        var css = '#FFG_alertBox *{border: none; opacity: 1; text-decoration: none; position: relative;  transition: none; box-shadow: none;border-radius: initial;}'+
                        '#FFG_alertBox{position:fixed; width: 100%; top:0; z-index: 10000; background-color: #FFF;font-size: 14px;font-family: sans-serif;box-shadow: 0px 2px 5px #CCC;color:#777;}'+
                        '#FFG_alertBox #FFG_tabContainer{background-color: rgb(221, 221, 221); box-shadow: #CCC 0px -2px 3px inset;}'+
                        '#FFG_alertBox .tab{width:40%; text-align: center; display:inline-block; line-height: 2.5em; cursor: pointer;}'+
                        '#FFG_alertBox .tab.inactive{color: #01A400;}'+
                        '#FFG_alertBox .tab.active{background-color: #FFF; border-top: 3px solid #01D200; bottom: -2px;}'+
                        '#FFG_alertBox .button{ display: inline-block; vertical-align: middle; cursor: pointer; font-size: 1em; color: #FFF; padding: 8px 16px; background-color: #01A400; margin-left: 15px; text-decoration: none; max-width: 30%;}'+
                        '#FFG_alertBox select{ border: 1px solid #EEE; background-color: #FFF; width: inherit;}'+
                        '#FFG_alertBox input{ border: 1px solid #EEE;width: inherit; margin-left:2px;}'+
                        '#FFG_alertBox .FFG_row{ margin: 20px 10px;}'+
                        '#FFG_alertBox .hidden{ display: none;}'+
                        '#FFG_alertBox #FFG_alertClose{ cursor: pointer; font-weight: bold; position: absolute; top: 10px; right: 30px;}'+
                        '#FFG_alertBox #FFG_message{ font-weight: bold; color: #01A400;}'+
                        '#FFG_alertBox .FFG_hideMessageButton{ font-weight: bold; margin: 0 10px; border: 1px; padding: 2px; cursor: pointer; }'+
                        '#FFG_alertBox .FFG_inputsContainer{ width: 65%; vertical-align: middle; display: inline-block;}'+
                        '#FFG_alertBox .FFG_inputsContainer input.third{ display: inline-block; width: 32%;}'+
                        '#FFG_alertBox #FFG_matchingUrl{ width: 98%; margin-top: 5px;}'+
                        '#FFG_alertBox option.matched{ font-weight:bold; color: #01A400;}';
        var style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet){
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
    }

    setTimeout(FFG_showCustomBox, 1000);
    setTimeout(FFG_initParse, 2000);
    FFG_appendCssStyles();

})()