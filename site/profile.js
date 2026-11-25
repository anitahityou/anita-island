// 将示例条目替换为你的真实资料。照片条目可添加 image 路径，作品和社交条目可添加 url。
const profile = [
  {"name": "作品", "en": "SELECTED WORK", "icon": "▧", "color": "#f1aa79", "intro": "走进作品馆，点击五件展品，探索我的作品。", "items": [{"title": "GEO Lens", "label": "WEBSITE HEALTH", "text": "网站 GEO 基础健康度检测工具。", "project": 0}, {"title": "AirMixer", "label": "GESTURE MUSIC", "text": "用双手演奏的摄像头音乐台。", "project": 1}, {"title": "恋爱判官", "label": "LOVE TRIBUNAL", "text": "像素风狗狗陪你复盘情侣沟通。", "project": 2}, {"title": "Breath Glass", "label": "INTERACTIVE GLASS", "text": "对着镜头吹气，再用手势擦去雾气。", "project": 3}, {"title": "FounderOS", "label": "FOUNDER MASTER", "text": "围绕创始人表达、个人定位和融资练习的工具。", "project": 4}]},
  {name:'经历', en:'EXPERIENCE', icon:'⚑', color:'#f5cb7a', intro:'从电影制片到 AI，在不同领域探索新的可能。', items:[
    {title:'硅谷 AI · 亚太区负责人', label:'现在 · AI', text:'转行进入 AI 领域，目前担任硅谷 AI 亚太区负责人。'},
    {title:'Binance', label:'过往经历 · WEB3', text:'曾在 Binance 工作。'},
    {title:'电影制片人', label:'过往经历 · FILM', text:'曾担任电影制片人。'},
    {title:'全网 60 万粉丝自媒体博主', label:'过往经历 · CONTENT', text:'曾担任全网 60 万粉丝的自媒体博主。'},
    {title:'杂志专栏编辑', label:'过往经历 · EDITORIAL', text:'曾担任杂志专栏编辑。'},
    {title:'SIFF 电影节短片评审', label:'过往经历 · FILM JURY', text:'曾担任 SIFF 电影节短片评审。'},
    {title:'Web3 社交项目 CMO', label:'过往经历 · WEB3', text:'曾担任 Web3 社交项目 CMO。'},
    {title:'NTU · 新加坡南洋理工大学', label:'教育背景 · MMC 硕士', text:'毕业于新加坡南洋理工大学（Nanyang Technological University），获 MMC 硕士学位。'}]},
  {name:'社交媒体', en:'FIND ME', icon:'⌁', color:'#a9ceb5', intro:'如果你也喜欢这些事，欢迎来打声招呼。', items:[
    {title:'X', label:'SOCIAL · 01', text:'@Anitahityou', url:'https://x.com/Anitahityou'},
    {title:'LinkedIn', label:'SOCIAL · 02', text:'Jiani Qu', url:'https://www.linkedin.com/in/jiani-qu-424485219/'},
    {title:'TikTok', label:'SOCIAL · 03', text:'当前链接跳转至 X · @Anitahityou', url:'https://x.com/Anitahityou'}]},
  {"name": "照片", "en": "PHOTO DIARY", "icon": "▣", "color": "#bed0ed", "intro": "在 AI 与区块链的交流现场，记录相遇与对话。", "items": [{"title": "CAS 中美 AI 私人晚宴", "label": "活动记录 · 01", "text": "参与CAS 中美 AI 私人晚宴。", "image": "photos/cas-ai-dinner.png", "aspect": 0.67578125}, {"title": "WTCC AI 硬件闭门讨论会", "label": "活动记录 · 02", "text": "参与WTCC AI 硬件闭门讨论会。", "image": "photos/wtcc-ai-hardware.png", "aspect": 0.6176948051948052}, {"title": "与 Binance 联合创始人 CZ 合影", "label": "活动记录 · 03", "text": "与 Binance 联合创始人 CZ 合影。", "image": "photos/binance-cz.png", "aspect": 0.7566666666666667}, {"title": "外滩 AI 与区块链讨论会 · 现场", "label": "活动记录 · 04", "text": "参与外滩 AI 与区块链讨论会 · 现场。", "image": "photos/bund-ai-panel.png", "aspect": 1.5232558139534884}, {"title": "外滩 AI 与区块链讨论会 · 圆桌", "label": "活动记录 · 05", "text": "参与外滩 AI 与区块链讨论会 · 圆桌。", "image": "photos/bund-ai-discussion.png", "aspect": 1.7929984779299848}, {"title": "OPEN AGI BUILDER DAY · 智谱合办 · 现场", "label": "活动记录 · 06", "text": "与智谱合办 OPEN AGI BUILDER DAY。", "image": "photos/zhipu-builder-stage.png", "aspect": 1.5533596837944663}, {"title": "OPEN AGI BUILDER DAY · 智谱合办 · 圆桌", "label": "活动记录 · 07", "text": "与智谱合办 OPEN AGI BUILDER DAY，圆桌交流现场。", "image": "photos/zhipu-builder-panel.png", "aspect": 1.5278858625162126}, {"title": "参与外滩大会", "label": "活动记录 · 08", "text": "参与外滩大会（INCLUSION · Conference on the Bund）。", "image": "photos/inclusion-bund.png", "aspect": 0.708984375}, {"title": "OPEN AGI BUILDER DAY · 奇绩创坛 × Stepfun · 现场", "label": "活动记录 · 09", "text": "与奇绩创坛、Stepfun 一起合办 OPEN AGI BUILDER DAY。", "image": "photos/miracle-stepfun-speaker.png", "aspect": 0.681640625}, {"title": "OPEN AGI BUILDER DAY · 奇绩创坛 × Stepfun · 圆桌", "label": "活动记录 · 10", "text": "与奇绩创坛、Stepfun 一起合办 OPEN AGI BUILDER DAY，圆桌交流现场。", "image": "photos/miracle-stepfun-panel.png", "aspect": 1.4628571428571429}, {"title": "与复旦大学合办 AI 活动", "label": "活动记录 · 11", "text": "与复旦大学一起合办 AI 活动。", "image": "photos/fudan-ai.png", "aspect": 0.7494145199063232}]}
];

const projects = [
  {
    "name": "GEO Lens",
    "en": "WEBSITE HEALTH",
    "icon": "◉",
    "color": "#a9c9e5",
    "intro": "网站 GEO 基础健康度检测工具。",
    "items": [
      {
        "title": "6 个维度 · 33 条规则",
        "label": "网站检测",
        "text": "扫描公开网站，提供六维评分、逐项证据和优化建议，支持 PDF 与 JSON 导出。",
        "url": "https://github.com/anitahityou/geo-lens",
        "linkLabel": "查看 GitHub 项目 ↗"
      }
    ]
  },
  {
    "name": "AirMixer",
    "en": "GESTURE MUSIC",
    "icon": "♫",
    "color": "#beacf0",
    "intro": "用双手演奏的摄像头音乐台。",
    "items": [
      {
        "title": "手势、和弦与液态玻璃",
        "label": "互动音乐",
        "text": "通过指尖点按、挥手和双手动作触发和弦，搭配 88 BPM Chill 合成伴奏与实时玻璃水纹。声音本地合成，摄像头画面在本机处理。",
        "url": "https://github.com/anitahityou/airmixer",
        "linkLabel": "查看 GitHub 项目 ↗"
      }
    ]
  },
  {
    "name": "恋爱判官",
    "en": "LOVE TRIBUNAL",
    "icon": "♡",
    "color": "#efa6ba",
    "intro": "像素风狗狗陪你复盘情侣沟通。",
    "items": [
      {
        "title": "Love Tribunal",
        "label": "沟通复盘 · 娱乐工具",
        "text": "整理双方的事实、感受和需求，生成包含责任倾向与修复建议的恋爱判决书。支持聊天截图本地预览与文字识别尝试。",
        "url": "https://github.com/anitahityou/love-tribunal",
        "linkLabel": "查看 GitHub 项目 ↗"
      }
    ]
  },
  {
    "name": "Breath Glass",
    "en": "INTERACTIVE GLASS",
    "icon": "◇",
    "color": "#9eddd7",
    "intro": "对着镜头吹气，再用手势擦去雾气。",
    "items": [
      {
        "title": "息 · Breath Glass",
        "label": "摄像头交互 DEMO",
        "text": "根据嘴部动作模拟玻璃起雾，追踪食指或手掌擦拭。支持灵敏度调节，以及无摄像头时的模拟吹气与鼠标、触屏交互。",
        "url": "https://github.com/anitahityou/breath-glass",
        "linkLabel": "查看 GitHub 项目 ↗"
      }
    ]
  },
  {
    "name": "FounderOS",
    "en": "FOUNDER MASTER",
    "icon": "⚑",
    "color": "#f3cb84",
    "intro": "围绕创始人表达、个人定位和融资练习的工具。",
    "items": [
      {
        "title": "Founder Master",
        "label": "创始人工具",
        "text": "包含 Founder 类型测试、个人定位、内容规划和融资问答模拟。仓库中的产品界面使用 FounderOS 名称。",
        "url": "https://github.com/anitahityou/founder-master",
        "linkLabel": "查看 GitHub 项目 ↗"
      }
    ]
  }
];
