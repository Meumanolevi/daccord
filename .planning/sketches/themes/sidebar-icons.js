/* Local outline icons shared by all sketches. No remote library or icon font.
   Existing navigation buttons, labels, permissions and handlers are preserved. */
(() => {
  'use strict';
  const paths = {
    dashboard:'<rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/><rect x="14" y="14" width="7" height="7" rx="1.4"/>',
    catalog:'<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v9l9 5 9-5V8M12 13v9M7.5 5.5l9 5"/>',
    inventory:'<path d="m3 8 9-5 9 5-9 5-9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/>',
    orders:'<path d="M5 7h14l1 14H4L5 7Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2M9 13h6"/>',
    users:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M17 15a5 5 0 0 1 4 4v2"/>',
    analysis:'<path d="M3 8V4a1 1 0 0 1 1-1h4M16 3h4a1 1 0 0 1 1 1v4M21 16v4a1 1 0 0 1-1 1h-4M8 21H4a1 1 0 0 1-1-1v-4"/><path d="m12 6 1.7 4.3L18 12l-4.3 1.7L12 18l-1.7-4.3L6 12l4.3-1.7L12 6Z"/>',
    governance:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    content:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11M13 13h4M13 16h4"/>',
    promotions:'<path d="M3 7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3a2 2 0 0 0 0 4v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a2 2 0 0 0 0-4V7Z"/><path d="m10 15 4-6M10 9h.01M14 15h.01"/>',
    reports:'<path d="M4 3v17h17M8 15v-4M13 15V7M18 15v-6"/>',
    support:'<path d="M4 14v-2a8 8 0 0 1 16 0v5a4 4 0 0 1-4 4h-3"/><rect x="3" y="11" width="4" height="7" rx="1.5"/><rect x="17" y="11" width="4" height="7" rx="1.5"/>',
    audit:'<path d="M12 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9l4 4v4M13 3v5h5M7 8h2M7 12h3M7 16h2"/><circle cx="16" cy="16" r="3.5"/><path d="m18.5 18.5 3 3"/>',
    settings:'<path d="M4 6h5M15 6h5M4 12h10M20 12h-1M4 18h1M11 18h9"/><circle cx="12" cy="6" r="3"/><circle cx="16" cy="12" r="3"/><circle cx="8" cy="18" r="3"/>',
    profile:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    skin:'<path d="M12 3c4.5 0 7 3.5 7 8 0 6-4 10-7 10s-7-4-7-10c0-4.5 2.5-8 7-8Z"/><path d="M8 10h1M15 10h1M12 11v3M9 17c2 1 4 1 6 0"/>',
    routine:'<path d="M9 5h11M9 12h11M9 19h11M3 5l1 1 2-2M3 12l1 1 2-2M3 19l1 1 2-2"/>',
    favorites:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    address:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    privacy:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 15v2"/>',
    logout:'<path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4M9 12h12M17 8l4 4-4 4"/>',
    storefront:'<path d="M4 10v11h16V10M3 10l2-7h14l2 7M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 21v-6h6v6"/>',
    truck:'<path d="M14 17H9M3 17H2V5h12v12M14 9h4l4 4v4h-3M14 13h8"/><circle cx="6" cy="17" r="3"/><circle cx="17" cy="17" r="3"/>',
    payment:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h3"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'
  };
  const mappings = [
    [/governanca|risco|regras/, 'governance'],[/visao geral|dashboard|inicio/, 'dashboard'],
    [/estoque/, 'inventory'],[/catalogo|produtos/, 'catalog'],[/pedido|compra/, 'orders'],
    [/cliente|equipe|usuario|acessos/, 'users'],[/perfil de pele|minha pele/, 'skin'],
    [/analis|inteligencia/, 'analysis'],[/curadoria|rotina/, 'routine'],[/favorito/, 'favorites'],
    [/conteudo|vitrine/, 'content'],[/promoco|cupom|cupons/, 'promotions'],[/relatorio|indicador/, 'reports'],
    [/suporte|ajuda|atendimento/, 'support'],[/auditoria|rastreabilidade/, 'audit'],
    [/configurac|preferencia/, 'settings'],[/endereco|entrega/, 'address'],
    [/privacidade|seguranca|consentimento/, 'privacy'],[/perfil|meus dados|dados pessoais|minha conta/, 'profile'],[/sair/, 'logout']
  ];
  const selector = '.side-nav button, .sidebar-a nav button, .rail-b nav button, .account-sidebar nav button, .area-nav button';
  function decorate(){
    for(const button of document.querySelectorAll(selector)){
      if(button.querySelector('.wf-icon'))continue;
      const label=button.getAttribute('aria-label')||button.dataset.module||button.title||button.textContent.trim();
      const normal=label.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
      const areaIcons={store:'storefront',shipping:'truck',payment:'payment',ai:'analysis',messages:'mail'};
      const name=areaIcons[button.dataset.area]||mappings.find(([pattern])=>pattern.test(normal))?.[1];
      if(!name)continue;
      let slot=button.querySelector(':scope > i,:scope > .nav-icon');
      if(!slot){
        slot=document.createElement('span');
        if(button.closest('.rail-b')){for(const node of [...button.childNodes])if(node.nodeType===Node.TEXT_NODE)node.remove();}
        button.prepend(slot);
      }
      slot.classList.add('wf-icon-slot');slot.setAttribute('aria-hidden','true');
      slot.innerHTML=`<svg class="wf-icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true" data-icon="${name}">${paths[name]}</svg>`;
      if(!button.getAttribute('aria-label'))button.setAttribute('aria-label',label.replace(/^[^\p{L}\p{N}]+/u,'').trim());
    }
  }
  let queued=false;
  const observer=new MutationObserver(records=>{
    if(queued||!records.some(record=>[...record.addedNodes].some(node=>node.nodeType===1&&!node.closest?.('.wf-icon-slot'))))return;
    queued=true;requestAnimationFrame(()=>{queued=false;decorate();});
  });
  decorate();observer.observe(document.body,{childList:true,subtree:true});
})();
