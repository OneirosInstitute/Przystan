/* Rozwijane sekcje mają własny stan, niezależny od odświeżania liczb. */
const uiSections=(()=>{try{const saved=JSON.parse(localStorage.getItem('przystan-sections')||'{}');return saved&&typeof saved==='object'&&!Array.isArray(saved)?saved:{}}catch(error){return {}}})();
function uiDisclosure(key,title,content,defaultOpen=false,description=''){
 const opened=typeof uiSections[key]==='boolean'?uiSections[key]:defaultOpen;
 return `<details class="ui-section" data-ui-section="${escapeHtml(key)}" ${opened?'open':''}><summary><span><b>${escapeHtml(title)}</b>${description?`<small>${escapeHtml(description)}</small>`:''}</span><i aria-hidden="true">⌄</i></summary><div class="ui-section-content">${content}</div></details>`;
}
document.addEventListener('toggle',event=>{const key=event.target.dataset?.uiSection;if(!key||uiSections[key]===event.target.open)return;uiSections[key]=event.target.open;const keys=Object.keys(uiSections);for(const old of keys.slice(0,Math.max(0,keys.length-120)))delete uiSections[old];try{localStorage.setItem('przystan-sections',JSON.stringify(uiSections))}catch(error){}},true);
/* Nagłówki w panelach epoki IV są jawnymi granicami sekcji szablonu. */
function uiFoldHeadings(markup,key){
 const headings=[...markup.matchAll(/<h3>([^<]+)<\/h3>/g)];if(!headings.length)return markup;
 let output=markup.slice(0,headings[0].index);
 headings.forEach((heading,index)=>{const start=heading.index+heading[0].length,end=headings[index+1]?.index??markup.length;output+=uiDisclosure(key+':'+heading[1],heading[1],markup.slice(start,end),index===0)});
 return output;
}
