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
    aum: '180万',
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
        { id: 'auth', label: '业务协议', subtitle: '房贷提前还贷+定投取消', type: 'object', x: 80, y: 280, color: '#ef4444', borderColor: '#dc2626' },
        { id: 'complaint', label: '投诉工单', subtitle: '未闭环', type: 'object', x: 280, y: 310, color: '#2563eb', borderColor: '#1d4ed8' },
        { id: 'branch', label: '银行网点', subtitle: 'XX支行', type: 'object', x: 480, y: 310, color: '#2563eb', borderColor: '#1d4ed8' },
        { id: 'serviceRecord', label: '客服录音', subtitle: '柜员服务记录', type: 'object', x: 380, y: 420, color: '#f59e0b', borderColor: '#d97706' },
        { id: 'wineEvent', label: '营销活动', subtitle: '高端红酒品鉴会', type: 'object', x: 100, y: 420, color: '#8b5cf6', borderColor: '#7c3aed' }
      ],
      edges: [
        { from: 'authChange', to: 'auth', label: '变更对象' },
        { from: 'authChange', to: 'customer', label: '变更主体' },
        { from: 'branchVisit', to: 'customer', label: '访问主体' },
        { from: 'customer', to: 'auth', label: '操作：撤销/解绑 (T-0)', color: '#ef4444', bold: true },
        { from: 'customer', to: 'complaint', label: '投诉发起方' },
        { from: 'customer', to: 'branch', label: '服务网点' },
        { from: 'complaint', to: 'branch', label: '服务关联' },
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
        text: '捕捉到李总触发多项业务 <span class="key">[房贷提前还贷 + 定投取消]</span> 动作，<span class="key">资金归集频率明显下降</span>。',
        ontologyCall: '【实体】业务协议 -【属性】操作类型 → 房贷提前还贷 + 定投计划取消 (T-0)  |  【实体】业务协议 -【属性】月均归集额 → ¥8.5万 → ¥0（归零）'
      },
      {
        type: 'reason',
        icon: '🔍',
        title: '本体溯源',
        text: '检索时序本体，发现其 T-3 天在 <span class="warning">[XX支行]</span> 产生访问记录，停留时长异常（<span class="warning">145分钟</span>）。',
        ontologyCall: '【实体】客户:李总 -【关系】网点访问.地点 → XX支行  |  【实体】网点访问 -【属性】停留时长 → 145min (阈值: 30min)'
      },
      {
        type: 'judge',
        icon: '⚖️',
        title: '情绪分析',
        text: '提取关联的 <span class="warning">[投诉工单]</span> 文本及语音记录，识别到 <span class="warning">愤怒情绪</span>，且工单尚未妥善闭环。',
        ontologyCall: '【实体】投诉工单 -【属性】情绪标签 → 愤怒 (0.92)  |  【实体】投诉工单 -【属性】闭环状态 → 未闭环  |  【实体】客服录音 -【属性】关键词 → [排队, VIP, 欺骗]'
      },
      {
        type: 'conclude high',
        icon: '🚨',
        title: '结论',
        text: '判定为<span class="warning">"服务体验导致的报复性解绑"</span>。综合风险评分达 <span class="warning">92分</span>，如不干预，预计 7 天内资金将全部转出。',
        ontologyCall: '【模型】风险评分引擎: 网点滞留(+25) + 投诉未闭环(+30) + 房贷定投批量取消(+22) + 情绪指标 0.92(+15) → 92分  |  【模型】流失概率预测(7日) → 99%'
      }
    ],
    actionType: 'urgent',
    script: '李总您好，我是您的专属客户经理小朱。我关注到您周二在XX支行办理业务时等待时间较长，体验不佳，对此我代表分行向您诚挚致歉。为了弥补系统升级给您带来的不便，我特意为您申请了一份由行长签字的专属红酒答谢礼，稍后给您送过去。另外，系统提示您刚刚提前还清了房贷并取消了定投，这可能会影响您的银行星级评定和贵宾通道使用权限，请问近期是有其他的资金安排计划吗？',
    scriptReason: '直面痛点（道歉排队久）→ 避重就轻（送红酒修复关系）→ 自然过渡（询问资金安排）',
    gift: {
      name: '2018年 奔富红酒',
      icon: '🍷',
      stock: '库存充足',
      reason: 'Agent 检索本体：发现李总 3 个月前曾参与 [高端红酒品鉴会]，生成个性化推荐。'
    },
    // 预设决策树：通话前 Agent 预加载的策略分支（关联本体节点）
    decisionTree: [
      { id: 'root', label: '系统监测：代扣异动', type: 'trigger', ontologyRef: '授权变更', next: ['branch1'] },
      { id: 'branch1', label: '意图识别：客户情绪判定', type: 'decision', ontologyRef: '投诉工单', next: ['leaf1a', 'leaf1b'] },
      { id: 'leaf1a', label: '情绪平稳 → 常规挽留话术', type: 'action', ontologyRef: null, next: [] },
      { id: 'leaf1b', label: '情绪激烈 → 切换「特权修复」', type: 'action-highlight', ontologyRef: '客服录音', next: ['branch2'] },
      { id: 'branch2', label: '痛点追踪：VIP 权益 / 排队体验', type: 'decision', ontologyRef: '银行网点', next: ['leaf2a'] },
      { id: 'leaf2a', label: '追责承诺 + 定向权益 + 降阻挽回', type: 'strategy', ontologyRef: '营销活动', next: ['leaf3a'] },
      { id: 'leaf3a', label: '工单督办 #8892 + 奔富红酒 + 一键恢复链接', type: 'output', ontologyRef: '代缴授权', next: [] },
    ]
  },
  zhang: {
    id: 'zhang',
    name: '张总',
    riskScore: 15,
    riskLevel: 'low',
    aum: '120万',
    vizType: 'ontologyGraph', // 张总直接显示本体图谱
    vizTitle: '客户本体',
    hasTabs: false,
    // 张总的本体图谱（增加地址实体和王女士新增签约事件）
    ontologyGraph: {
      nodes: [
        // 事件层
        { id: 'authChange', label: '授权变更', type: 'event', x: 140, y: 50, color: '#f59e0b', borderColor: '#d97706' },
        { id: 'newSign', label: '新增签约', type: 'event', x: 400, y: 50, color: '#10b981', borderColor: '#059669' },
        // 对象层
        { id: 'customer', label: '客户', subtitle: '张总', type: 'object', x: 280, y: 180, color: '#2563eb', borderColor: '#1d4ed8' },
        { id: 'auth', label: '定投计划', subtitle: '基金定投', type: 'object', x: 80, y: 300, color: '#2563eb', borderColor: '#1d4ed8' },
        { id: 'address', label: '住址', subtitle: '地址X', type: 'object', x: 280, y: 310, color: '#f59e0b', borderColor: '#d97706' },
        { id: 'spouse', label: '配偶', subtitle: '王女士(客户号B)', type: 'object', x: 480, y: 180, color: '#8b5cf6', borderColor: '#7c3aed' }
      ],
      edges: [
        { from: 'authChange', to: 'auth', label: '变更对象' },
        { from: 'authChange', to: 'customer', label: '变更主体' },
        { from: 'newSign', to: 'spouse', label: '签约方' },
        { from: 'newSign', to: 'auth', label: '签约对象 (T+5min)', color: '#10b981', bold: true },
        { from: 'customer', to: 'auth', label: '持有 → 取消' },
        { from: 'customer', to: 'address', label: '居住地址' },
        { from: 'spouse', to: 'customer', label: '配偶关系' },
        { from: 'spouse', to: 'address', label: '居住地址' }
      ]
    },
    cotSteps: [
      {
        type: 'perceive',
        icon: '📍',
        title: '感知',
        text: '监测到张总（客户号A）于昨日 20:15 <span class="key">取消了基金定投计划</span>。',
        ontologyCall: '【实体】业务协议 -【属性】操作类型 → 取消定投  |  【实体】定投计划 -【属性】业务类别 → 基金定投'
      },
      {
        type: 'reason',
        icon: '🔍',
        title: '推理（关键一步）',
        text: '查询本体网络，发现<span class="success">张总的配偶王女士（客户号B）在昨日 20:20（5分钟后）新增签约了同一只基金的定投计划</span>。',
        ontologyCall: '【实体】客户:张总 -【关系】配偶 → 王女士(客户号B)  |  【实体】定投计划 -【属性】新增签约 → 同一基金定投 (T+5min)'
      },
      {
        type: 'judge',
        icon: '⚖️',
        title: '判断',
        text: '资金流<span class="success">未流出家庭本体</span>。推测为"家庭内部理财账户调整"（将定投签约转移到配偶名下统一管理）。',
        ontologyCall: '【实体】家庭本体 -【属性】资金流向 → 内部流转  |  【实体】配偶:王女士 -【属性】新增签约 → 同一基金定投 (T+5min)'
      },
      {
        type: 'conclude',
        icon: '✅',
        title: '结论',
        text: '<span class="success">流失风险极低</span>。建议：忽略此预警。',
        ontologyCall: '【模型】风险评分引擎(业务变更 + 家庭本体交叉验证) → 15分  |  【模型】流失概率预测(7日) → 2%'
      }
    ],
    actionType: 'simple',
    suggestion: '经分析，这属于家庭内部理财账户调整（定投签约转移至配偶），非流失风险。'
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
 * 渲染本体图谱（SVG 节点 + 连线）— 支持 Hover 穿透
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

  // 渲染节点（含 Hover 穿透数据）
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
            <g class="ontology-node-hover" data-node-id="${node.id}" opacity="0"
               style="cursor:pointer;">
                <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${0.1 + i * 0.12}s" fill="freeze"/>
                <rect x="${x}" y="${y}" width="${rectW}" height="${rectH}" rx="${rx}"
                      fill="${fillColor}" stroke="${strokeColor}" stroke-width="${isEvent ? 2 : 1.5}"
                      ${isEvent ? `stroke-dasharray="none"` : ''}/>
                <text x="${node.x}" y="${node.y + (node.subtitle ? -4 : 4)}"
                      text-anchor="middle" font-size="13" font-weight="600"
                      fill="${textColor}" style="pointer-events:none;">${node.label}</text>
                ${node.subtitle ? `
                <text x="${node.x}" y="${node.y + 14}"
                      text-anchor="middle" font-size="10" fill="#94a3b8"
                      style="pointer-events:none;">${node.subtitle}</text>
                ` : ''}
            </g>
        `;
  });

  // 渲染完毕后需要调用事件绑定（使用 setTimeout 确保 DOM 已更新）
  setTimeout(() => { setupOntologyTooltips(); }, 600);

  return `
    <div class="ontology-graph-container" style="position:relative;">
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
        <!-- Tooltip 浮窗 -->
        <div id="ontologyTooltip" class="ontology-tooltip" style="display:none;"></div>
    </div>
    `;
}

/**
 * 设置本体图谱节点的 Hover 穿透 Tooltip
 */
function setupOntologyTooltips() {
  // 各节点的业务数据映射
  const tooltipData = {
    complaint: {
      title: '📋 投诉工单',
      lines: [
        '客户：李总',
        '日期：T-3 天',
        '投诉地点：XX支行',
        '原因：VIP 优先通道未兑现',
        '情绪：<span style="color:#ef4444;">愤怒</span>',
        '状态：<span style="color:#f59e0b;">未闭环</span>'
      ]
    },
    branchVisit: {
      title: '🏦 网点访问记录',
      lines: [
        '访问地点：XX支行',
        '日期：T-3 天',
        '排队时长：<span style="color:#ef4444;">145 分钟</span>',
        '办理业务：个人转账',
        '柜员：#0372（已标记）'
      ]
    },
    auth: {
      title: '📄 业务协议',
      lines: [
        '类型：房贷提前还贷 + 定投取消',
        '动作：<span style="color:#ef4444;">全部取消 (T-0)</span>',
        '影响：月均归集额从¥8.5万归零',
        '关联风险：银行星级评定受损'
      ]
    },
    authChange: {
      title: '⚡ 授权变更事件',
      lines: [
        '触发时间：T-0 天 09:15',
        '变更类型：批量解绑',
        '涉及业务：3 项代扣协议',
        '风险信号：<span style="color:#ef4444;">异常</span>'
      ]
    },
    branch: {
      title: '🏢 银行网点：XX支行',
      lines: [
        '地址：XX市XX区XX路88号',
        '当日客流：127 人',
        '平均等候：42 分钟',
        'VIP 通道：<span style="color:#ef4444;">当日未开放</span>'
      ]
    },
    customer: {
      title: '👤 客户：李总',
      lines: [
        'AUM：¥180 万',
        '标签：增长型 · 高管',
        '持有产品：12 项',
        '客户经理：小朱',
        '风险评分：<span style="color:#ef4444;">92</span>'
      ]
    },
    serviceRecord: {
      title: '🎙️ 客服录音',
      lines: [
        '录音编号：SR-20260206-0372',
        '时长：8分32秒',
        '语义标签：情绪愤怒',
        '关联工单：投诉工单（未闭环）',
        '柜员表现：<span style="color:#f59e0b;">需改进</span>'
      ]
    },
    wineEvent: {
      title: '🍷 营销活动',
      lines: [
        '活动名称：高端红酒品鉴会',
        '参与时间：T-90 天',
        '偏好标签：红酒收藏',
        '可用权益：<span style="color:#8b5cf6;">18年奔富 1 支</span>'
      ]
    },
    // 张总的节点
    spouse: {
      title: '👩 配偶：王女士',
      lines: [
        '客户号：B',
        '关系：张总配偶',
        '同一地址 X 同住',
        '近期操作：新增签约基金定投'
      ]
    },
    address: {
      title: '📍 住址：地址X',
      lines: [
        '地址类型：家庭住址',
        '关联客户：张总 + 王女士',
        '关联业务：基金定投计划',
        '交叉验证：<span style="color:#10b981;">同地址双向签约确认</span>'
      ]
    },
    newSign: {
      title: '✅ 新增签约事件',
      lines: [
        '签约方：王女士(客户号B)',
        '签约时间：T+5分钟（20:20）',
        '签约对象：同一基金定投',
        '关联分析：<span style="color:#10b981;">与张总取消为同一业务</span>'
      ]
    }
  };

  const nodeEls = document.querySelectorAll('.ontology-node-hover');
  const tooltip = document.getElementById('ontologyTooltip');
  if (!tooltip) return;

  nodeEls.forEach(el => {
    const nodeId = el.getAttribute('data-node-id');
    const data = tooltipData[nodeId];
    if (!data) return;

    el.addEventListener('mouseenter', (e) => {
      const svg = el.closest('svg');
      const container = svg ? svg.parentElement : null;
      if (!container) return;

      const svgRect = svg.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // 获取节点在 SVG 中的位置
      const rect = el.querySelector('rect');
      if (!rect) return;
      const nodeX = parseFloat(rect.getAttribute('x'));
      const nodeY = parseFloat(rect.getAttribute('y'));
      const nodeW = parseFloat(rect.getAttribute('width'));

      // SVG viewBox 到实际像素的缩放比
      const viewBox = svg.viewBox.baseVal;
      const scaleX = svgRect.width / viewBox.width;
      const scaleY = svgRect.height / viewBox.height;

      // 计算 Tooltip 位置（在节点右侧）
      let tooltipX = (nodeX + nodeW + 8) * scaleX;
      let tooltipY = nodeY * scaleY;

      // 如果超出右边界，放到左侧
      if (tooltipX + 220 > containerRect.width) {
        tooltipX = (nodeX - 228) * scaleX;
      }

      tooltip.innerHTML = `
        <div style="font-weight:600; margin-bottom:6px; font-size:13px; color:#1e293b;">${data.title}</div>
        ${data.lines.map(line => `<div style="font-size:12px; color:#475569; line-height:1.7;">${line}</div>`).join('')}
      `;
      tooltip.style.left = tooltipX + 'px';
      tooltip.style.top = tooltipY + 'px';
      tooltip.style.display = 'block';
    });

    el.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
  });
}

/**
 * 渲染思考链
 */
function renderCotSteps(steps) {
  return steps.map(step => {
    const ontologyHtml = step.ontologyCall
      ? '<div class="cot-ontology-call"><span class="cot-ontology-icon">🔗</span>' + step.ontologyCall.split('|').map(s => '<code>' + s.trim() + '</code>').join('') + '</div>'
      : '';
    return '<div class="cot-step ' + step.type + '">' +
      '<div class="cot-step-icon">' + step.icon + '</div>' +
      '<div class="cot-step-content">' +
      '<div class="cot-step-title">' + step.title + '</div>' +
      '<div class="cot-step-text">' + step.text + '</div>' +
      ontologyHtml +
      '</div>' +
      '</div>';
  }).join('');
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
 * 渲染通话中的动态决策树
 */
function renderCallDecisionTree(isReport = false) {
  const treeData = [
    { id: 'start', label: '通话开始：理财经理开场白', type: 'start', level: 0 },
    { id: 'intent', label: '客户意图识别', type: 'decision', level: 1 },
    { id: 'intent-a', label: '确认代扣/资金安排', type: 'branch-label', level: 2, col: 0 },
    { id: 'intent-b', label: '抱怨服务/VIP未兑现 (愤怒)', type: 'branch-label-active', level: 2, col: 1 },
    { id: 'intent-c', label: '直接威胁转走资金 (强硬)', type: 'branch-label', level: 2, col: 2 },
    { id: 'agent-a', label: '确认信息, 探寻不满', type: 'agent', level: 3, col: 0 },
    { id: 'agent-b', label: '真诚道歉, 承诺调查', type: 'agent-active', level: 3, col: 1 },
    { id: 'agent-c', label: '倾听, 承认风险, 求挽回', type: 'agent', level: 3, col: 2 },
    { id: 'cust-b1', label: '客户: 情绪缓和, 接受道歉', type: 'customer-reaction', level: 4, col: 0 },
    { id: 'cust-b2', label: '客户: 持续激动, 不接受', type: 'customer-reaction', level: 4, col: 1 },
    { id: 'act-b1', label: '承诺解决 + 个性化挽留', type: 'agent-highlight', level: 5, col: 0 },
    { id: 'act-b2', label: '升级处理, 高层介入', type: 'agent', level: 5, col: 1 },
    { id: 'cust-r1', label: '对方案感兴趣', type: 'customer-positive', level: 6, col: 0 },
    { id: 'cust-r2', label: '不感兴趣/仍有疑虑', type: 'customer-reaction', level: 6, col: 1 },
    { id: 'act-final', label: '立即行动, 约定回访, 解决遗留', type: 'agent-success', level: 7, col: 0 },
    { id: 'end', label: '通话结束: 达成共识, 生成待办', type: 'end', level: 8 },
  ];

  const typeStyles = {
    'start': { bg: '#f8fafc', border: '#94a3b8', color: '#475569', icon: '📞' },
    'decision': { bg: '#faf5ff', border: '#a78bfa', color: '#6d28d9', icon: '◆' },
    'branch-label': { bg: '#fef9c3', border: '#f59e0b', color: '#92400e', icon: '' },
    'branch-label-active': { bg: '#fee2e2', border: '#ef4444', color: '#991b1b', icon: '' },
    'agent': { bg: '#f0f9ff', border: '#93c5fd', color: '#1e40af', icon: '' },
    'agent-active': { bg: '#dbeafe', border: '#3b82f6', color: '#1d4ed8', icon: '' },
    'agent-highlight': { bg: '#d1fae5', border: '#10b981', color: '#065f46', icon: '' },
    'agent-success': { bg: '#d1fae5', border: '#059669', color: '#064e3b', icon: '✅' },
    'customer-reaction': { bg: '#fef3c7', border: '#d97706', color: '#92400e', icon: '' },
    'customer-positive': { bg: '#d1fae5', border: '#10b981', color: '#065f46', icon: '' },
    'end': { bg: '#f0f9ff', border: '#3b82f6', color: '#1e40af', icon: '🎯' },
  };

  let html = '<div class="dt-flow">';
  let prevLevel = -1;

  treeData.forEach((node, i) => {
    const s = typeStyles[node.type] || typeStyles['agent'];
    const isFullWidth = node.col === undefined;

    if (i > 0 && node.level > prevLevel) {
      html += '<div class="dt-connector">↓</div>';
    }

    const opacityStr = isReport ? '1' : '0.45';
    const idStr = isReport ? '' : 'id="dt-' + node.id + '"';

    if (isFullWidth) {
      html += '<div class="dt-node" ' + idStr + ' data-level="' + node.level + '" style="background:' + s.bg + ';border:1.5px solid ' + s.border + ';color:' + s.color + ';opacity:' + opacityStr + ';">' + (s.icon ? s.icon + ' ' : '') + node.label + '</div>';
    } else {
      const prevNode = treeData[i - 1];
      if (!prevNode || prevNode.level !== node.level || prevNode.col === undefined) {
        html += '<div class="dt-row">';
      }
      html += '<div class="dt-node dt-branch" ' + idStr + ' data-level="' + node.level + '" style="background:' + s.bg + ';border:1.5px solid ' + s.border + ';color:' + s.color + ';opacity:' + opacityStr + ';">' + (s.icon ? s.icon + ' ' : '') + node.label + '</div>';
      const nextNode = treeData[i + 1];
      if (!nextNode || nextNode.level !== node.level) {
        html += '</div>';
      }
    }
    prevLevel = node.level;
  });

  html += '</div>';
  return html;
}

/**
 * 高亮决策树节点
 */
function highlightDTNode(nodeId, glow) {
  const el = document.getElementById('dt-' + nodeId);
  if (el) {
    el.style.opacity = '1';
    el.style.fontWeight = '600';
    if (glow) {
      el.style.boxShadow = '0 0 12px ' + glow + '40, 0 2px 8px ' + glow + '20';
    }
  }
}

/**
 * 开始通话 (预加载 + 增量修正 + 动态决策树)
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
  navigatorBody.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#64748b;font-size:13px;margin-top:60px;"><div style="width:20px;height:20px;border:2px solid #3b82f6;border-top-color:transparent;border-radius:50%;margin-bottom:12px;animation:spin 1s linear infinite;"></div><span>预加载策略就绪，监听对话流...</span></div>';
  if (navBadge) { navBadge.textContent = '待命'; navBadge.style.color = '#94a3b8'; }

  // 若没有预置动画，动态插入
  if (!document.getElementById('callAnimations')) {
    const style = document.createElement('style');
    style.id = 'callAnimations';
    style.innerHTML = `
  @keyframes spin { 100 % { transform: rotate(360deg); } }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `;
    document.head.appendChild(style);
  }

  // 渲染动态决策树（初始灰色）
  const callDT = document.getElementById('callDecisionTree');
  if (callDT) {
    callDT.innerHTML = renderCallDecisionTree();
  }

  callTimer = setInterval(() => {
    callSeconds++;
    updateCallDuration();

    // =============== 新对话脚本（基于设计文档：1.5分钟/小朱/流式输出） ===============

    // T+2: 小朱专业切入开场白
    if (callSeconds === 2) {
      appendChatBubble('agent', '李总上午好，我是小朱。看到您前两天去了XX支行……我心里特别过意不去，专门打电话做个回访，顺便道个歉。');
      // 决策树高亮：通话开始 + 意图识别
      highlightDTNode('start', '#3b82f6');
      highlightDTNode('intent', '#8b5cf6');
    }

    // T+15: 李总愤怒爆发（VIP + 排队 + 柜员态度差）
    if (callSeconds === 15) {
      appendChatBubble('customer', '你们那个柜台到底怎么回事？等了两个半小时！柜员爱答不理！我房贷都提前还清了、定投也取消了，正准备下周把资金转走！');
      // 高亮：意图B（服务不满/愤怒）
      highlightDTNode('intent-b', '#ef4444');
    }

    // T+22: ⚡ Agent 实时意图与情绪监控
    if (callSeconds === 22) {
      highlightDTNode('agent-b', '#3b82f6');
      navigatorBody.innerHTML = '';
      if (navBadge) { navBadge.textContent = '🔴 拦截中'; navBadge.style.color = '#ef4444'; }
      appendNavigatorCard('warning', '⚡ 实时意图与情绪监控', '<div style="display:flex;gap:8px;margin-bottom:8px;flex-wrap:wrap;"><span style="background:#7f1d1d;color:#fca5a5;padding:2px 8px;border-radius:4px;font-size:11px;">🔴 极高风险</span><span style="background:#7f1d1d;color:#fca5a5;padding:2px 8px;border-radius:4px;font-size:11px;">😡 情绪：愤怒</span></div><div style="font-size:12px;color:#94a3b8;line-height:1.6;">意图识别：<span style="color:#fca5a5;font-weight:600;">抱怨服务/VIP权益未兑现</span><br>关键词命中：「排队」「资金转走」「关代扣」<br>痛点锁定：排队 2.5h + 柜员态度差 + 资金流出意向</div><div style="margin-top:8px;padding:6px 10px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:4px;font-size:11px;color:#fca5a5;">⚠️ 常规话术已失效 → 启动升级挽留预案</div>');
    }

    // T+25: 🤖 LLM 动态策略修正
    if (callSeconds === 25) {
      if (navBadge) { navBadge.textContent = '🔄 策略修正'; navBadge.style.color = '#60a5fa'; }
      appendNavigatorCard('suggestion', '🤖 LLM 动态策略修正 <span style="color:#64748b; font-weight:400; font-size:11px;">(850ms)</span>', `
        <div style="display:flex; gap:6px; margin-bottom:8px; flex-wrap:wrap;">
          <span style="background:#1e3a5f; color:#93c5fd; padding:2px 8px; border-radius:4px; font-size:11px;">情绪安抚</span>
          <span style="background:#1e3a5f; color:#93c5fd; padding:2px 8px; border-radius:4px; font-size:11px;">定向权益</span>
          <span style="background:#1e3a5f; color:#93c5fd; padding:2px 8px; border-radius:4px; font-size:11px;">降阻挽回</span>
        </div>
        <div style="margin-top:6px; padding:8px 10px; background:rgba(255,255,255,0.04); border-radius:6px; color:#e2e8f0; font-size:12px; line-height:1.5;">
          💡 <span style="color:#60a5fa;">话术指引：</span>"对不住您…柜员态度我立刻反映…申请18年奔富做赔礼…房贷还清定投取消会影响星级评定，发专属理财方案…"
        </div>
      `);
    }

    // T+30: 小朱第一轮回应（共情 + 提供补偿 + 一键恢复链接）
    if (callSeconds === 30) {
      appendChatBubble('agent', '对不住您李总……给您带来这么大麻烦。您刚提到的柜员态度问题，我立刻向分行反映，绝不姑息。我也知道您对红酒很有研究，特意给您申请了一支18年的奔富作为赔礼。我看您房贷都提前还清了，定投也取消了，这会影响您的银行星级评定和贵宾优先通道，要不我给您重新发个专属理财方案？');
      highlightDTNode('act-b1', '#3b82f6'); // 匹配左侧的意图：承诺解决+个性化挽留
    }

    // T+48: 李总傲娇接受
    if (callSeconds === 48) {
      appendChatBubble('customer', '行吧，看你态度还不错。链接发过来我自己点，红酒寄到公司。');
      highlightDTNode('cust-b1', '#059669'); // 客户: 情绪缓和, 接受道歉
      highlightDTNode('cust-r1', '#059669'); // 对方案感兴趣
    }

    // T+51: 📊 情绪回正追踪卡片
    if (callSeconds === 51) {
      appendNavigatorCard('info', '📊 情绪曲线回正', `
        <div style="display:flex; gap:8px; margin-bottom:8px; flex-wrap:wrap;">
          <span style="background:#1e3a5f; color:#93c5fd; padding:2px 8px; border-radius:4px; font-size:11px;">😡 0.92 → 😐 0.54 → 😊 0.35</span>
        </div>
        <div style="font-size:12px; color:#94a3b8; line-height:1.6;">
          情绪指标持续下行，客户语调显著缓和<br>
          “还不错”“自己点”‘→ 放弃抵触信号<br>
          <span style="color:#6ee7b7;">✅ 挽回窗口已打开，建议立即执行闭环动作</span>
        </div>
      `);
    }

    // T+54: ✅ Agent 闭环执行
    if (callSeconds === 54) {
      highlightDTNode('act-final', '#059669');
      if (navBadge) { navBadge.textContent = '✅ 已闭环'; navBadge.style.color = '#34d399'; }
      appendNavigatorCard('success', '✅ 挽留窗口开启 · 待办事项', `
        <div style="display:flex; gap:8px; margin-bottom:8px;">
          <span style="background:#064e3b; color:#6ee7b7; padding:2px 8px; border-radius:4px; font-size:11px;">🟢 情绪缓和</span>
          <span style="background:#064e3b; color:#6ee7b7; padding:2px 8px; border-radius:4px; font-size:11px;">📝 业务闭环</span>
        </div>
        <div style="font-size:12px; color:#94a3b8; line-height:1.6;">
          Agent 自动执行：<br>
            ├─ 创建投诉工单 #8892 → XX支行行长<br>
            ├─ 生成《代扣一键恢复授权》短链<br>
            └─ 发送产品资料与恢复链接 <span id="btnSendMaterial" onclick="sendProductMaterial(this)" style="background:#065f46; color:#6ee7b7; padding:1px 6px; border-radius:3px; font-size:10px; cursor:pointer; transition:all 0.2s;">一键发送</span>
        </div>
      `);
    }

    // T+58: 小朱收尾
    if (callSeconds === 58) {
      appendChatBubble('agent', '感谢李总的理解和支持！链接和红酒这就给您安排。另外如果您那几千万资金还在犹豫，我们这儿正好有个专属高净值的理财产品，我也一并打包发您微信了，您随时召唤我。');
      highlightDTNode('end', '#3b82f6');
    }

    // T+72: 工单追踪卡片 (展示最后状态)
    if (callSeconds === 72) {
      appendNavigatorCard('info', '📋 实时追踪工单', `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-size:14px; font-weight:700; color:#e2e8f0; letter-spacing:0.5px;">#8892</span>
          <span style="display:inline-flex; align-items:center; gap:4px; background:#064e3b; color:#6ee7b7; padding:2px 8px; border-radius:4px; font-size:11px;">
            <span style="display:inline-block; width:8px; height:8px; border:2px solid #6ee7b7; border-top-color:transparent; border-radius:50%; animation: spin 1s linear infinite;"></span>
            处理中
          </span>
        </div>
        <div style="background:#334155; border-radius:4px; height:6px; overflow:hidden; margin-bottom:8px;">
          <div style="background:linear-gradient(90deg, #3b82f6, #60a5fa); height:100%; width:35%; border-radius:4px; transition: width 1s ease;"></div>
        </div>
        <div style="font-size:11px; color:#64748b; margin-bottom:6px;">进度 35%</div>
        <div style="font-size:11px; color:#94a3b8; line-height:1.5; padding:6px 8px; background:rgba(255,255,255,0.03); border-radius:4px;">
          <span style="color:#60a5fa;">最新进展</span><br>
          支行行长王总已介入，承诺24小时内给出初步方案
        </div>
      `);
    }

  }, 550);
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
 * 插入聊天气泡 (左侧对话流) - 带打字机流式效果
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
    <div class="bubble-text" style="flex:1; padding: 10px 14px; border-radius: 8px; font-size: 13px; line-height: 1.6; min-height: 40px; ${role === 'agent' ? 'background:#eff6ff; color:#1e3a8a;' : 'background:#f8fafc; color:#334155; border:1px solid #e2e8f0;'}"></div>
  `;
  bubbleObj.style.display = 'flex';
  bubbleObj.style.gap = '10px';
  bubbleObj.style.marginBottom = '15px';
  bubbleObj.style.animation = 'fadeInUp 0.35s ease forwards';
  if (role === 'customer') bubbleObj.style.flexDirection = 'row-reverse';

  chatWrapper.appendChild(bubbleObj);
  chatWrapper.scrollTop = chatWrapper.scrollHeight;

  const textNode = bubbleObj.querySelector('.bubble-text');
  let charIndex = 0;
  const typingSpeed = 50; // 50ms 每字，降低打字速度

  function typeWord() {
    if (charIndex < text.length) {
      textNode.innerHTML += text.charAt(charIndex);
      charIndex++;
      chatWrapper.scrollTop = chatWrapper.scrollHeight;
      setTimeout(typeWord, typingSpeed);
    }
  }

  // 启动打字效果
  typeWord();
}

/**
 * 一键发送产品资料功能
 */
function sendProductMaterial(btn) {
  if (btn.innerText === "✅ 已发送") return; // 防止重复点击

  btn.innerText = "✅ 已发送";
  btn.style.background = "#059669";
  btn.style.color = "#ffffff";
  btn.style.pointerEvents = "none";

  // 简单的 toast 提示
  const toast = document.createElement('div');
  toast.innerText = "✅ 已发送至李总微信：代扣一键恢复链接 + 奔富红酒专属礼遇单 + 高净值理财产品资料";
  toast.style.position = "absolute";
  toast.style.bottom = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "rgba(15, 23, 42, 0.85)";
  toast.style.color = "white";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "8px";
  toast.style.fontSize = "13px";
  toast.style.zIndex = "1000";
  toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  toast.style.animation = "fadeInUp 0.3s ease forwards";

  const rightPanel = document.querySelector('.call-right');
  if (rightPanel) {
    rightPanel.position = "relative"; // 确保 toast 在右侧面板底部
    rightPanel.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = "fadeInUp 0.3s ease reverse backwards";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
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
  } else if (type === 'info') {
    card.style.borderLeftColor = '#8b5cf6';
    card.style.boxShadow = '0 0 12px rgba(139, 92, 246, 0.15)';
  }

  const headerColor = type === 'warning' ? '#ef4444' : type === 'suggestion' ? '#60a5fa' : type === 'info' ? '#a78bfa' : '#34d399';

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
 * 生成图文报告并在内嵌 overlay 中展示
 */
function generateAndPrintReport(customer) {
  const graphSvg = renderOntologyGraph(customer.ontologyGraph);

  // 生成决策树 HTML
  let decisionTreeHtml = `
    <div class="section-title">四、 预设决策树 (Pre-loaded Strategy)</div>
    <div style="font-size:14px;color:#4b5563;margin-bottom:15px;">
      通话前 Agent 基于本体图谱预先计算并缓存的完整决策分支。此处展示用于实时通话辅助的策略树全貌。
    </div>
    <div style="background:#fafaf9;border:1px solid #e7e5e4;border-radius:8px;padding:20px;margin-bottom:30px;">
      ${renderCallDecisionTree(true)}
    </div>
  `;

  const reportContent = `
                    <div style="max-width:800px;width:100%;background:white;padding:50px;box-shadow:0 10px 25px rgba(0,0,0,0.05);border-top:6px solid #2563eb;border-radius:0 0 8px 8px;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#1f2937;line-height:1.6;">

                      <div style="border-bottom:2px solid #e5e7eb;padding-bottom:20px;margin-bottom:30px;display:flex;justify-content:space-between;align-items:flex-end;">
                        <div>
                          <h1 style="margin:0;font-size:24px;color:#111827;letter-spacing:-0.5px;">高净值客户智能预警分析报告</h1>
                          <div style="color:#6366f1;font-weight:600;margin-top:5px;font-size:14px;">Powered by AgentBuilder & Ontology</div>
                        </div>
                        <div style="font-size:14px;color:#6b7280;text-align:right;">
                          生成时间：${new Date().toLocaleString()}<br>
                            报告编号：RPT-${Math.floor(Math.random() * 1000000)}
                        </div>
                      </div>

                      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin-bottom:30px;display:flex;justify-content:space-between;align-items:center;">
                        <div>
                          <h2 style="margin:0 0 5px 0;color:#1e293b;font-size:20px;">${customer.name}</h2>
                          <p style="margin:0;color:#64748b;font-size:14px;">资产管理规模 (AUM): ${customer.aum} | 客户评级: 私人银行</p>
                        </div>
                        <div style="background:#fee2e2;color:#ef4444;padding:10px 20px;border-radius:6px;font-weight:bold;font-size:18px;border:1px solid #fecaca;">
                          流失风险: ${customer.riskScore} 分
                        </div>
                      </div>

                      <div class="section-title" style="font-size:18px;color:#1e293b;border-left:4px solid #3b82f6;padding-left:12px;margin:30px 0 15px 0;font-weight:600;">一、 核心异动感知</div>
                      <div style="font-size:14px;color:#4b5563;margin-bottom:20px;">
                        Agent 监控网络捕捉到客户近日发起 <span style="color:#2563eb;font-weight:600;">房贷提前还贷及定投计划取消</span>。此动作引发了高度预警信号：<strong>月均资金归集额从 ¥8.5万归零</strong>。
                      </div>

                      <div class="section-title" style="font-size:18px;color:#1e293b;border-left:4px solid #3b82f6;padding-left:12px;margin:30px 0 15px 0;font-weight:600;">二、 本体下钻追踪</div>
                      <div style="font-size:14px;color:#4b5563;">
                        为探明解绑原因，Agent 跨系统唤醒了客户本体网络资源，将交易流、网点服务流与客诉数据进行时空折叠：
                      </div>
                      <div style="background:#fafaf9;border:1px solid #e7e5e4;border-radius:8px;padding:20px;margin:15px 0 30px 0;display:flex;justify-content:center;">
                        <div style="width:100%;">${graphSvg}</div>
                      </div>

                      <div class="section-title" style="font-size:18px;color:#1e293b;border-left:4px solid #3b82f6;padding-left:12px;margin:30px 0 15px 0;font-weight:600;">三、 Agent 跨域线索整合与定性</div>
                      <ul style="list-style:none;padding:0;margin:0;">
                        <li style="display:flex;margin-bottom:20px;">
                          <div style="flex-shrink:0;width:36px;height:36px;background:#eff6ff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;margin-right:15px;">📍</div>
                          <div><h4 style="margin:0 0 5px 0;font-size:16px;color:#1f2937;">时空特征提取</h4><p style="margin:0;font-size:14px;color:#4b5563;">T-3 天在 [XX支行] 产生网点访问记录，业务停留耗时 <span style="color:#ef4444;font-weight:600;">145 分钟</span>，远超该行均值。</p></div>
                        </li>
                        <li style="display:flex;margin-bottom:20px;">
                          <div style="flex-shrink:0;width:36px;height:36px;background:#eff6ff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;margin-right:15px;">🗣️</div>
                          <div><h4 style="margin:0 0 5px 0;font-size:16px;color:#1f2937;">多模态情绪识别</h4><p style="margin:0;font-size:14px;color:#4b5563;">穿透 [XX支行] 客服语音及投诉文本，提取到高频 <span style="color:#ef4444;font-weight:600;">愤怒情绪</span> 标签，确认该工单当前 <strong>尚未妥善闭环</strong>。</p></div>
                        </li>
                        <li style="display:flex;margin-bottom:20px;">
                          <div style="flex-shrink:0;width:36px;height:36px;background:#eff6ff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;margin-right:15px;">🧠</div>
                          <div><h4 style="margin:0 0 5px 0;font-size:16px;color:#1f2937;">决策定性</h4><p style="margin:0;font-size:14px;color:#4b5563;">Agent 判断本次资金异动并非正常财务调整，而是 <span style="color:#ef4444;font-weight:600;">"服务体验恶化导致的报复性解绑"</span>，预计7天内流失率将达 99%。</p></div>
                        </li>
                      </ul>

                      ${decisionTreeHtml}

                      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-top:30px;">
                        <h4 style="margin:0 0 10px 0;color:#166534;font-size:16px;display:flex;align-items:center;gap:8px;">💡 智能闭环挽留策略</h4>
                        <div style="background:white;border:1px solid #dcfce3;padding:15px;border-radius:6px;color:#374151;font-style:italic;font-size:14px;margin-bottom:15px;">
                          "${customer.script}"
                        </div>
                        <p style="font-size:13px;color:#15803d;margin:0;">
                          <strong>策略归因：</strong>${customer.gift ? customer.gift.reason : ''}
                        </p>
                      </div>

                      <div class="section-title" style="font-size:18px;color:#1e293b;border-left:4px solid #3b82f6;padding-left:12px;margin:30px 0 15px 0;font-weight:600;">五、 后续行动时间线</div>
                      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin-bottom:30px;">
                        <div style="display:flex;gap:12px;margin-bottom:14px;align-items:flex-start;">
                          <div style="flex-shrink:0;width:28px;height:28px;background:#dbeafe;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:#2563eb;">1</div>
                          <div><strong style="color:#1e293b;">T+1 小时</strong><br><span style="font-size:13px;color:#4b5563;">发送代扣恢复链接 + 赠礼确认单至客户微信</span></div>
                        </div>
                        <div style="display:flex;gap:12px;margin-bottom:14px;align-items:flex-start;">
                          <div style="flex-shrink:0;width:28px;height:28px;background:#dbeafe;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:#2563eb;">2</div>
                          <div><strong style="color:#1e293b;">T+24 小时</strong><br><span style="font-size:13px;color:#4b5563;">跟进 XX 支行投诉工单 #8892 处理进展</span></div>
                        </div>
                        <div style="display:flex;gap:12px;margin-bottom:14px;align-items:flex-start;">
                          <div style="flex-shrink:0;width:28px;height:28px;background:#dbeafe;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:#2563eb;">3</div>
                          <div><strong style="color:#1e293b;">T+3 天</strong><br><span style="font-size:13px;color:#4b5563;">回访确认代扣恢复情况及客户满意度</span></div>
                        </div>
                        <div style="display:flex;gap:12px;align-items:flex-start;">
                          <div style="flex-shrink:0;width:28px;height:28px;background:#d1fae5;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:#059669;">4</div>
                          <div><strong style="color:#1e293b;">T+7 天</strong><br><span style="font-size:13px;color:#4b5563;">确认 AUM 未流失，关闭本次预警闭环</span></div>
                        </div>
                      </div>

                      <div style="margin-top:30px;padding-top:20px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af;line-height:1.6;">
                        <strong>数据合规声明：</strong>本报告所涉及的客户数据、客服录音调取及情绪分析结果，均经内部授权流程审批，符合《中华人民共和国个人信息保护法》及本行《客户信息管理办法》相关规定。报告仅限内部使用，严禁外传。
                      </div>

                    </div>
                    `;


  // 渲染到内嵌 overlay
  const reportOverlay = document.getElementById('reportOverlay');
  const reportBody = document.getElementById('reportBody');
  if (!reportOverlay || !reportBody) return;

  reportBody.innerHTML = reportContent;
  reportOverlay.style.display = 'flex';

  // 绑定关闭按钮
  document.getElementById('reportCloseBtn').onclick = () => {
    reportOverlay.style.display = 'none';
  };

  // 绑定下载按钮（打开新窗口打印报告内容）
  document.getElementById('reportDownloadBtn').onclick = () => {
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(`
                    <!DOCTYPE html>
                    <html lang="zh-CN">
                      <head>
                        <meta charset="UTF-8">
                          <title>流失预警分析报告 - ${customer.name}</title>
                          <style>
                            body {font - family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif; background: #f3f4f6; margin: 0; padding: 40px; }
                            @media print {body {background: white; padding: 0; } @page {margin: 1.5cm; } }
                          </style>
                      </head>
                      <body>${reportContent}</body>
                    </html>
                    `);
      printWin.document.close();
      setTimeout(() => printWin.print(), 300);
    }
  };
}

