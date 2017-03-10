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
          , 'form'
          ]
          ,
          ':not([done-spellcheckautocompleteenabler])'
        ));

function action(){
  var elements = document.querySelectorAll(query);
  if(null === elements || 0 === elements.length) return;
  counter_total += elements.length;
  try{chrome.runtime.sendMessage({badge_data: counter_total});}catch(err){} /* update extension's badge. */

  elements.forEach(function(element){
    element.setAttribute("done-spellcheckautocompleteenabler",""); 
    element.setAttribute("spellcheck","true"); 
    element.setAttribute("autocomplete","on"); 
  });
}

action();
setInterval(action, 500);    /*only available in pages having JavaScript support*/
