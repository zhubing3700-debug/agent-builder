/**
 * 工作台 流失预警客户挽留 - 交互逻辑
 */

// ============ 客户数据 ============
const customerData = {
  li: {
    id: 'li',
    name: '李总',
    riskScore: 92,
    riskLevel: 'high',
    aum: '2,850万',
    vizType: 'timeline', // 默认显示时序轨迹
    vizTitle: '时序本体轨迹',
    hasTabs: true, // 李总有Tab切换
    timeline: [
      {
        time: 'T-3天',
        type: 'warning',
        label: '事件',
        title: '网点访问（异常滞留）',
        desc: '关联实体：<span class="highlight">[XX支行]</span> | 业务特征：办理耗时 <span class="highlight">145 分钟</span>（远超网点均值）'
      },
      {
        time: 'T-3天',
        type: 'alert',
        label: '交互',
        title: '交互工单（情绪异常）',
        desc: '关联实体：<span class="highlight">[XX支行]</span> | 语义标签：<span class="highlight">情绪愤怒、未妥善闭环</span>'
      },
      {
        time: 'T-0天',
        type: 'warning',
        label: '事件',
        title: '协议批量解绑',
        desc: '核心异动：<span class="highlight">多项代扣解绑</span> | 业务影响：<span class="highlight">资金归集率骤降</span>'
      }
    ],
    // 李总的本体图谱数据（重构版：含客服录音、红酒品鉴会，无配偶节点）
    ontologyGraph: {
      nodes: [
        // 事件层
        { id: 'authChange', label: '授权变更', type: 'event', x: 140, y: 50, color: '#f59e0b', borderColor: '#d97706' },
        { id: 'branchVisit', label: '网点访问', type: 'event', x: 400, y: 50, color: '#3b82f6', borderColor: '#2563eb' },
        // 对象层
        { id: 'customer', label: '客户', subtitle: '李总', type: 'object', x: 380, y: 180, color: '#2563eb', borderColor: '#1d4ed8' },
        { id: 'auth', label: '代缴授权', subtitle: '水电煤代扣', type: 'object', x: 80, y: 280, color: '#ef4444', borderColor: '#dc2626' },
        { id: 'complaint', label: '投诉工单', subtitle: '未闭环', type: 'object', x: 280, y: 310, color: '#2563eb', borderColor: '#1d4ed8' },
        { id: 'branch', label: '银行网点', subtitle: 'XX支行', type: 'object', x: 480, y: 310, color: '#2563eb', borderColor: '#1d4ed8' },
        { id: 'serviceRecord', label: '客服录音', subtitle: '柜员服务记录', type: 'object', x: 380, y: 420, color: '#f59e0b', borderColor: '#d97706' },
        { id: 'wineEvent', label: '营销活动', subtitle: '高端红酒品鉴会', type: 'object', x: 100, y: 420, color: '#8b5cf6', borderColor: '#7c3aed' }
      ],
      edges: [
        { from: 'authChange', to: 'auth', label: '变更对象' },
        { from: 'authChange', to: 'customer', label: '变更主体' },
        { from: 'branchVisit', to: 'customer', label: '访问者' },
        { from: 'customer', to: 'auth', label: '动作：撤销/解绑 (T-0)', color: '#ef4444', bold: true },
        { from: 'customer', to: 'complaint', label: '发起' },
        { from: 'customer', to: 'branch', label: '访问地点' },
        { from: 'complaint', to: 'branch', label: '关于' },
        { from: 'serviceRecord', to: 'complaint', label: '语音证据' },
        { from: 'serviceRecord', to: 'branch', label: '服务地点' },
        { from: 'wineEvent', to: 'customer', label: '历史参与 (T-90天)' }
      ]
    },
    cotSteps: [
      {
        type: 'perceive',
        icon: '📍',
        title: '感知',
        text: '捕捉到李总触发多项代扣业务 <span class="key">[撤销]</span> 动作，<span class="key">资金归集频率明显下降</span>。'
      },
      {
        type: 'reason',
        icon: '🔍',
        title: '本体溯源',
        text: '检索时序本体，发现其 T-3 天在 <span class="warning">[XX支行]</span> 产生访问记录，停留时长异常（<span class="warning">145分钟</span>）。'
      },
      {
        type: 'judge',
        icon: '⚖️',
        title: '情绪分析',
        text: '提取关联的 <span class="warning">[投诉工单]</span> 文本及语音记录，识别到 <span class="warning">愤怒情绪</span>，且工单尚未妥善闭环。'
      },
      {
        type: 'conclude high',
        icon: '🚨',
        title: '结论',
        text: '判定为<span class="warning">"服务体验导致的报复性解绑"</span>。综合风险评分达 <span class="warning">92分</span>，如不干预，预计 7 天内资金将全部转出。'
      }
    ],
    actionType: 'urgent',
    script: '李总您好，我是您的专属客户经理小朱。我关注到您周二在XX支行办理业务时等待时间较长，体验不佳，对此我代表分行向您诚挚致歉。为了弥补系统升级给您带来的不便，我特意为您申请了一份由行长签字的专属红酒答谢礼，稍后给您送过去。另外，系统提示您刚刚取消了代扣业务，请问近期是有其他的资金安排计划吗？',
    scriptReason: '直面痛点（道歉排队久）→ 避重就轻（送红酒修复关系）→ 自然过渡（询问资金安排）',
    gift: {
      name: '2018年 奔富红酒',
      icon: '🍷',
      stock: '库存充足',
      reason: 'Agent 检索本体：发现李总 3 个月前曾参与 [高端红酒品鉴会]，生成个性化推荐。'
    }
  },
  zhang: {
    id: 'zhang',
    name: '张总',
    riskScore: 15,
    riskLevel: 'low',
    aum: '1,200万',
    vizType: 'ontologyGraph', // 张总直接显示本体图谱
    vizTitle: '客户本体',
    hasTabs: false,
    // 张总的本体图谱（无网点访问和投诉）
    ontologyGraph: {
      nodes: [
        // 事件层
        { id: 'authChange', label: '授权变更', type: 'event', x: 220, y: 50, color: '#f59e0b', borderColor: '#d97706' },
        // 对象层
        { id: 'customer', label: '客户', subtitle: '张总', type: 'object', x: 380, y: 180, color: '#2563eb', borderColor: '#1d4ed8' },
        { id: 'auth', label: '代缴授权', subtitle: '电费代扣', type: 'object', x: 120, y: 280, color: '#2563eb', borderColor: '#1d4ed8' },
        { id: 'spouse', label: '配偶', subtitle: '王女士(客户号B)', type: 'object', x: 460, y: 300, color: '#8b5cf6', borderColor: '#7c3aed' }
      ],
      edges: [
        { from: 'authChange', to: 'auth', label: '变更对象' },
        { from: 'authChange', to: 'customer', label: '变更主体' },
        { from: 'customer', to: 'auth', label: '拥有' },
        { from: 'spouse', to: 'customer', label: '是…的配偶' }
      ]
    },
    cotSteps: [
      {
        type: 'perceive',
        icon: '📍',
        title: '感知',
        text: '监测到张总（客户号A）于昨日 20:15 <span class="key">解绑了家庭住址X的电费代扣</span>。'
      },
      {
        type: 'reason',
        icon: '🔍',
        title: '推理（关键一步）',
        text: '查询本体网络，发现同一地址X下，<span class="success">张总的配偶王女士（客户号B）在昨日 20:20（5分钟后）新增签约了电费代扣</span>。'
      },
      {
        type: 'judge',
        icon: '⚖️',
        title: '判断',
        text: '资金流<span class="success">未流出家庭本体</span>。推测为"家庭财务分工调整"（可能为了凑王女士信用卡的消费积分）。'
      },
      {
        type: 'conclude',
        icon: '✅',
        title: '结论',
        text: '<span class="success">流失风险极低</span>。建议：忽略此预警。'
      }
    ],
    actionType: 'simple',
    suggestion: '经分析，这属于家庭内部支付方式变更，非流失风险。'
  }
};

// ============ DOM 元素 ============
const todoPanel = document.getElementById('todoPanel');
const detailPanel = document.getElementById('detailPanel');
const backBtn = document.getElementById('backBtn');
const cardLi = document.getElementById('cardLi');
const cardZhang = document.getElementById('cardZhang');
const detailName = document.getElementById('detailName');
const detailScore = document.getElementById('detailScore');
const vizTitle = document.getElementById('vizTitle');
const vizTabs = document.getElementById('vizTabs');
const vizContainer = document.getElementById('vizContainer');
const cotSteps = document.getElementById('cotSteps');
const actionPanel = document.getElementById('actionPanel');
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const callOverlay = document.getElementById('callOverlay');
const callAssist = document.getElementById('callAssist');
const callDuration = document.getElementById('callDuration');
const endCallBtn = document.getElementById('endCallBtn');

let currentCustomer = null;
let callTimer = null;
let callSeconds = 0;
let currentVizTab = 'timeline';

// ============ 工具函数 ============

/**
 * 渲染时序轨迹
 */
function renderTimeline(timeline) {
  return `
    <div class="timeline">
      ${timeline.map(item => `
        <div class="timeline-item ${item.type}">
          <div class="timeline-dot"></div>
          <div class="timeline-time">${item.time}</div>
          <div class="timeline-content">
            <div class="timeline-label">${item.label}</div>
            <div class="timeline-title">${item.title}</div>
            <div class="timeline-desc">${item.desc}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * 渲染本体网络（旧版线性，保留兼容）
 */
function renderOntology(nodes) {
  return `
    <div class="ontology-network">
      ${nodes.map((node, index) => `
        ${index > 0 ? '<div class="ontology-arrow">↓</div>' : ''}
        <div class="ontology-node ${index === 0 ? 'active' : ''}">
          <div class="node-icon">${node.icon}</div>
          <div class="node-info">
            <div class="node-label">${node.label}</div>
            <div class="node-value">${node.value}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * 渲染本体图谱（SVG 节点 + 连线）
 */
function renderOntologyGraph(graphData) {
  const { nodes, edges } = graphData;
  const svgWidth = 600;
  const svgHeight = 470;

  // 构建节点 ID 到坐标的映射
  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  // 生成分割线（事件层与对象层的分界）
  const dividerY = 125;

  // 渲染连线（带箭头）
  let edgesHtml = '';
  edges.forEach((edge, i) => {
    const from = nodeMap[edge.from];
    const to = nodeMap[edge.to];
    if (!from || !to) return;

    const x1 = from.x;
    const y1 = from.y + 20;
    const x2 = to.x;
    const y2 = to.y - 10;

    // 计算中点用于标签
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    const edgeColor = edge.color || '#94a3b8';
    const edgeWidth = edge.bold ? '2.5' : '1.5';
    const edgeFontSize = edge.bold ? '12' : '11';
    const edgeFontWeight = edge.bold ? 'bold' : 'normal';

    edgesHtml += `
            <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
                  stroke="${edgeColor}" stroke-width="${edgeWidth}" marker-end="url(#arrowhead${edge.color ? '-red' : ''})"
                  opacity="0">
                <animate attributeName="opacity" from="0" to="${edge.bold ? '1' : '0.7'}" dur="0.5s" begin="${0.3 + i * 0.1}s" fill="freeze"/>
            </line>
            <text x="${midX}" y="${midY - 6}" text-anchor="middle"
                  font-size="${edgeFontSize}" font-weight="${edgeFontWeight}" fill="${edgeColor}" opacity="0">
                ${edge.label}
                <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${0.5 + i * 0.1}s" fill="freeze"/>
            </text>
        `;
  });

  // 渲染节点
  let nodesHtml = '';
  nodes.forEach((node, i) => {
    const isEvent = node.type === 'event';
    const rectW = isEvent ? 120 : 130;
    const rectH = isEvent ? 40 : 50;
    const rx = isEvent ? 6 : 8;
    const x = node.x - rectW / 2;
    const y = node.y - rectH / 2;

    const fillColor = isEvent ? (node.color + '18') : '#ffffff';
    const strokeColor = node.borderColor || node.color;
    const textColor = '#1e293b';

    nodesHtml += `
            <g opacity="0">
                <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${0.1 + i * 0.12}s" fill="freeze"/>
                <rect x="${x}" y="${y}" width="${rectW}" height="${rectH}" rx="${rx}"
                      fill="${fillColor}" stroke="${strokeColor}" stroke-width="${isEvent ? 2 : 1.5}"
                      ${isEvent ? `stroke-dasharray="none"` : ''}/>
                <text x="${node.x}" y="${node.y + (node.subtitle ? -4 : 4)}"
                      text-anchor="middle" font-size="13" font-weight="600"
                      fill="${textColor}">${node.label}</text>
                ${node.subtitle ? `
                <text x="${node.x}" y="${node.y + 14}"
                      text-anchor="middle" font-size="10" fill="#94a3b8">${node.subtitle}</text>
                ` : ''}
            </g>
        `;
  });

  return `
    <div class="ontology-graph-container">
        <svg viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#94a3b8"/>
                </marker>
                <marker id="arrowhead-red" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#ef4444"/>
                </marker>
            </defs>

            <!-- 分层背景 -->
            <rect x="10" y="10" width="${svgWidth - 20}" height="${dividerY - 10}" rx="10"
                  fill="#fef3c7" opacity="0.3" stroke="#f59e0b" stroke-width="0.5" stroke-dasharray="4"/>
            <text x="30" y="30" font-size="11" fill="#92400e" font-weight="500">事件 (Events)</text>

            <rect x="10" y="${dividerY + 5}" width="${svgWidth - 20}" height="${svgHeight - dividerY - 15}" rx="10"
                  fill="#dbeafe" opacity="0.2" stroke="#2563eb" stroke-width="0.5" stroke-dasharray="4"/>
            <text x="30" y="${dividerY + 25}" font-size="11" fill="#1e40af" font-weight="500">对象 (Objects)</text>

            <!-- 连线 -->
            ${edgesHtml}

            <!-- 节点 -->
            ${nodesHtml}
        </svg>
    </div>
    `;
}

/**
 * 渲染思考链
 */
function renderCotSteps(steps) {
  return steps.map(step => `
    <div class="cot-step ${step.type}">
      <div class="cot-step-icon">${step.icon}</div>
      <div class="cot-step-content">
        <div class="cot-step-title">${step.title}</div>
        <div class="cot-step-text">${step.text}</div>
      </div>
    </div>
  `).join('');
}

/**
 * 渲染简单行动面板（忽略按钮）
 */
function renderSimpleAction(customer) {
  return `
    <div class="action-simple">
      <div class="action-message">
        <div class="action-message-icon">✅</div>
        <div class="action-message-text">
          <strong>建议：可忽略此预警</strong><br>
          ${customer.suggestion}
        </div>
      </div>
      <button class="btn btn-success" id="ignoreBtn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
        一键忽略
      </button>
    </div>
  `;
}

/**
 * 渲染紧急挽留行动面板
 */
function renderUrgentAction(customer) {
  return `
    <div class="action-urgent">
      <div class="action-header">
        <div class="action-header-icon">🚨</div>
        <div class="action-header-text">Agent 已为您准备好紧急挽留策略</div>
      </div>
      <div class="action-sections">
        <div class="action-section">
          <div class="action-section-header">
            <span class="action-section-icon">💬</span>
            <span class="action-section-title">话术生成</span>
          </div>
          <div class="action-section-content">
            <div><strong>策略：</strong>${customer.scriptReason}</div>
            <div class="quote">"${customer.script}"</div>
          </div>
        </div>
        <div class="action-section">
          <div class="action-section-header">
            <span class="action-section-icon">🎁</span>
            <span class="action-section-title">权益推荐</span>
          </div>
          <div class="action-section-content">
            <div>${customer.gift.reason}</div>
            <div class="gift-item">
              <div class="gift-icon">${customer.gift.icon}</div>
              <div class="gift-info">
                <div class="gift-name">${customer.gift.name}</div>
                <div class="gift-stock">✓ ${customer.gift.stock}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="action-buttons">
        <button class="btn btn-secondary" id="detailBtn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          查看完整报告
        </button>
        <button class="btn btn-primary" id="callBtn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          一键拨号
        </button>
      </div>
    </div>
  `;
}

/**
 * 渲染可视化区域内容
 */
function renderVizContent(customer, tabType) {
  if (tabType === 'timeline' && customer.timeline) {
    return renderTimeline(customer.timeline);
  } else if (tabType === 'ontologyGraph' && customer.ontologyGraph) {
    return renderOntologyGraph(customer.ontologyGraph);
  } else if (customer.ontologyNodes) {
    return renderOntology(customer.ontologyNodes);
  }
  return '';
}

/**
 * 设置 Tab 切换事件
 */
function setupVizTabs(customer) {
  const tabs = vizTabs.querySelectorAll('.viz-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 更新 Tab 状态
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const tabType = tab.getAttribute('data-tab');
      currentVizTab = tabType;

      // 更新标题
      if (tabType === 'timeline') {
        vizTitle.textContent = '时序本体轨迹';
      } else {
        vizTitle.textContent = '客户本体';
      }

      // 渲染内容
      vizContainer.innerHTML = renderVizContent(customer, tabType);
    });
  });
}

/**
 * 显示客户详情
 */
function showCustomerDetail(customerId) {
  const customer = customerData[customerId];
  if (!customer) return;

  currentCustomer = customer;

  // 隐藏待办面板，显示详情面板
  todoPanel.style.display = 'none';
  detailPanel.style.display = 'flex';

  // 更新头部信息
  detailName.textContent = customer.name;
  const scoreNumber = detailScore.querySelector('.score-number');
  scoreNumber.textContent = customer.riskScore;
  scoreNumber.className = `score-number ${customer.riskLevel}`;

  // 处理 Tab 显示
  if (customer.hasTabs) {
    vizTabs.style.display = 'flex';
    // 重置 Tab 状态
    const tabs = vizTabs.querySelectorAll('.viz-tab');
    tabs.forEach(t => t.classList.remove('active'));
    tabs[0].classList.add('active');
    currentVizTab = 'timeline';
    vizTitle.textContent = customer.vizTitle;
    setupVizTabs(customer);
  } else {
    vizTabs.style.display = 'none';
    vizTitle.textContent = customer.vizTitle;
  }

  // 渲染可视化区域
  const defaultTab = customer.hasTabs ? 'timeline' : customer.vizType;
  vizContainer.innerHTML = renderVizContent(customer, defaultTab);

  // 更新思考链
  cotSteps.innerHTML = renderCotSteps(customer.cotSteps);

  // 更新行动面板
  if (customer.actionType === 'simple') {
    actionPanel.innerHTML = renderSimpleAction(customer);

    // 绑定忽略按钮事件
    document.getElementById('ignoreBtn').addEventListener('click', () => {
      showIgnoreModal();
    });
  } else {
    actionPanel.innerHTML = renderUrgentAction(customer);

    // 绑定拨号按钮事件
    document.getElementById('callBtn').addEventListener('click', () => {
      startCall();
    });
  }
}

/**
 * 返回待办列表
 */
function backToTodo() {
  detailPanel.style.display = 'none';
  todoPanel.style.display = 'flex';
  currentCustomer = null;
}

/**
 * 显示忽略确认弹窗
 */
function showIgnoreModal() {
  modalContent.innerHTML = `
    <div class="modal-icon">✅</div>
    <div class="modal-title">预警已忽略</div>
    <div class="modal-desc">
      已将张总的预警标记为"误报 - 家庭内部调整"。<br>
      Agent 帮您避免了一个可能尴尬的客户沟通。
    </div>
    <div class="modal-buttons">
      <button class="btn btn-primary" id="modalConfirm">返回待办</button>
    </div>
  `;
  modalOverlay.classList.add('active');

  document.getElementById('modalConfirm').addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    backToTodo();
    // 隐藏张总卡片（模拟已处理）
    cardZhang.style.opacity = '0.5';
    cardZhang.style.pointerEvents = 'none';
  });
}

/**
 * 渲染通话中的本体图谱（灰色初始状态，逐步高亮）
 */
function renderCallOntology(graphData) {
  const { nodes, edges } = graphData;
  const svgWidth = 600;
  const svgHeight = 500;
  const dividerY = 125;

  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  let edgesHtml = '';
  edges.forEach((edge, i) => {
    const from = nodeMap[edge.from];
    const to = nodeMap[edge.to];
    if (!from || !to) return;

    const x1 = from.x;
    const y1 = from.y + 20;
    const x2 = to.x;
    const y2 = to.y - 10;
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    edgesHtml += `
            <line id="call-edge-${i}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
                  stroke="#ddd" stroke-width="1" marker-end="url(#arrowhead-call)"
                  style="transition: all 0.8s ease;"/>
            <text id="call-edge-label-${i}" x="${midX}" y="${midY - 6}" text-anchor="middle"
                  font-size="11" fill="#ddd" style="transition: fill 0.8s ease;">
                ${edge.label}
            </text>
        `;
  });

  let nodesHtml = '';
  nodes.forEach((node, i) => {
    const isEvent = node.type === 'event';
    const rectW = isEvent ? 120 : 130;
    const rectH = isEvent ? 40 : 50;
    const rx = isEvent ? 6 : 8;
    const x = node.x - rectW / 2;
    const y = node.y - rectH / 2;

    nodesHtml += `
            <g id="call-node-${node.id}" opacity="0.3" style="transition: all 0.8s ease;">
                <rect x="${x}" y="${y}" width="${rectW}" height="${rectH}" rx="${rx}"
                      fill="${isEvent ? '#fef9ee' : '#f8fafc'}" stroke="#ddd" stroke-width="1.5"/>
                <text x="${node.x}" y="${node.y + (node.subtitle ? -4 : 4)}"
                      text-anchor="middle" font-size="13" font-weight="600"
                      fill="#999">${node.label}</text>
                ${node.subtitle ? `
                <text x="${node.x}" y="${node.y + 14}"
                      text-anchor="middle" font-size="10" fill="#ccc">${node.subtitle}</text>
                ` : ''}
            </g>
        `;
  });

  return `
        <svg viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <marker id="arrowhead-call" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#ddd" id="arrowhead-call-fill"/>
                </marker>
            </defs>

            <!-- 分层背景 -->
            <rect x="10" y="10" width="${svgWidth - 20}" height="${dividerY - 10}" rx="10"
                  fill="#fef3c7" opacity="0.15" stroke="#e5e7eb" stroke-width="0.5" stroke-dasharray="4"/>
            <text x="30" y="30" font-size="11" fill="#ccc" font-weight="500">事件 (Events)</text>

            <rect x="10" y="${dividerY + 5}" width="${svgWidth - 20}" height="${svgHeight - dividerY - 15}" rx="10"
                  fill="#dbeafe" opacity="0.1" stroke="#e5e7eb" stroke-width="0.5" stroke-dasharray="4"/>
            <text x="30" y="${dividerY + 25}" font-size="11" fill="#ccc" font-weight="500">对象 (Objects)</text>

            <!-- 连线 -->
            ${edgesHtml}

            <!-- 节点 -->
            ${nodesHtml}
        </svg>
    `;
}

/**
 * 高亮本体图谱节点
 */
function highlightOntologyNode(nodeId, color) {
  const nodeEl = document.getElementById(`call-node-${nodeId}`);
  if (!nodeEl) return;

  nodeEl.style.opacity = '1';
  const rect = nodeEl.querySelector('rect');
  const texts = nodeEl.querySelectorAll('text');
  if (rect) {
    rect.setAttribute('stroke', color);
    rect.setAttribute('stroke-width', '2.5');
    rect.style.filter = `drop-shadow(0 0 8px ${color}40)`;
  }
  texts.forEach((t, i) => {
    t.setAttribute('fill', i === 0 ? '#1e293b' : '#475569');
  });
}

/**
 * 高亮本体图谱连线
 */
function highlightOntologyEdge(edgeIndex, color) {
  const line = document.getElementById(`call-edge-${edgeIndex}`);
  const label = document.getElementById(`call-edge-label-${edgeIndex}`);
  if (line) {
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', '2');
    line.style.opacity = '0.8';
  }
  if (label) {
    label.setAttribute('fill', '#475569');
  }
}

/**
 * 开始通话
 */
function startCall() {
  const callOntology = document.getElementById('callOntology');
  callOverlay.style.display = 'flex';
  callSeconds = 0;
  updateCallDuration();

  // 渲染初始灰色本体图谱
  if (currentCustomer && currentCustomer.ontologyGraph) {
    callOntology.innerHTML = renderCallOntology(currentCustomer.ontologyGraph);
  }

  // 清空辅助区域
  callAssist.innerHTML = '';

  callTimer = setInterval(() => {
    callSeconds++;
    updateCallDuration();

    // 模拟通话过程中的逐步高亮 + Agent 辅助提示
    if (callSeconds === 3) {
      // 高亮客户节点
      highlightOntologyNode('customer', '#2563eb');
      showCallAssist('📍 已定位客户本体：李总（高净值客户）');
    }
    if (callSeconds === 6) {
      // 高亮网点访问事件
      highlightOntologyNode('branchVisit', '#3b82f6');
      highlightOntologyEdge(2, '#3b82f6'); // branchVisit -> customer
      showCallAssist('通话已接通，请使用建议话术开场。');
    }
    if (callSeconds === 10) {
      // 高亮投诉工单
      highlightOntologyNode('complaint', '#ef4444');
      highlightOntologyNode('branch', '#64748b');
      highlightOntologyEdge(4, '#ef4444'); // customer -> complaint
      highlightOntologyEdge(5, '#64748b'); // customer -> branch
      highlightOntologyEdge(6, '#ef4444'); // complaint -> branch
      showCallAssist('🔍 追踪到投诉工单：情绪分析为"愤怒"，工单未闭环。');
    }
    if (callSeconds === 15) {
      // 高亮授权变更 + 代缴授权
      highlightOntologyNode('authChange', '#f59e0b');
      highlightOntologyNode('auth', '#d97706');
      highlightOntologyEdge(0, '#d97706'); // authChange -> auth
      highlightOntologyEdge(1, '#f59e0b'); // authChange -> customer
      highlightOntologyEdge(3, '#2563eb'); // customer -> auth
      showCallAssist('检测到客户情绪缓和，可以适时提及VIP权益补偿。');
    }
    if (callSeconds === 20) {
      // 高亮客服录音节点
      highlightOntologyNode('serviceRecord', '#f59e0b');
      highlightOntologyEdge(7, '#f59e0b'); // serviceRecord -> complaint
      highlightOntologyEdge(8, '#f59e0b'); // serviceRecord -> branch
      showCallAssist('🔍 提取客服录音证据：识别到愤怒情绪，工单未妥善闭环。');
    }
    if (callSeconds === 25) {
      // 高亮红酒品鉴会节点
      highlightOntologyNode('wineEvent', '#8b5cf6');
      highlightOntologyEdge(9, '#8b5cf6'); // wineEvent -> customer
      showCallAssist('🔮 本体检索完成：发现李总 3 个月前曾参与 [高端红酒品鉴会]，推荐个性化权益。');
    }
    if (callSeconds === 30) {
      showCallAssist('⚠️ 检测到\"柜员态度差\"关键词。<br>策略调整：承诺24小时内给出处理结果，并邀请李总监督。');
    }
  }, 1000);
}

/**
 * 更新通话时长
 */
function updateCallDuration() {
  const minutes = Math.floor(callSeconds / 60);
  const seconds = callSeconds % 60;
  callDuration.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * 显示通话辅助（追加模式）
 */
function showCallAssist(text) {
  const item = document.createElement('div');
  item.className = 'call-assist-item';
  item.innerHTML = `
    <div class="assist-header">
      <span>🤖</span>
      <span>Agent 实时辅助</span>
    </div>
    <div class="assist-text">${text}</div>
  `;
  callAssist.appendChild(item);
  // 滚动到底部
  callAssist.scrollTop = callAssist.scrollHeight;
}

/**
 * 结束通话
 */
function endCall() {
  clearInterval(callTimer);
  callOverlay.style.display = 'none';

  // 显示通话结束弹窗
  modalContent.innerHTML = `
    <div class="modal-icon">📞</div>
    <div class="modal-title">通话已结束</div>
    <div class="modal-desc">
      通话时长：${callDuration.textContent}<br><br>
      Agent 建议：记录本次沟通内容，并在24小时内跟进投诉处理结果。
    </div>
    <div class="modal-buttons">
      <button class="btn btn-secondary" id="modalCancel">稍后处理</button>
      <button class="btn btn-primary" id="modalConfirm">记录沟通</button>
    </div>
  `;
  modalOverlay.classList.add('active');

  document.getElementById('modalConfirm').addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    backToTodo();
    // 更新李总卡片状态
    cardLi.querySelector('.card-desc').textContent = '已联系 - 待跟进投诉处理';
    cardLi.querySelector('.metric-warning').textContent = '跟进中';
    cardLi.querySelector('.metric-warning').className = 'metric-value metric-safe';
  });

  document.getElementById('modalCancel').addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    backToTodo();
  });
}

// ============ 事件绑定 ============

// 客户卡片点击
cardLi.addEventListener('click', () => showCustomerDetail('li'));
cardZhang.addEventListener('click', () => showCustomerDetail('zhang'));

// 返回按钮
backBtn.addEventListener('click', backToTodo);

// 结束通话按钮
endCallBtn.addEventListener('click', endCall);

// 点击弹窗外部关闭
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('active');
  }
});

// ============ 初始化 ============
document.addEventListener('DOMContentLoaded', () => {
  console.log('工作台 流失预警客户挽留 已初始化');
});
