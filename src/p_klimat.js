
/* ================= 4.5 Wygląd księgi: haft na lnie, drewniane tabliczki działów ================= */
// Jeden wyraźny motyw: pas haftu krzyżykowego (marzanna i bursztyn) u góry księgi i ten sam ścieg pod nagłówkami.
// Działy to rzeźbione tabliczki z drewna, wybrany ma pod spodem nitkę bursztynu. Karty zostają spokojne, tylko cieplejsze.
// Tylko CSS i jeden mały wzór SVG: bez animacji, nic nie liczy się w pętli gry.
{const stitch=(c1,c2)=>encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="12" viewBox="0 0 24 12"><g stroke-width="1.6" stroke-linecap="round">`
  +`<path d="M2 4l2 2M4 4l-2 2M6 2l2 2M8 2l-2 2M6 6l2 2M8 6l-2 2M10 4l2 2M12 4l-2 2M6 10" stroke="${c1}"/>`
  +`<path d="M14 2l2 2M16 2l-2 2M14 6l2 2M16 6l-2 2M18 4l2 2M20 4l-2 2M22 4l2 2M24 4l-2 2" stroke="${c2}"/></g></svg>`);
 const band=`url("data:image/svg+xml,${stitch('#a03e2c','#d9a441')}")`;
 const grain=`url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency=".9 .06" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .9 0 0 0 0 .85 0 0 0 0 .7 0 0 0 .05 0"/></filter><rect width="160" height="160" filter="url(#f)"/></svg>')}")`;
 const st=document.createElement('style');st.textContent=`
:root{--ks-pine:#18211b;--ks-pine2:#1d2820;--ks-bark:#ece2c8;--ks-amber:#d9a441;--ks-madder:#a03e2c;--ks-wood:#2b2219;--ks-wood2:#3b2d1d;--ks-groove:#4c3d29}
#sheet{background:${grain},linear-gradient(180deg,var(--ks-pine2) 0%,var(--ks-pine) 38%,#141b16 100%);box-shadow:0 -10px 34px #000a,inset 0 1px 0 #f3dca526}
#sheet::before{content:'';position:absolute;left:0;right:0;top:0;height:15px;background:${band} repeat-x 4px 1.5px/24px 12px,linear-gradient(#e9dcc0,#d9cba9);border-radius:inherit;border-bottom-left-radius:0;border-bottom-right-radius:0;box-shadow:inset 0 -1px 0 #8a6a3a,0 1px 0 #0006;pointer-events:none;z-index:1}
#sheet #shead{padding-top:17px}
#sheet #stitle{font:600 23px var(--serif);color:var(--ks-bark);letter-spacing:.01em;display:flex;align-items:center;gap:10px}
#sheet #stitle::before{content:'';width:10px;height:10px;flex:none;transform:rotate(45deg);background:var(--ks-madder);box-shadow:0 0 0 2px var(--ks-pine),0 0 0 3.5px var(--ks-amber)}
/* 4.9.0-rc.25: okna wydarzeń i wieczoru w tym samym stroju co księga: pas haftu, len, romb przy tytule, opcje jak tabliczki */
#ev .box{position:relative}
#ev .box,body #rdCard{background:${grain},linear-gradient(180deg,var(--ks-pine2) 0%,var(--ks-pine) 45%,#141b16 100%);border:1px solid #6b5432;border-radius:12px;box-shadow:0 18px 50px #000a,inset 0 0 0 1px #f3dca514,inset 0 0 0 5px #00000026,inset 0 0 0 6px #d9a44122}
#ev .box{padding-top:30px;padding-bottom:22px}body #rdCard{padding-top:26px;padding-bottom:18px}
#ev .box::before,body #rdCard::before{content:'';position:absolute;left:0;right:0;top:0;height:15px;background:${band} repeat-x 4px 1.5px/24px 12px,linear-gradient(#e9dcc0,#d9cba9);border-radius:11px 11px 0 0;box-shadow:inset 0 -1px 0 #8a6a3a,0 1px 0 #0006;pointer-events:none}
#ev .box::after,body #rdCard::after{content:'';position:absolute;left:18%;right:18%;bottom:8px;height:2px;background:repeating-linear-gradient(90deg,var(--ks-amber) 0 5px,transparent 5px 7px,var(--ks-madder) 7px 10px,transparent 10px 12px);opacity:.75;pointer-events:none}
#ev .eyebrow{color:var(--ks-amber)}
#ev h2{display:flex;align-items:center;gap:10px;color:var(--ks-bark)}
#ev h2::before{content:'';width:10px;height:10px;flex:none;transform:rotate(45deg);background:var(--ks-madder);box-shadow:0 0 0 2px var(--ks-pine),0 0 0 3.5px var(--ks-amber)}
#ev .opts button,#ev .box>button{background:linear-gradient(180deg,var(--ks-wood2),var(--ks-wood));border:1px solid var(--ks-groove);color:#ece2c8;border-radius:10px;box-shadow:inset 0 1px 0 #ffe7b51a,inset 0 -2px 0 #0000004d,0 1px 2px #0007}
#ev .opts button small{color:#cdbd94}
#ev .opts button:hover,#ev .opts button:focus-visible,#ev .box>button:hover{border-color:var(--ks-amber)}
/* działy: tabliczki z drewna */
body.cz #cz-chips button,#tabbar button{position:relative;background:linear-gradient(180deg,var(--ks-wood2),var(--ks-wood));border:1px solid var(--ks-groove);color:#dccfb0;box-shadow:inset 0 1px 0 #ffe7b51a,inset 0 -2px 0 #0000004d,0 1px 2px #0007;border-radius:10px}
body.cz #cz-chips button.on,#tabbar button.on{background:linear-gradient(180deg,#5a4426,#3c2d1a);border-color:var(--ks-amber);color:#fff2d2;box-shadow:inset 0 0 0 1px #d9a44140,inset 0 -2px 0 #0000004d,0 2px 6px #0008}
body.cz #cz-chips button.on::after,#tabbar button.on::after,.nv-seg button.on::after{content:'';position:absolute;left:22%;right:22%;bottom:5px;height:2px;background:repeating-linear-gradient(90deg,var(--ks-amber) 0 5px,transparent 5px 7px,var(--ks-madder) 7px 10px,transparent 10px 12px);border-radius:1px}
.nv-seg{background:#0000002e;border-color:#33402f}
/* widoki działu: drugi poziom, ciszej niż tabliczki */
.nv-seg button{position:relative;background:transparent;border:0;color:#cfc6ad;box-shadow:none}
.nv-seg button.on{background:#ffffff0f;color:#fff2d2;box-shadow:inset 0 0 0 1px #d9a44155}
body.cz #cz-chips{border-bottom-color:#3a3226}#nv-view{border-bottom-color:#3a3226}
/* rodzaje budowli: lniane metki */
#body .bchips button{background:linear-gradient(180deg,#26302a,#1f2822);border:1px solid #3d4a40;color:#e2dbc6}
#body .bchips button.on{background:linear-gradient(180deg,#4a3a22,#33281a);border-color:var(--ks-amber);color:#fff2d2}
#body .bchips button.dim{opacity:.62}
/* nagłówki działów i karty */
#body h3{font-family:var(--serif);color:var(--ks-bark)}
#body h3::after{content:'';display:block;width:58px;height:3px;margin-top:6px;background:repeating-linear-gradient(90deg,var(--ks-amber) 0 6px,transparent 6px 9px,var(--ks-madder) 9px 13px,transparent 13px 16px);border-radius:1px}
#sheet .card,#sheet .ui-section{background:linear-gradient(180deg,#1f2a23,#1b241e);border-color:#33402f;box-shadow:inset 0 1px 0 #ffffff07}
#sheet .card h4{color:#f1e5c6}
#sheet button.pri{background:linear-gradient(180deg,#e4b75e,#c8933c);border-color:#8f6528;color:#2a1b07;box-shadow:inset 0 1px 0 #fff2c866,0 1px 2px #0007}
#sheet button.pri:disabled{filter:saturate(.4) brightness(.8)}
#nv-q,#nv-p{background:#0f1612;border-color:#3d4a40}
@media(max-height:460px),(max-width:370px){body.cz #cz-chips button{font-size:12.5px;letter-spacing:-.15px;padding:0 1px}body.cz #cz-chips button.on{font-weight:600}}
`;document.head.appendChild(st)}
