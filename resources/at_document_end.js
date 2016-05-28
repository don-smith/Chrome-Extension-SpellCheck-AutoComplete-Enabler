/* ╔════════════════════════════════════════════════════════════════════╗
   ║ at_document_end                                                    ║
   ╟────────────────────────────────────────────────────────────────────╢
   ║ File's content is injected immediately after the DOM is complete,  ║
   ║ - but before subresources like images and frames have loaded.      ║
   ║ - Like DOMContentLoaded                                            ║
   ╚════════════════════════════════════════════════════════════════════╝
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */
self.setInterval(function(){
  (function(QUERY, elements){
    'use strict';
    elements = document.querySelectorAll(QUERY);
    
    if(null === elements || 0 === elements.length) return;

    chrome.runtime.sendMessage({number_of_elements: elements.length});

    Array.prototype.forEach.call(elements, function(element){
      element.setAttribute("spellcheck","true"); 
      element.setAttribute("autocomplete","on"); 
    });

  }(
    '  [spellcheck]:not([spellcheck="true"])'                                                                  /* remove limits  */
  + ', [autocomplete]:not([autocomplete="on"])'                                                                /* remove limits  */
  + ', [contentEditable]:not([spellcheck]):not([autocomplete])'                                                /* explicit allow */
  + ', input:not([readonly]):not([type="hidden"]):not([type="submit"]):not([spellcheck]):not([autocomplete])'  /* explicit allow */
  + ', textarea:not([readonly]):not([spellcheck]):not([autocomplete])'                                         /* explicit allow */
  , null
  ));
}, 5000);


(function(body, script){
  script.setAttribute("src", "https://www.google-analytics.com/analytics.js");
  script.setAttribute("defer", "");
  script.onload = function(){
    if("undefined" === typeof window.ga) return;
    window.ga("create", "UA-78481436-1", "auto");
    window.ga("require", "linkid", "linkid.js");
    window.ga("require", "displayfeatures");
    //window.ga("set", "&uid", "");
    window.ga("send", "pageview");
  };
  body.appendChild(script);
}(
  document.querySelector("body")
 ,document.createElement("script")
));
