# -*- coding: utf-8 -*-
"""
Rewrite the Mono template's homepage copy for STARGO WORK.

Layout, classes, markup and every GSAP/ScrollTrigger interaction are left
untouched: this script only substitutes text nodes.

Every substitution is asserted. A pattern that stops matching after a template
change must fail loudly here rather than silently leave English agency copy on
a Chinese enterprise page.
"""
import io, re, sys

P = 'index.html'
s = io.open(P, encoding='utf-8').read()
orig_len = len(s)
edits = 0


def sub(old, new, count=None, label=''):
    """Replace `old` everywhere. Assert it was actually there."""
    global s, edits
    n = s.count(old)
    if n == 0:
        sys.exit('MISS  no match for %r' % (label or old))
    if count is not None and n != count:
        sys.exit('COUNT %r: expected %d, found %d' % (label or old, count, n))
    s = s.replace(old, new)
    edits += n


def sub_nth(old, new, index, label=''):
    """Replace only the index-th (0-based) occurrence."""
    global s, edits
    parts = s.split(old)
    if len(parts) - 1 <= index:
        sys.exit('MISS  occurrence %d of %r' % (index, label or old))
    s = old.join(parts[:index + 1]) + new + old.join(parts[index + 1:])
    edits += 1


def sub_re(pattern, repl, count=None, label=''):
    global s, edits
    n = len(re.findall(pattern, s))
    if n == 0:
        sys.exit('MISS  regex %r' % (label or pattern))
    if count is not None and n != count:
        sys.exit('COUNT regex %r: expected %d, found %d' % (label or pattern, count, n))
    s = re.sub(pattern, repl, s)
    edits += n


# ---------------------------------------------------------------- long copy --
# Done first: these contain the brand mark and short words that later, broader
# rules also match, so they must be consumed before those run.

# Testimonials -> clauses from the STARGO governance documents.
# Customer quotes cannot be filled honestly: no approved customer proof exists
# in the repository, so any named person here would be fabricated. The section
# keeps its layout and carries constitution clauses, attributed to the document.
sub('&quot;Working with Mōno™ felt like having an internal team rather than an external agency. '
    'They were proactive, detail-oriented, and genuinely invested in the outcome.&quot;',
    '「对外产生真实后果的动作，必须先取得人类审批。'
    '审批通道不可用时，拒绝执行，而不是绕过。」', 1, 'testimonial-1')
sub('John Doe', 'STARGO 宪法')
sub('Head design at Circle®', '第 4 章 · 风险分级')

sub('“We didn’t just get a website — we got a solid digital foundation. '
    'Mōno™ is the kind of partner you want when building something meant to last.”',
    '「台账只追加，不可修改。已经发生的动作不能被事后抹平。」', 1, 'testimonial-2')
sub('Amantha Doe', 'STARGO 宪法')
sub('Founder of Radius®', '第 6 章 · 审计台账')

sub('“Their ability to listen, challenge assumptions, and translate ideas into a clean digital system.”',
    '「R4 动作结构性禁止自动执行，只能由人发起。」', 1, 'testimonial-3')
sub('Max Trump', 'STARGO 宪法')
sub('Founder of Light Studio®', '第 4 章 · 风险分级')

sub('“What stood out with Mōno™ was the balance between design quality and technical execution. '
    'Everything was thoughtful, scalable, and built with term use in mind.”',
    '「没有回读证据，动作不计为成功。」', 1, 'testimonial-4')
sub('Camila Verga', '受治理编排器')
sub('Head design at LogoIspum®', '回读校验契约')

sub('&quot;Mōno™ helped us simplify complexity. They streamlined our product narrative, improved performance, '
    'and delivered a digital experience that truly reflects our brand. The results were immediate — higher engagement.&quot;',
    '「仓库中没有任何已批准的客户标识、评价或指标。'
    '任何社会证明都会是伪造的，所以这里展示的是可复现的部署事实。」', 1, 'testimonial-5')
sub('Elena Rossi', '网站宪章')
sub('Marketing Director at Auralis®', '禁止伪造社会证明')

# Stats -> the four registry figures, each with the command that reproduces it.
sub('Mōno™ stands behind the data.', '每个数字都能被重新推导出来。')
sub('Our success is reflected in the numbers we achieve for our clients. '
    'Every project is designed with measurable growth at its core.',
    '下面四个数字全部来自 STARGO 注册表，各自附带重新推导它的命令。'
    '它们说明的是「登记了什么」，不是「什么现在能跑」。')

sub('(Value created)', '(注册在案的能力)')
sub('$174M', '202')
sub('Empowering growth through strategic solutions.', '其中 26 项当前处于关闭状态。')
sub('CRI: 5.1% → 6.7%', "jq '[.providers[].capabilities[]] | length'")
sub('“We didn’t expect smoother onboarding and a noticeable lift in qualified leads.”',
    '「登记不等于可用。」')
sub('Daniel Kim', 'capabilities.json')

sub('(Return client rate)', '(已接入的能力提供方)')
sub('92%', '25')
sub('Building lasting partnerships built on trust.', '其中 6 个提供方的能力当前全部关闭。')
sub('CRI: 2.9% → 4.4%', "jq '.providers | length'")
sub('“Everything feels faster, clearer, and more premium. We shipped the redesign and conversions followed immediately.”',
    '「接入不等于开启。」')
sub('Olivia Carter', 'capabilities.json')

sub('(Projects delivered)', '(强制人工审批的动作)')
sub('+320', '30')
sub('Driving successful outcomes across industries.', '这些动作不会在无人审批时执行。')
sub('CRI: 1.7% → 2.6%', "jq 'select(.approvalRequired==true) | length'")
sub('“The new site finally matches our product. Cleaner UX, better messaging, and results we can actually measure.”',
    '「审批通道不可用即拒绝。」')
sub('Marcus Reed', 'capabilities.json')

sub('(Client retention)', '(已登记的业务闭环)')
sub('88%', '6')
sub('Optimized journeys that turn traffic into growth.', '已登记并可达，但审批闸门之后的步骤不自动执行。')
sub('CRI: 3.8% → 5.6%', "jq '(.workflows // .) | length'")
sub('“The redesign removed friction everywhere. It’s simple, sharp, and performs better across every device.”',
    '「可达不等于已执行。」')
sub('Sofia Martinez', 'workflows.json')

# FAQ
sub('What services does your agency offer?', 'STARGO WORK 到底是什么？')
sub('We specialize in branding, website design and development, social media marketing, paid ads, SEO, and content strategy',
    '一套受治理的企业 AI 工作系统。它连接企业知识、客户、产品、软件与人员，'
    '由 14 位岗位型数字员工承担从市场洞察到售后的工作。关键动作经过权限与人工审批')
sub('How do you determine the right strategy?', '数字员工会自己发邮件、自己下单吗？')
sub('Every project starts with a discovery phase where we analyze your goals, audience, and competitors. '
    'Based on this, we craft a custom strategy that aligns with your objectives and maximizes your digital',
    '不会。对外产生真实后果的动作是 R2 或 R3，必须先取得成对的人工审批事件才能执行。'
    '审批通道不可用时，系统拒绝执行，而不是绕过')
sub('How long does a typical project take?', '「202 项能力」是指 202 个现在能用的功能吗？')
sub('Project timelines vary depending on scope. A branding or website project typically takes 4–8 weeks, '
    'while marketing campaigns are ongoing with monthly optimization and reporting',
    '不是。202 是注册表里登记的能力条目数，其中 26 项当前处于关闭状态。'
    '登记不等于可用，可达也不等于已执行——审批闸门之后的步骤不会自动运行')
sub('Do you work with businesses in any industry?', '有客户案例吗？')
sub('Yes! We’ve worked with startups, tech companies, e-commerce brands, real estate firms, and service providers. '
    'Our process is adaptable to fit the needs of different industries and audiences',
    '目前没有可公开的客户标识、评价或指标。在取得授权之前，'
    '这里展示的是可复现的部署事实：每个数字都附带重新推导它的命令')

# Hero support paragraph
sub('No cookie cutter sites. No empty claims. Only practical tools and smart strategies that drive growth and build brands.',
    '不是另一个聊天框。关键动作按风险分级，越过红线停下来等人批，'
    '每一步可见、可追踪、可回读。')

# Who-we-are
sub('We shape brands with focus, intention, and impact.',
    '14 位岗位型数字员工，其中 9 位有注册表角色记录支撑。')

# Service descriptions. (001) and (003) ship the SAME sentence in the template,
# so they must be replaced by position, not globally.
DESC = 'Modern, responsive, and user-friendly websites designed to engage visitors and drive conversions.'
sub_nth(DESC, '读取公开市场与买家信号，输出可比对的结构化洞察，而不是一段无法追溯的总结。', 0, 'svc-001-desc')
# After the call above, the surviving occurrence is index 0 again.
sub_nth(DESC, '把自由文本询盘拆成数量、贸易条款、目的港、认证与交期，写入内部记录并回读校验。', 0, 'svc-003-desc')

sub('We create scroll-stopping social content designed to build brand presence and drive engagement.',
    '在合规边界内识别并触达潜在买家，对外动作一律停在人工审批之前。')
sub('We craft cohesive brand identities that communicate purpose, personality, and credibility.',
    '报价、形式发票、订单、单证与物流节点在同一条记录上流转，越过毛利红线必须人工审批。')
sub('We develop strategic marketing assets that amplify brand reach and support growth.',
    '内容生产与售后跟进由岗位角色承担，产出与动作同样进入台账。')

# Pricing -> engagement stages. No figure may be shown: the public pricing
# policy is not approved (PUBLIC_PRICING_ENABLED is off).
sub('Choose the plan that fits you best.', '定价政策尚未公开。下面是每个阶段实际做什么。')
sub('Starter', '企业 AI 诊断')
sub('Built for early-stage teams establishing their online presence.',
    '梳理现有流程，标出哪些动作可以自动化、哪些必须停在人工审批。')
sub('$2,000', '未公开')
sub('Tailored website layouts', '现有询盘与报价流程梳理')
sub('Core SEO configuration', '动作风险分级 R0–R4')
sub('Mobile-first responsive design', '审批闸门位置确认')
sub('Brand-ready UI framework', '可自动化范围评估')
sub('Ideal for new launches and rebrands', '输出一份可执行的范围清单')
sub('Growth', '受控试点')
sub('Designed for businesses ready to elevate their digital experience.',
    '在受控范围内接入一条业务闭环，审批闸门全部开启，全过程留证。')
sub('$4,000', '未公开')
sub('High-end design with smooth interactions', '接入一条已登记业务闭环')
sub('Complete on-site SEO setup', '人工审批闸门全程开启')
sub('Adaptive layouts for every screen', '动作与审批事件成对入账')
sub('CMS setup for content or case studies', '回读校验，无证据不计成功')
sub('Performance tuning &amp; optimization', '能力开关由你控制')
sub('1-2 weeks', '待评估')
sub('2-3 weeks', '待评估')

# Feature cards
sub('Pricing with', '台账只追加')
sub('complete transparency', '不可篡改')
sub('(Performance Boost)', '(风险分级)')
sub('Page speed +78%,', 'R0–R4 五级，')
sub('Bounce rate -13%', 'R2 以上必须人工审批')
sub('View pricing', '查看治理模型')

# Live-collaboration chat mock -> an approval exchange
sub('(Live collaboration)', '(人工审批)')
sub('Today 17:01', '今天 17:01')
sub('Today 17:02', '今天 17:02')
sub('Hey hey!', 'WF02 · 第 8 步')
sub('Love the design', '写入 CRM 需要审批')
sub('Can we tweak the hero?', '买方已通过制裁清单筛查')
sub('Sure', '已批准')
sub('We’ll update it shortly', '审批事件已成对入账')
sub('Perfect! Thank you.', '回读校验通过。')

# Pinned word-swap. Each line is a governance property the product repository
# proves with an executable test.
sub('Built Different', '不是聊天框')
sub('Design with purpose', '动作按风险分级')
sub('Code with passion', '审批不可绕过')
sub('Create with vision', '台账只追加')
sub('Innovate always', '回读才算完成')

# Work / portfolio -> the four governance properties backed by executable
# tests. The six registered loops would be the natural fit for this section,
# but only WF02's name is known inside this repository; inventing the other
# five is exactly the failure this project guards against.
sub('(Portfolio 26©)', '(可验证的治理属性)')
sub('View all work', '查看治理与安全')
sub('Forma Digital', '审批不可绕过')
sub('One Step', '台账只追加')
sub('Nero Vision', '禁止自动执行')
sub('Bold Moves', '回读校验')

# Blog -> explainers that point at pages which already exist. The date slot
# becomes a section label: inventing publication dates for articles that do
# not exist would be its own small lie.
sub('Smart insights.', '把话说清楚。')
sub('See all', '查看全部')
sub('November 11, 2025', '能力全景')
sub('The power of simplicity in modern real brand design', '为什么没有任何一项能力标为「已上线」')
sub('October 1, 2025', '治理与安全')
sub('From idea to execution: building products that last', '问不到人的时候，系统拒绝执行')
sub('October 3, 2026', '产品演示')
sub('Why great brands are built on clarity, not complexity', '十步闭环里，三步永远停在人工审批')
sub('October 4, 2025', '集成')
sub('Designing digital systems that scale your business', '25 个提供方，其中 6 个能力全部关闭')

# Closing / newsletter / contact
sub('Crafting visuals. Shaping stories.', '把 AI 装进真实业务流程。')
sub('Let’s create great work together!', '从一次企业 AI 诊断开始。')
sub('Let’s Collaborate', '预约诊断')
sub('Be the first to know what’s new.', '产品进展第一时间通知你。')
sub('No noise. Just curated updates.', '不发广告，只发产品与治理更新。')
sub('Thank you for subscribing!', '订阅成功。')
sub('Thank you! Your submission has been received!', '已收到，我们会尽快联系你。')
sub('Oops! Something went wrong while submitting the form.', '提交失败，请稍后重试。')
sub('By contacting us, you accept our', '提交即表示你接受我们的')

# Contact details. The legal entity, address, phone and mailbox are still
# undecided by the owner, so they are marked pending rather than invented.
sub('(New Projects / Business)', '(商务合作)')
sub('(General Inquiries)', '(一般咨询)')
sub('contact@monostudio.io', '（正式邮箱待定）')
sub('info@monostudio.io', '（正式邮箱待定）')
sub('(+1) 930 046 720', '（联系电话待定）')
sub('Roc Boronat 112, Floor 3 - Door 2 (08018) Barcelona, Spain', '（法律主体与办公地址待确认）')

# ------------------------------------------------------- positional: Studio --
# The template uses the same word for the nav item and for the giant hero
# display word. They stop being the same thing once the brand changes.
sub_re(r'(class="(?:top-text logo[^"]*|h1)">)Studio(<)', r'\g<1>WORK\g<2>', None, 'Studio->WORK (logo/hero)')
sub_re(r'(class="button-text">)Studio(<)', r'\g<1>治理与安全\g<2>', None, 'Studio->nav button')
sub_re(r'(class="navigation-text-main[^"]*">)Studio(<)', r'\g<1>治理与安全\g<2>', None, 'Studio->nav main')

# ------------------------------------------------------------ short/global --
sub('Talk to Denis', '预约企业 AI 诊断')      # a real person's name
sub('Schedule a call', '预约诊断')
sub('Get in touch', '联系我们')
sub('Get started', '查看能力全景')
sub('Book a call', '预约诊断')
sub('(Contact us)', '(联系我们)')   # before the bare string below
sub('Contact us', '联系我们')
sub('Let&#x27;s talk.', '预约诊断。')
sub('Let&#x27;s talk', '预约诊断')
sub('Get Template', '预约诊断')
sub('Scroll Down', '向下滚动')
sub('View Work', '查看治理属性')
sub('Read more', '查看详情')
sub('Privacy Policy', '隐私政策')
sub('Terms of use', '使用条款')
sub('Licensing', '第三方声明')

sub('(Partners)', '(受治理的企业 AI 工作系统)')
sub('2011-26©', '7.0©')
sub('(Who we are)', '(数字员工)')
sub('(Team of experts)', '(有注册表角色支撑)')
sub('(Our Vision)', '(治理模型)')
sub('(Scroll for more)', '(继续滚动)')
sub('(Services)', '(能力域)')
sub('(Pricing)', '(合作方式)')
sub('(FAQ)', '(常见问题)')
sub('(Looking for more?)', '(还有疑问？)')
sub('Expand your scope with marketing, SEO, or content creation.',
    '能力全景、治理模型与产品演示都可以直接查看。')
sub('(Testimonials)', '(治理原则)')
sub('(Success stories)', '(为什么这里没有客户评价)')
sub('(Stats)', '(注册表事实)')
sub('(Blog)', '(说明)')
sub('(Newsletter)', '(订阅更新)')
sub('(Location)', '(地址)')
sub('(Social)', '(社交)')
sub('(Pages)', '(页面)')
sub('(Project)', '(阶段一)')
sub('What&#x27;s included:', '包含：')
sub('Timeline:', '周期：')

sub('Pick Smart.', '先诊断。')
sub('Pay Less.', '再试点。')
sub('Build Better.', '后部署。')

# Capability domains. The hero list and the services list share these labels,
# so a single substitution keeps the two in step - which is what we want.
sub('Web Design', '市场洞察')
sub('Social Media', '主动获客')
sub('Development', '询盘与报价')
sub('Brand Identity', '外贸单证与履约')
sub('Marketing', '内容生产与售后')
sub('SEO Optimization', '治理与台账')

sub('Showreel 26©', '产品剧场 2026©')

# Team figures: 14 personas, 9 of them with a real registry role behind them.
sub('+13', '14')
sub('team members', '岗位型数字员工')
sub('across the', '覆盖')
sub('>World<', '>询盘到履约<')
sub('+9', '9')

# Nav + page names
sub('Work (4)', '治理属性 (4)')
sub('>Work<', '>治理属性<')
sub('>work<', '>治理属性<')
sub('>Home<', '>首页<')
sub('>News<', '>说明<')
sub('>Contact<', '>联系<')
sub('Page Layouts', '页面')
sub('Work III', '治理属性 III')
sub('Work II', '治理属性 II')
sub('Work I', '治理属性 I')
sub('Blog III', '说明 III')
sub('Blog II', '说明 II')
sub('Blog I', '说明 I')
sub('Contact III', '联系 III')
sub('Contact II', '联系 II')
sub('Contact I', '联系 I')
sub('(Home)', '(首页)')
sub('(Studio)', '(治理)')
sub('(Work 1)', '(治理属性 1)')
sub('(Work 2)', '(治理属性 2)')
sub('(Work 3)', '(治理属性 3)')
sub('(Work Page)', '(治理属性详情)')
sub('(Blog 1)', '(说明 1)')
sub('(Blog 2)', '(说明 2)')
sub('(Blog 3)', '(说明 3)')
sub('(Blog Page)', '(说明详情)')
sub('(Contact 1)', '(联系 1)')
sub('(Contact 2)', '(联系 2)')
sub('(Contact 3)', '(联系 3)')

# The inline legal line: "... you accept our Terms and Privacy Policy".
# NOTE: both links are href="#" - the documents do not exist yet.
sub('>Terms</a> and <', '>使用条款</a> 与 <')

# ---------------------------------------------------------------- <head> --
# What search results and social cards actually show. The template's own
# description survived the brand substitution and would otherwise ship as the
# site's public summary.
TITLE = 'STARGO WORK 7.0 — 受治理的企业 AI 工作系统'
DESC_META = ('STARGO WORK 7.0 连接企业知识、客户、产品、软件与人员，由 14 位岗位型数字员工'
             '承担从市场洞察到售后的工作。关键动作经过权限与人工审批，每一步可见、可追踪、可回读。')
TPL_DESC = ('Mōno™ is a minimalist Template designed to present your work with precision, '
            'balance, and subtle, gentle animations.')
sub('<title>Mōno™</title>', '<title>' + TITLE + '</title>')
sub(TPL_DESC, DESC_META, 3, 'meta descriptions')
sub('content="Mōno™" property="og:title"', 'content="' + TITLE + '" property="og:title"')
sub('content="Mōno™" name="twitter:title"', 'content="' + TITLE + '" name="twitter:title"')

# Brand, last: the earlier rules consumed the occurrences inside quoted copy.
sub('© 2026 Mōno™ Studio', '© 2026 STARGO WORK')
sub('Mōno™', 'STARGO')

io.open(P, 'w', encoding='utf-8', newline='\n').write(s)
print('OK  %d text substitutions, %d -> %d bytes' % (edits, orig_len, len(s)))
