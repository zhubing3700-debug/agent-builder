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
    vizType: 'ontologyGraph', // 默认显示客户本体图谱
    vizTitle: '客户本体',
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
            <span class="action-section-icon">💡</span>
            <span class="action-section-title">智能闭环挽留策略 <span style="font-size:12px; color:#6b7280; font-weight:normal;">(预设决策树 Pre-loaded Strategy)</span></span>
          </div>
          <div class="action-section-content">
            <div><strong>策略：</strong>${customer.scriptReason}</div>
            <div class="quote">"${customer.script}"</div>
          </div>
          <div class="navigator-standby-bar" style="margin-top: 15px; padding: 10px; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 6px; font-size: 13px; color: #475569; display: flex; align-items: center;">
            <div class="spinner-pulse" style="width:8px; height:8px; background-color: #3b82f6; border-radius: 50%; margin-right:8px; animation: pulse 1.5s infinite"></div>
            <span>✅ 动态决策树已完成预存... 等待通话激活即时增量修正任务</span>
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

    // 如果默认视图是 ontologyGraph，则激活第二个 Tab
    if (customer.vizType === 'ontologyGraph') {
      tabs[1].classList.add('active');
      currentVizTab = 'ontologyGraph';
    } else {
      tabs[0].classList.add('active');
      currentVizTab = 'timeline';
    }

    vizTitle.textContent = customer.vizTitle;
    setupVizTabs(customer);
  } else {
    vizTabs.style.display = 'none';
    vizTitle.textContent = customer.vizTitle;
  }

  // 渲染可视化区域
  const defaultTab = customer.hasTabs ? currentVizTab : customer.vizType;
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

    // 绑定查看完整报告按钮事件
    document.getElementById('detailBtn').addEventListener('click', () => {
      generateAndPrintReport(customer);
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
  // 适配 280px 左侧面板的小画布
  const svgWidth = 260;
  const svgHeight = 240;

  // 为通话场景重新映射节点坐标（小画布）
  const coordMap = {
    customer: { x: 130, y: 40 },
    auth: { x: 50, y: 100 },
    authChange: { x: 210, y: 100 },
    complaint: { x: 50, y: 160 },
    branch: { x: 210, y: 160 },
    serviceRecord: { x: 130, y: 200 },
    wineEvent: { x: 50, y: 230 },
    branchVisit: { x: 210, y: 60 },
  };

  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  let edgesHtml = '';
  edges.forEach((edge, i) => {
    const from = nodeMap[edge.from];
    const to = nodeMap[edge.to];
    if (!from || !to) return;

    const p1 = coordMap[edge.from] || { x: from.x * 0.45, y: from.y * 0.5 };
    const p2 = coordMap[edge.to] || { x: to.x * 0.45, y: to.y * 0.5 };
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;

    edgesHtml += `
            <line id="call-edge-${i}" x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}"
                  stroke="#444" stroke-width="0.8" marker-end="url(#arrowhead-call)"
                  style="transition: all 0.8s ease; opacity:0.4;"/>
            <text id="call-edge-label-${i}" x="${midX}" y="${midY - 4}" text-anchor="middle"
                  font-size="7" fill="#555" style="transition: fill 0.8s ease;">
                ${edge.label}
            </text>
        `;
  });

  let nodesHtml = '';
  nodes.forEach((node) => {
    const pos = coordMap[node.id] || { x: node.x * 0.45, y: node.y * 0.5 };
    const isEvent = node.type === 'event';
    const rectW = isEvent ? 70 : 80;
    const rectH = isEvent ? 22 : 28;
    const rx = isEvent ? 4 : 5;
    const x = pos.x - rectW / 2;
    const y = pos.y - rectH / 2;

    nodesHtml += `
            <g id="call-node-${node.id}" opacity="0.35" style="transition: all 0.8s ease;">
                <rect x="${x}" y="${y}" width="${rectW}" height="${rectH}" rx="${rx}"
                      fill="${isEvent ? '#fef9ee' : '#f8fafc'}" stroke="#555" stroke-width="1"/>
                <text x="${pos.x}" y="${pos.y + (node.subtitle ? -2 : 3)}"
                      text-anchor="middle" font-size="8" font-weight="600"
                      fill="#777">${node.label}</text>
                ${node.subtitle ? `
                <text x="${pos.x}" y="${pos.y + 9}"
                      text-anchor="middle" font-size="6.5" fill="#999">${node.subtitle}</text>
                ` : ''}
            </g>
        `;
  });

  return `
        <svg viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <marker id="arrowhead-call" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
                    <polygon points="0 0, 6 2, 0 4" fill="#555" id="arrowhead-call-fill"/>
                </marker>
            </defs>

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
 * 开始通话 (预加载 + 增量修正)
 */
function startCall() {
  callOverlay.style.display = 'flex';
  callSeconds = 0;
  updateCallDuration();

  const chatWrapper = document.getElementById('chatWrapper');
  const navigatorBody = document.getElementById('navigatorBody');
  const navBadge = document.getElementById('navBadge');
  if (!chatWrapper || !navigatorBody) return;

  chatWrapper.innerHTML = '';

  // 预加载阶段：设置右侧等待状态
  navigatorBody.innerHTML = `
    <div class="nav-empty-state" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:#64748b; font-size:13px; margin-top: 60px;">
      <div class="spinner-pulse" style="width:20px; height:20px; border:2px solid #3b82f6; border-top-color:transparent; border-radius:50%; margin-bottom:12px; animation: spin 1s linear infinite;"></div>
      <span>预加载策略就绪，监听对话流...</span>
    </div>
  `;
  if (navBadge) { navBadge.textContent = '待命'; navBadge.style.color = '#94a3b8'; }

  // 若没有预置动画，动态插入
  if (!document.getElementById('callAnimations')) {
    const style = document.createElement('style');
    style.id = 'callAnimations';
    style.innerHTML = `
      @keyframes spin { 100% { transform: rotate(360deg); } }
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `;
    document.head.appendChild(style);
  }

  // 渲染初始灰色本体图谱
  const callOntology = document.getElementById('callOntology');
  if (currentCustomer && currentCustomer.ontologyGraph && callOntology) {
    callOntology.innerHTML = renderCallOntology(currentCustomer.ontologyGraph);
  }

  callTimer = setInterval(() => {
    callSeconds++;
    updateCallDuration();

    // =============== 小朱四轮高情商对话 + Agent 副驾驶 ===============

    // T+2: 小朱破冰开场（预加载话术，绝口不提解绑）
    if (callSeconds === 2) {
      appendChatBubble('agent', '李总上午好，我是您的专属客户经理小朱。看到您前两天去了一趟XX支行办业务，那天正好赶上系统升级，大堂经理跟我说您等了挺久的，我心里特别过意不去，专门打个电话给您做个服务回访，顺便道个歉。');
      // 本体高亮：网点访问
      try {
        highlightOntologyNode('branchVisit', '#3b82f6');
        highlightOntologyNode('customer', '#2563eb');
        highlightOntologyEdge(2, '#3b82f6');
      } catch (e) { }
    }

    // T+6: 李总愤怒倒苦水（客户主动说出痛点 + 解绑 + 转走）
    if (callSeconds === 6) {
      appendChatBubble('customer', '你们那个柜台到底怎么回事？办个简单的业务让我等了快两个半小时！柜员还爱答不理的。我一生气把你们行的水电煤代扣全关了，正准备下周把资金转走呢。');
    }

    // T+7: ⚡ Agent 实时意图与情绪监控（极速拦截）
    if (callSeconds === 7) {
      // 本体高亮：投诉工单 + 网点 + 代缴授权
      try {
        highlightOntologyNode('complaint', '#ef4444');
        highlightOntologyNode('branch', '#64748b');
        highlightOntologyNode('auth', '#f59e0b');
        highlightOntologyEdge(4, '#ef4444');
        highlightOntologyEdge(5, '#64748b');
        highlightOntologyEdge(3, '#f59e0b');
      } catch (e) { }

      // 右侧导航仪：卡片1
      navigatorBody.innerHTML = '';
      if (navBadge) { navBadge.textContent = '🔴 拦截中'; navBadge.style.color = '#ef4444'; }
      appendNavigatorCard('warning', '⚡ 实时意图与情绪监控', `
        <div style="display:flex; gap:8px; margin-bottom:8px;">
          <span style="background:#7f1d1d; color:#fca5a5; padding:2px 8px; border-radius:4px; font-size:11px;">🔴 极高风险</span>
          <span style="background:#7f1d1d; color:#fca5a5; padding:2px 8px; border-radius:4px; font-size:11px;">😡 情绪：愤怒</span>
        </div>
        <div style="font-size:12px; color:#94a3b8; line-height:1.6;">
          痛点锁定：网点排队 2.5h + 柜员态度差<br>
          危险意图：主动提及「下周资金转走」
        </div>
        <div style="margin-top:8px; padding:6px 10px; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:4px; font-size:11px; color:#fca5a5;">
          ⚠️ 常规话术已失效，启动升级挽留预案
        </div>
      `);
    }

    // T+9: 🤖 LLM 动态策略修正
    if (callSeconds === 9) {
      if (navBadge) { navBadge.textContent = '🔄 策略修正'; navBadge.style.color = '#60a5fa'; }
      // 本体高亮：红酒品鉴会
      try {
        highlightOntologyNode('wineEvent', '#8b5cf6');
        highlightOntologyEdge(9, '#8b5cf6');
      } catch (e) { }

      appendNavigatorCard('suggestion', '🤖 LLM 动态策略修正 <span style="color:#64748b; font-weight:400; font-size:11px;">(850ms)</span>', `
        <div style="display:flex; gap:6px; margin-bottom:8px; flex-wrap:wrap;">
          <span style="background:#1e3a5f; color:#93c5fd; padding:2px 8px; border-radius:4px; font-size:11px;">情绪安抚</span>
          <span style="background:#1e3a5f; color:#93c5fd; padding:2px 8px; border-radius:4px; font-size:11px;">定向权益</span>
          <span style="background:#1e3a5f; color:#93c5fd; padding:2px 8px; border-radius:4px; font-size:11px;">降阻挽回</span>
        </div>
        <div style="margin-top:6px; padding:8px 10px; background:rgba(255,255,255,0.04); border-radius:6px; color:#e2e8f0; font-size:12px; line-height:1.5;">
          💡 <span style="color:#60a5fa;">话术指引：</span>"对不住您…向分行反映柜员问题…申请一支 18 年奔富…代扣停了怕影响信用积分，给您发个'一键恢复链接'？"
        </div>
      `);
    }

    // T+12: 小朱按 Agent 提示回应
    if (callSeconds === 12) {
      appendChatBubble('agent', '实在对不住您李总，耗了您那么多宝贵时间，那个柜员的态度问题我一定向分行立刻反映。我知道您平时对红酒很有研究，特意申请了一支18年的奔富作为赔礼。另外，您的代扣业务要是停了，可能会影响下个月的信用积分，您看我这边直接在后台帮您发送一个一键恢复的确认链接可以吗？');
    }

    // T+16: 李总傲娇同意
    if (callSeconds === 16) {
      appendChatBubble('customer', '行吧，看你态度还不错。你把链接发过来我自己点，红酒你直接寄到我公司吧，下次去网点别再让我排那么久了。');
    }

    // T+17: ✅ 挽留窗口开启
    if (callSeconds === 17) {
      if (navBadge) { navBadge.textContent = '✅ 已闭环'; navBadge.style.color = '#34d399'; }
      appendNavigatorCard('success', '✅ 挽留窗口开启', `
        <div style="display:flex; gap:8px; margin-bottom:8px;">
          <span style="background:#064e3b; color:#6ee7b7; padding:2px 8px; border-radius:4px; font-size:11px;">🟢 情绪缓和</span>
          <span style="background:#064e3b; color:#6ee7b7; padding:2px 8px; border-radius:4px; font-size:11px;">📝 业务闭环</span>
        </div>
        <div style="font-size:12px; color:#94a3b8; line-height:1.6;">
          Agent 自动执行：<br>
          ├─ 生成《代扣一键恢复授权》链接 <span style="background:#065f46; color:#6ee7b7; padding:1px 6px; border-radius:3px; font-size:10px; cursor:pointer;">一键发送</span><br>
          └─ 创建客诉工单 → XX支行行长
        </div>
      `);
    }

  }, 1000);
}

/**
 * 更新通话时长
 */
function updateCallDuration() {
  const minutes = Math.floor(callSeconds / 60);
  const seconds = callSeconds % 60;
  if (callDuration) callDuration.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * 插入聊天气泡 (左侧对话流)
 */
function appendChatBubble(role, text) {
  const chatWrapper = document.getElementById('chatWrapper');
  if (!chatWrapper) return;
  const bubbleObj = document.createElement('div');
  bubbleObj.className = `chat-bubble bubble-${role}`;
  bubbleObj.innerHTML = `
    <div class="bubble-avatar" style="font-size:18px; line-height:1.2; text-align:center; flex-shrink:0;">
        ${role === 'agent' ? '👨‍💼<br><span style="font-size:10px; color:#64748b;">小朱</span>' : '👤<br><span style="font-size:10px; color:#64748b;">李总</span>'}
    </div>
    <div class="bubble-text" style="flex:1; padding: 10px 14px; border-radius: 8px; font-size: 13px; line-height: 1.6; ${role === 'agent' ? 'background:#eff6ff; color:#1e3a8a;' : 'background:#f8fafc; color:#334155; border:1px solid #e2e8f0;'}">${text}</div>
  `;
  bubbleObj.style.display = 'flex';
  bubbleObj.style.gap = '10px';
  bubbleObj.style.marginBottom = '15px';
  bubbleObj.style.animation = 'fadeInUp 0.35s ease forwards';
  if (role === 'customer') bubbleObj.style.flexDirection = 'row-reverse';

  chatWrapper.appendChild(bubbleObj);
  chatWrapper.scrollTop = chatWrapper.scrollHeight;
}

/**
 * 插入增量导航卡片 (右侧) — 状态灯 + 标签极简风格
 */
function appendNavigatorCard(type, title, contentHtml) {
  const navigatorBody = document.getElementById('navigatorBody');
  if (!navigatorBody) return;
  const card = document.createElement('div');
  card.className = `nav-card type-${type}`;
  card.style.animation = 'fadeInUp 0.4s ease forwards';
  card.style.padding = '12px 14px';
  card.style.marginBottom = '12px';
  card.style.borderRadius = '8px';
  card.style.borderLeft = '3px solid';
  card.style.background = '#1e293b';
  card.style.color = '#f8fafc';
  card.style.fontSize = '12px';

  if (type === 'warning') {
    card.style.borderLeftColor = '#ef4444';
    card.style.boxShadow = '0 0 12px rgba(239, 68, 68, 0.15)';
  } else if (type === 'suggestion') {
    card.style.borderLeftColor = '#3b82f6';
    card.style.boxShadow = '0 0 12px rgba(59, 130, 246, 0.15)';
  } else if (type === 'success') {
    card.style.borderLeftColor = '#10b981';
    card.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.15)';
  }

  const headerColor = type === 'warning' ? '#ef4444' : type === 'suggestion' ? '#60a5fa' : '#34d399';

  card.innerHTML = `
    <div style="font-weight:600; margin-bottom:8px; color:${headerColor}; font-size:13px;">${title}</div>
    <div>${contentHtml}</div>
  `;

  navigatorBody.appendChild(card);
  navigatorBody.scrollTop = navigatorBody.scrollHeight;
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

/**
 * 生成图文报告并调用打印(另存为PDF)
 */
function generateAndPrintReport(customer) {
  // 提取客户本体图谱的SVG内容(假设当前在页面上已经渲染了，直接获取其 innerHTML)
  // 如果页面上没渲染，可以重新调 renderOntologyGraph 拿到 SVG 内容
  const graphSvg = renderOntologyGraph(customer.ontologyGraph);

  const reportHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>流失预警分析报告 - ${customer.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #f3f4f6;
      color: #1f2937;
      margin: 0;
      padding: 40px;
      line-height: 1.6;
    }
    .report-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 50px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
      border-top: 6px solid #2563eb;
    }
    .header {
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      color: #111827;
      letter-spacing: -0.5px;
    }
    .header .meta {
      font-size: 14px;
      color: #6b7280;
      text-align: right;
    }
    .profile-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .profile-info h2 { margin: 0 0 5px 0; color: #1e293b; font-size: 20px; }
    .profile-info p { margin: 0; color: #64748b; font-size: 14px; }
    .risk-badge {
      background: #fee2e2;
      color: #ef4444;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: bold;
      font-size: 18px;
      border: 1px solid #fecaca;
    }
    
    .section-title {
      font-size: 18px;
      color: #1e293b;
      border-left: 4px solid #3b82f6;
      padding-left: 12px;
      margin: 30px 0 15px 0;
      font-weight: 600;
    }
    
    .ontology-wrapper {
      background: #fafaf9;
      border: 1px solid #e7e5e4;
      border-radius: 8px;
      padding: 20px;
      margin-top: 15px;
      margin-bottom: 30px;
      display: flex;
      justify-content: center;
    }
    /* 调整 SVG 大小适应报告 */
    .ontology-wrapper svg {
      width: 100%;
      height: 350px;
    }

    .cot-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .cot-item {
      display: flex;
      margin-bottom: 20px;
    }
    .cot-icon {
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      background: #eff6ff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      margin-right: 15px;
    }
    .cot-content h4 {
      margin: 0 0 5px 0;
      font-size: 16px;
      color: #1f2937;
    }
    .cot-content p {
      margin: 0;
      font-size: 14px;
      color: #4b5563;
    }
    .highlight { color: #ef4444; font-weight: 600; }
    .highlight-blue { color: #2563eb; font-weight: 600; }
    
    .strategy-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 20px;
      margin-top: 30px;
    }
    .strategy-box h4 {
      margin: 0 0 10px 0;
      color: #166534;
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .script-box {
      background: white;
      border: 1px solid #dcfce3;
      padding: 15px;
      border-radius: 6px;
      color: #374151;
      font-style: italic;
      font-size: 14px;
      margin-bottom: 15px;
    }
    .reason-text {
      font-size: 13px;
      color: #15803d;
      margin: 0;
    }

    @media print {
      body { background-color: white; padding: 0; }
      .report-container { box-shadow: none; padding: 0; max-width: 100%; border-top: none; }
      /* 隐藏打印界面的不必要元素 */
      @page { margin: 1.5cm; }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="header">
      <div>
        <h1>高净值客户智能预警分析报告</h1>
        <div style="color: #6366f1; font-weight: 600; margin-top: 5px; font-size: 14px;">Powered by AgentBuilder & Ontology</div>
      </div>
      <div class="meta">
        生成时间：${new Date().toLocaleString()}<br>
        报告编号：RPT-${Math.floor(Math.random() * 1000000)}
      </div>
    </div>

    <div class="profile-card">
      <div class="profile-info">
        <h2>${customer.name}</h2>
        <p>资产管理规模 (AUM): ${customer.aum} | 客户评级: 私人银行</p>
      </div>
      <div class="risk-badge">
        流失风险: ${customer.riskScore} 分
      </div>
    </div>

    <div class="section-title">一、 核心异动感知 (Core Anomaly Detection)</div>
    <div style="font-size: 14px; color: #4b5563; margin-bottom: 20px;">
      Agent 监控网络捕捉到客户近日发起 <span class="highlight-blue">多项代扣业务解绑</span>。此动作虽未直接导致AUM下降，但引发了高度预警信号：<strong>资金归集频率呈断崖式下降</strong>。这一前置指标往往是高净值资金大规模转移的先兆。
    </div>

    <div class="section-title">二、 本体下钻追踪 (Ontology Deep Dive)</div>
    <div style="font-size: 14px; color: #4b5563;">
      为探明解绑原因，Agent 跨系统唤醒了客户本体网络资源，将交易流、网点服务流与客诉数据进行时空折叠。下图为映射出的完整业务真相链条：
    </div>
    <div class="ontology-wrapper">
      ${graphSvg}
    </div>

    <div class="section-title">三、 Agent 跨域线索整合与定性</div>
    <ul class="cot-list">
      <li class="cot-item">
        <div class="cot-icon">📍</div>
        <div class="cot-content">
          <h4>时空特征提取</h4>
          <p>T-3 天在 [XX支行] 产生网点访问记录，业务停留耗时 <span class="highlight">145 分钟</span>，远超该行均值。</p>
        </div>
      </li>
      <li class="cot-item">
        <div class="cot-icon">🗣️</div>
        <div class="cot-content">
          <h4>多模态情绪识别</h4>
          <p>穿透 [XX支行] 客服语音及投诉文本，提取到高频 <span class="highlight">愤怒情绪</span> 标签，确认该工单当前 <strong>尚未妥善闭环</strong>。</p>
        </div>
      </li>
      <li class="cot-item">
        <div class="cot-icon">🧠</div>
        <div class="cot-content">
          <h4>决策定性</h4>
          <p>Agent 判断本次资金异动并非正常财务调整，而是 <span class="highlight">"服务体验恶化导致的报复性解绑"</span>，预计7天内流失率将达 99%。</p>
        </div>
      </li>
    </ul>

    <div class="strategy-box">
      <h4>💡 智能闭环挽留策略</h4>
      <div class="script-box">
        "${customer.script}"
      </div>
      <p class="reason-text">
        <strong>策略归因：</strong>${customer.gift ? customer.gift.reason : ''}
      </p>
    </div>
    
  </div>
  <script>
    // 渲染完成后自动触发打印
    window.onload = function() {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  </script>
</body>
</html>
  `;

  // 打开新页面
  const printWin = window.open('', '_blank');
  if (printWin) {
    printWin.document.open();
    printWin.document.write(reportHtml);
    printWin.document.close();
  } else {
    alert('请允许浏览器打开弹出窗口，以生成分析报告。');
  }
}
