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
            '[spellcheck]'
          , '[autocomplete]'
          , '[contentEditable]:not([contentEditable="false"])'
          , 'input:not([readonly]):not([disabled]):not([hidden]):not([type="hidden"]):not([type="radio"]):not([type="button"]):not([type="file"]):not([type="checkbox"]):not([type="image"]):not([type="reset"]):not([type="submit"])'
          , 'textarea:not([readonly]):not([disabled]):not([hidden])'
          , 'form'
          ]
          ,
          ''
         +':not([style*="display:none"]):not([style*="display: none"])'
         +':not([style*="visibility:hidden"]):not([style*="visibility: hidden"])'
         +':not([spellcheck="true"]):not([autocomplete="on"])'
         +':not([done-spellcheckautocompleteenabler="final"])'  //maybe be still be `done-spellcheckautocompleteenabler="first_test"` to when we need to run again and unhook the events too..
        ));

function action(){
  var elements = document.querySelectorAll(query);
  if(null === elements || 0 === elements.length) return;

  elements.forEach(function(element){
    var done_flag = element.getAttribute("done-spellcheckautocompleteenabler");
    if(null === done_flag){                                                            //first time, so just set attributes.
      element.setAttribute("done-spellcheckautocompleteenabler", "first_test");
      element.setAttribute("spellcheck","true"); 
      element.setAttribute("autocomplete","on"); 
      counter_total+=1;
    }else
    if("first_test" === done_flag){                                                   //something changed-it-back :| we better unhook all events! (eBay's input onchange-event on is a good example for input that keeps having autocomplete and spellcheck disabled on-loop+event-triggered :/  this will cure the events part...)
      element.setAttribute("done-spellcheckautocompleteenabler","final");             //set attributes (wherever or not it will `stick`.. this will be final processing anyway..)

      if(null !== location.hostname.match(/\.google\./i)) return;                     //exceptions to never unhook.. (but still will mark `final`.. :] )

      var cloned = element.cloneNode(true);                                           //unhook.
      element.parentElement.replaceChild(cloned, element);
      element = cloned;
      cloned  = null;
      element.setAttribute("done-spellcheckautocompleteenabler","final");             //set attributes (again)
      element.setAttribute("spellcheck","true"); 
      element.setAttribute("autocomplete","on"); 
      counter_total+=1;
    }else 
    if("final" === done_flag){                                                        //something changed-it-back AGAIN!
      //maybe we should also handle the parent's unhooking events,
      //but I don't want to!
      //---- do nothing..
    }
  });

  try{chrome.runtime.sendMessage({badge_data: counter_total});}catch(err){} /* update extension's badge. */
}

action();
setInterval(action, 500);    /*only available in pages having JavaScript support*/
