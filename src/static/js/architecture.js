(function () {
  const TOPOLOGIES = {
    legacy: {
      nodes: [
        { data: { id: 'monolith', label: 'Legacy Monolith', layer: 'app', info: 'Single deployable unit. High coupling. Slow release cadence.' } },
        { data: { id: 'db_legacy', label: 'On-Prem Database', layer: 'tech', info: 'Oracle DB, on-premises. No HA. Manual backups.' } },
        { data: { id: 'ui_legacy', label: 'Legacy Web UI', layer: 'app', info: 'Server-rendered pages. No API contract.' } },
        { data: { id: 'erp', label: 'ERP System', layer: 'app', info: 'SAP ECC — end-of-life version. Manual integration.' } },
      ],
      edges: [
        { data: { source: 'ui_legacy', target: 'monolith' } },
        { data: { source: 'monolith', target: 'db_legacy' } },
        { data: { source: 'monolith', target: 'erp' } },
      ],
    },
    target: {
      nodes: [
        { data: { id: 'api_gw', label: 'API Gateway', layer: 'tech', info: 'Centralised routing, auth, rate-limiting. Decouples clients from services.' } },
        { data: { id: 'svc_order', label: 'Order Service', layer: 'app', info: 'Bounded context: order lifecycle. Independent deployment.' } },
        { data: { id: 'svc_product', label: 'Product Service', layer: 'app', info: 'Catalogue and inventory. Deployed separately.' } },
        { data: { id: 'db_cloud', label: 'Cloud Database', layer: 'tech', info: 'Managed PostgreSQL. Auto-scaling, HA, point-in-time recovery.' } },
        { data: { id: 'erp_s4', label: 'SAP S/4HANA', layer: 'app', info: 'Modernised ERP. Event-driven integration via middleware.' } },
        { data: { id: 'ui_spa', label: 'React SPA', layer: 'app', info: 'Decoupled front-end. Communicates via API Gateway.' } },
        { data: { id: 'bus', label: 'Event Bus', layer: 'tech', info: 'Async messaging between services. Reduces coupling.' } },
      ],
      edges: [
        { data: { source: 'ui_spa', target: 'api_gw' } },
        { data: { source: 'api_gw', target: 'svc_order' } },
        { data: { source: 'api_gw', target: 'svc_product' } },
        { data: { source: 'svc_order', target: 'db_cloud' } },
        { data: { source: 'svc_product', target: 'db_cloud' } },
        { data: { source: 'svc_order', target: 'bus' } },
        { data: { source: 'bus', target: 'erp_s4' } },
      ],
    },
  };

  const LAYER_COLOURS = { app: '#7d4c67', tech: '#4A7C9C', business: '#C8963E' };

  let cy;
  let currentTopology = 'legacy';

  function buildElements(topo) {
    return [
      ...topo.nodes.map(n => ({
        data: { ...n.data },
        classes: n.data.layer,
      })),
      ...topo.edges,
    ];
  }

  function initCy(topology) {
    cy = cytoscape({
      container: document.getElementById('cy'),
      elements: buildElements(TOPOLOGIES[topology]),
      style: [
        {
          selector: 'node',
          style: {
            'background-color': ele => LAYER_COLOURS[ele.data('layer')] || '#7d4c67',
            'label': 'data(label)',
            'color': '#fff',
            'font-size': '11px',
            'font-family': 'Inter, sans-serif',
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'width': 48,
            'height': 48,
            'border-width': 2,
            'border-color': 'rgba(255,255,255,0.15)',
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': 'rgba(255,255,255,0.2)',
            'target-arrow-color': 'rgba(255,255,255,0.3)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
          },
        },
        {
          selector: ':selected',
          style: { 'border-color': '#FDF5E6', 'border-width': 3 },
        },
      ],
      layout: { name: 'cose', padding: 40, animate: true, animationDuration: 600 },
    });

    cy.on('tap', 'node', function (evt) {
      const node = evt.target;
      const card = document.getElementById('decision-card');
      document.getElementById('card-title').textContent = node.data('label');
      document.getElementById('card-body').textContent = node.data('info') || '';
      card.classList.add('visible');
    });
  }

  function switchTopology(topo) {
    currentTopology = topo;
    cy.elements().remove();
    cy.add(buildElements(TOPOLOGIES[topo]));
    cy.layout({ name: 'cose', padding: 40, animate: true, animationDuration: 600 }).run();
    document.querySelectorAll('.arch-btn[data-topo]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.topo === topo);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initCy('legacy');

    document.querySelectorAll('.arch-btn[data-topo]').forEach(btn => {
      btn.addEventListener('click', () => switchTopology(btn.dataset.topo));
    });

    document.getElementById('close-card').addEventListener('click', () => {
      document.getElementById('decision-card').classList.remove('visible');
    });
  });
})();
