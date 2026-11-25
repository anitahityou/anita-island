const english=new URLSearchParams(location.search).get('lang')==='en';
document.documentElement.lang=english?'en':'zh-CN';
const languageButton=document.createElement('button');
languageButton.className='music-button';languageButton.textContent=english?'中文':'EN';
languageButton.onclick=()=>{const url=new URL(location.href);url.searchParams.set('lang',english?'zh':'en');location.href=url;};
document.querySelector('header').append(languageButton);
const translations=new Map([
['可旋转的 3D 简历海岛','Interactive 3D portfolio island'],['简历目录','Portfolio navigation'],['拖动环绕 · 滚轮缩放','Drag to orbit · Scroll to zoom'],['作品','Works'],['经历','Experience'],['社交媒体','Social'],['照片','Photos'],
['开始探索','Explore'],['← 返回海岛','← Back to island'],['← 上一展区','← Previous'],['下一展区 →','Next →'],
['关闭','Close'],['重置视角','Reset view'],['打开链接 ↗','Open link ↗'],['查看 GitHub 项目 ↗','View on GitHub ↗'],
['作品馆','Project studio'],['经历档案馆','Career archive'],['社交会客厅','Social lounge'],['照片画廊','Photo gallery'],
['点击家具探索','Select an object'],['海岛坐标','Island coordinates'],
['Hi，我是 Anita。','Hi, I’m Anita.'],['从电影制片到硅谷 AI，欢迎探索我的小岛。','From film production to Silicon Valley AI. Welcome to my island.'],
['✧ 拖动环绕 · 滚轮缩放','✧ Drag to orbit · Scroll to zoom'],
['♫ 开启海岛音乐','♫ Play island music'],['♫ 音乐播放中 · 关闭','♫ Music on · Stop'],['♫ 点击重试音乐','♫ Retry music'],
['X · 聊天沙发','X · Conversation sofa'],['LinkedIn · 书桌名片','LinkedIn · Business desk'],['TikTok · 床边电视','TikTok · Bedside TV'],
['观测仪 · GEO Lens','Observatory · GEO Lens'],['唱片台 · AirMixer','Turntable · AirMixer'],['判官桌 · 恋爱判官','Judge’s desk · Love Tribunal'],['玻璃装置 · Breath Glass','Glass · Breath Glass'],['创业书桌 · FounderOS','Founder desk · FounderOS']
]);
if(english){
 const titles=['Silicon Valley AI · APAC Lead','Binance','Film Producer','Content Creator · 600K Followers','Magazine Column Editor','SIFF Short Film Juror','CMO · Web3 Social Project','NTU Singapore · MMC Master’s'];
 const descriptions=['Currently leading APAC for a Silicon Valley AI company.','Previously worked at Binance.','Previously worked as a film producer.','Previously a content creator with 600,000 followers across platforms.','Previously worked as a magazine column editor.','Previously served as a short film juror at SIFF.','Previously served as CMO of a Web3 social project.','Graduated from Nanyang Technological University, Singapore, with an MMC master’s degree.'];
 profile[1].items.forEach((item,i)=>{item.title=titles[i];item.text=descriptions[i];item.label=i===0?'CURRENT · AI':i===7?'EDUCATION':'PREVIOUS EXPERIENCE';});
 profile.forEach((section,i)=>{section.name=['Works','Experience','Social','Photos'][i];section.intro=['Explore five projects inside the studio.','From filmmaking to AI, exploring new possibilities.','Find me online and say hello.','Conversations and encounters across AI and blockchain.'][i];});
 profile[2].items[2].text='Currently links to X · @Anitahityou';
 const photos=['CAS China–US Private AI Dinner','WTCC Closed-door AI Hardware Discussion','With Binance Co-founder CZ','AI & Blockchain on the Bund · On Stage','AI & Blockchain on the Bund · Panel','OPEN AGI BUILDER DAY · Co-hosted with Zhipu · On Stage','OPEN AGI BUILDER DAY · Co-hosted with Zhipu · Panel','INCLUSION · Conference on the Bund','OPEN AGI BUILDER DAY · MiraclePlus × Stepfun · On Stage','OPEN AGI BUILDER DAY · MiraclePlus × Stepfun · Panel','AI Event Co-hosted with Fudan University'];
 profile[3].items.forEach((item,i)=>{item.title=photos[i];item.text=photos[i];item.label='EVENT DIARY · '+String(i+1).padStart(2,'0');});
 const intros=['Website GEO health checks with evidence-based reports.','A camera-based musical instrument played with hand gestures.','A playful tool for reflecting on relationship conflicts.','Simulate fog with facial gestures and wipe it away with your hands.','Tools for founder positioning, content planning and pitch practice.'];
 const details=['Scans public websites using 33 rules across six dimensions. Includes evidence, improvement suggestions and PDF / JSON export.','Trigger chords with taps, waves and two-handed gestures, with a chill synthesizer backing and glass-like ripples. Audio and camera processing happen locally.','Organize facts, feelings and needs from both perspectives to generate a playful relationship review and repair suggestions.','Uses mouth landmarks to simulate fog and hand tracking to wipe the glass. Includes sensitivity settings and mouse / touch simulation.','Includes a founder-type quiz, personal positioning, content planning and investor Q&A practice. The product interface is branded FounderOS.'];
 projects.forEach((project,i)=>{if(i===2)project.name='Love Tribunal';project.intro=intros[i];project.items[0].title=project.name;project.items[0].label=project.en;project.items[0].text=details[i];project.items[0].linkLabel='View on GitHub ↗';});
 profile[0].items.forEach((item,i)=>{item.title=projects[i].name;item.text=intros[i];});
 const translate=()=>{
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){const node=walker.currentNode;if(['SCRIPT','STYLE'].includes(node.parentElement.tagName))continue;let text=node.nodeValue;for(const [zh,en] of [...translations].sort((a,b)=>b[0].length-a[0].length))text=text.split(zh).join(en);if(text!==node.nodeValue)node.nodeValue=text;}
  for(const node of document.querySelectorAll('[aria-label]')){const value=node.getAttribute('aria-label');if(translations.has(value))node.setAttribute('aria-label',translations.get(value));}
 };
 const observer=new MutationObserver(()=>{observer.disconnect();translate();observer.observe(document.body,{childList:true,subtree:true,characterData:true});});
 translate();observer.observe(document.body,{childList:true,subtree:true,characterData:true});
}
