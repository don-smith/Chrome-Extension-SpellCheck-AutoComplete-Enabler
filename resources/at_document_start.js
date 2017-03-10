/* ╔════════════════════════════════════════════════════════════════════╗
   ║ at_document_start                                                  ║
   ╟────────────────────────────────────────────────────────────────────╢
   ║ File's content is injected after any files from CSS,               ║
   ║ - but before any other DOM is constructed,                         ║
   ║ - or any other script is run.                                      ║
   ╚════════════════════════════════════════════════════════════════════╝
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */

NodeList.prototype.forEach = Array.prototype.forEach;

counter_total = 0;

query = (function(array,glue){
          return array.join(glue + ",") + glue;
        }(
          [
            '[spellcheck]:not([spellcheck="true"])'
          , '[autocomplete]:not([autocomplete="on"])'
          , '[contentEditable]:not([contentEditable="false"])'
          , 'input:not([readonly]):not([disabled]):not([type="hidden"]):not([type="radio"]):not([type="reset"]):not([type="submit"])'
          , 'textarea:not([readonly]):not([disabled])'
          , 'form:not([spellcheck="true"]):not([autocomplete="on"])'
          ]
          ,
          ':not([done-spellcheckautocompleteenabler="final"])'  //maybe be still be `done-spellcheckautocompleteenabler="first_test"` to when we need to run again and unhook the events too..
        ));

function action(){
  var elements = document.querySelectorAll(query);
  if(null === elements || 0 === elements.length) return;
  counter_total += elements.length;
  try{chrome.runtime.sendMessage({badge_data: counter_total});}catch(err){} /* update extension's badge. */

  elements.forEach(function(element){
    var done_flag = element.getAttribute("done-spellcheckautocompleteenabler");
    if(null === done_flag){                                                            //first time, so just set attributes.
      element.setAttribute("done-spellcheckautocompleteenabler", "first_test");
      element.setAttribute("spellcheck","true"); 
      element.setAttribute("autocomplete","on"); 
    }else
    if("first_test" === done_flag){                                                   //something changed-it-back :| we better unhook all events! (eBay's input onchange-event on is a good example for input that keeps having autocomplete and spellcheck disabled on-loop+event-triggered :/  this will cure the events part...)
      var cloned = element.cloneNode(true);                                           //unhook.
      element.parentElement.replaceChild(cloned, element);
      element = cloned;
      cloned  = null;
      element.setAttribute("done-spellcheckautocompleteenabler","final");             //set attributes (again)
      element.setAttribute("spellcheck","true"); 
      element.setAttribute("autocomplete","on"); 
    }else 
    if("final" === done_flag){                                                        //something changed-it-back AGAIN!
      //maybe we should also handle the parent's unhooking events,
      //but I don't want to!
      //---- do nothing..
    }
  });
}

action();
setInterval(action, 500);    /*only available in pages having JavaScript support*/
