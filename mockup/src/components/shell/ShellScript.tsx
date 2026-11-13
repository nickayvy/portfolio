/**
 * Inline <head> script that runs during HTML parsing, before first paint:
 * - applies the saved theme (no flash),
 * - marks that JS is on (`data-js`, so `.reveal` content can start hidden),
 * - decides whether the loader plays this session (`data-loading`) or the page
 *   is ready at once (`data-ready`), with a hard 3s safety net.
 * Server component; keep it dependency-free.
 */
const code = `(function(){var d=document.documentElement,w=window,s=w.__nnShell||{};
try{var t=localStorage.getItem("nn-theme");s.theme=t==="dark"?"dark":"light"}catch(e){s.theme="light"}
d.setAttribute("data-theme",s.theme);d.setAttribute("data-js","");
var rm=false,seen=false;try{rm=w.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}
try{seen=sessionStorage.getItem("nn-loaded")==="1"}catch(e){}
s.loading=!rm&&!seen;s.t0=(w.performance&&performance.now())||0;w.__nnShell=s;
if(s.loading){d.setAttribute("data-loading","");setTimeout(function(){if(d.getAttribute("data-ready")!=="true"){s.loading=false;d.removeAttribute("data-loading");d.setAttribute("data-ready","true");try{sessionStorage.setItem("nn-loaded","1")}catch(e){}}},3000)}
else{d.setAttribute("data-ready","true")}
setTimeout(function(){if(!s.hydrated)d.setAttribute("data-noreveal","")},5000)})();`;

export function ShellScript() {
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
