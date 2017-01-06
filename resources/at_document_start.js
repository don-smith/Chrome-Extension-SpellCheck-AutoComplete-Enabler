/* ╔════════════════════════════════════════════════════════════════════╗
   ║ at_document_start                                                  ║
   ╟────────────────────────────────────────────────────────────────────╢
   ║ File's content is injected after any files from CSS,               ║
   ║ - but before any other DOM is constructed,                         ║
   ║ - or any other script is run.                                      ║
   ╚════════════════════════════════════════════════════════════════════╝
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */

counter_total = 0;

query = [
  '[spellcheck]:not([spellcheck="true"])'                                                                  /* remove limits  */
, '[autocomplete]:not([autocomplete="on"])'                                                                /* remove limits  */
, '[contentEditable]:not([spellcheck]):not([autocomplete])'                                                /* explicit allow */
, 'input:not([readonly]):not([type="hidden"]):not([type="submit"]):not([spellcheck]):not([autocomplete])'  /* explicit allow */
, 'textarea:not([readonly]):not([spellcheck]):not([autocomplete])'                                         /* explicit allow */
].join(', ');


function action(){
  var elements = document.querySelectorAll(query);
  if(null === elements || 0 === elements.length) return;
  counter_total += elements.length;
  try{chrome.runtime.sendMessage({badge_data: counter_total});}catch(err){} /* update extension's badge. */

  elements.forEach(function(element){
    element.setAttribute("spellcheck","true"); 
    element.setAttribute("autocomplete","on"); 
  });
}


action();
setInterval(action, 500); /*only available in pages having JavaScript support*/