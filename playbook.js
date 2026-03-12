/* =============================================
   AI Receptionist Playbook — Interactive Logic
   25 Home Service Industry Scripts
   ============================================= */

(() => {
  'use strict';

  /* ── Variable State ──────────────────────────── */
  const vars = {
    agentName:    '',
    businessName: '',
    ownerName:    '',
    cityArea:     '',
    openHour:     '',
    closeHour:    ''
  };

  let activeIndustry = null;

  /* ── Industry Data ───────────────────────────── */
  const INDUSTRIES = [
    {
      id: 'plumbing',
      name: 'Plumbing',
      icon: '🔧',
      tagline: 'From clogged drains to full pipe replacements',
      examples: 'drain cleaning, water heater installs, leak detection, and sewer line inspections',
      priceRange: '$85–$300 for most service calls',
      serviceQ: 'What type of plumbing issue brings you our way today? Are we dealing with a clogged drain, a leak, water heater trouble, a running toilet — or something else entirely? We handle everything from [EXAMPLES] right here in [CITY].'
    },
    {
      id: 'hvac',
      name: 'HVAC',
      icon: '❄️',
      tagline: 'Heating, cooling & air quality solutions',
      examples: 'AC repairs, furnace tune-ups, duct cleaning, and full system replacements',
      priceRange: '$75–$150 for service calls, $3,000–$12,000 for system replacements',
      serviceQ: 'What\'s going on with your heating or cooling today? Is the system not keeping up, making strange noises, or are you thinking about a full upgrade? We cover [EXAMPLES] in [CITY].'
    },
    {
      id: 'electrical',
      name: 'Electrical',
      icon: '⚡',
      tagline: 'Panel upgrades, outlets & EV charger installs',
      examples: 'panel upgrades, outlet installations, ceiling fan installs, and EV charger setups',
      priceRange: '$75–$150 for service calls, $1,500–$5,000 for panel upgrades',
      serviceQ: 'What kind of electrical work do you need today? Are we looking at a tripped breaker, new outlets or fixtures, a panel upgrade, or maybe an EV charger? We handle [EXAMPLES] throughout [CITY].'
    },
    {
      id: 'roofing',
      name: 'Roofing',
      icon: '🏠',
      tagline: 'Repairs, replacements & storm damage assessment',
      examples: 'roof repairs, full replacements, inspections, gutter installations, and storm damage assessments',
      priceRange: '$150–$500 for repairs, $5,000–$25,000+ for full replacements',
      serviceQ: 'What\'s going on with the roof? Are you seeing a leak, missing shingles, storm damage — or are you looking to get a full inspection or replacement quote? We do [EXAMPLES] all across [CITY].'
    },
    {
      id: 'landscaping',
      name: 'Landscaping',
      icon: '🌿',
      tagline: 'Lawn care, garden design & irrigation',
      examples: 'lawn mowing, fertilization, irrigation installs, landscape design, and seasonal cleanups',
      priceRange: '$40–$80 per mow, $500–$5,000+ for design projects',
      serviceQ: 'What kind of landscaping or lawn care are you looking for today? Is it regular maintenance, a full garden design, irrigation work, or a seasonal cleanup? We offer [EXAMPLES] for properties across [CITY].'
    },
    {
      id: 'pest-control',
      name: 'Pest Control',
      icon: '🐛',
      tagline: 'General pest, termite & wildlife removal',
      examples: 'general pest treatment, termite inspections, rodent removal, bed bug treatment, and mosquito control',
      priceRange: '$150–$300 for general treatment, $500–$3,000 for termite treatment',
      serviceQ: 'What kind of pest issue are you dealing with today? Is it ants, roaches, rodents, termites, bed bugs, or something else entirely? We handle [EXAMPLES] throughout [CITY].'
    },
    {
      id: 'house-cleaning',
      name: 'House Cleaning',
      icon: '🧹',
      tagline: 'Standard, deep, move-in & recurring service',
      examples: 'standard cleans, deep cleans, move-in/move-out cleaning, and recurring weekly or biweekly service',
      priceRange: '$120–$250 for standard cleans, $200–$500 for deep cleans',
      serviceQ: 'What type of cleaning service are you looking for today? Is it a one-time clean, a deep clean, a move-in or move-out, or are you looking for a regular recurring schedule? We offer [EXAMPLES] across [CITY].'
    },
    {
      id: 'pool-spa',
      name: 'Pool & Spa',
      icon: '🏊',
      tagline: 'Maintenance, chemical balancing & repairs',
      examples: 'weekly maintenance, chemical balancing, equipment repair, and seasonal opening and closing',
      priceRange: '$100–$200/month for maintenance, $200–$2,000 for repairs',
      serviceQ: 'What\'s going on with the pool or spa today? Are you looking for regular weekly maintenance, chemical balancing, equipment repair, or maybe an opening or closing for the season? We cover [EXAMPLES] across [CITY].'
    },
    {
      id: 'painting',
      name: 'Painting',
      icon: '🎨',
      tagline: 'Interior, exterior, cabinets & deck staining',
      examples: 'interior painting, exterior painting, cabinet painting, deck staining, and colour consultations',
      priceRange: '$300–$1,500 per room interior, $1,500–$6,000 for exterior',
      serviceQ: 'What painting project do you have in mind? Are we talking interior rooms, the exterior of the home, a deck or fence, cabinet painting, or something else? We do [EXAMPLES] for homes across [CITY].'
    },
    {
      id: 'flooring',
      name: 'Flooring',
      icon: '🪵',
      tagline: 'Install, replace & refinish any floor type',
      examples: 'hardwood installation, tile, LVP/vinyl, carpet installation, and hardwood refinishing',
      priceRange: '$3–$15 per sq ft, $1,500–$8,000+ for full-room projects',
      serviceQ: 'What kind of flooring project are you looking at? Are you installing new floors, replacing existing ones, or refinishing hardwood? And what material — hardwood, tile, vinyl, carpet? We handle [EXAMPLES] throughout [CITY].'
    },
    {
      id: 'handyman',
      name: 'Handyman',
      icon: '🛠️',
      tagline: 'General repairs, installs & home fix-it jobs',
      examples: 'furniture assembly, TV mounting, drywall patching, door repairs, and minor plumbing or electrical fixes',
      priceRange: '$75–$125 per hour',
      serviceQ: 'What kind of handyman work do you need today? Are we talking about a repair, an installation, furniture assembly, drywall, or a general fix-it job around the house? We handle [EXAMPLES] all across [CITY].'
    },
    {
      id: 'garage-door',
      name: 'Garage Door',
      icon: '🚪',
      tagline: 'Springs, openers, cables & new door installs',
      examples: 'spring replacements, opener repairs, cable fixes, track adjustments, and new door installations',
      priceRange: '$100–$300 for most repairs, $800–$2,500 for new door installation',
      serviceQ: 'What\'s happening with the garage door? Is it not opening or closing, making a grinding noise, off its tracks — or are you looking for a new door or a smart opener upgrade? We handle [EXAMPLES] across [CITY].'
    },
    {
      id: 'window-cleaning',
      name: 'Window Cleaning',
      icon: '🪟',
      tagline: 'Interior, exterior, screens & hard water stains',
      examples: 'interior and exterior window cleaning, screen cleaning, hard water stain removal, and solar panel cleaning',
      priceRange: '$150–$400 for most residential homes',
      serviceQ: 'What windows are we cleaning today? Just the exterior, inside and out, screens as well, or do you have solar panels or a commercial property? We offer [EXAMPLES] for properties across [CITY].'
    },
    {
      id: 'gutter-cleaning',
      name: 'Gutter Cleaning',
      icon: '🏡',
      tagline: 'Cleaning, guards, repairs & downspout clearing',
      examples: 'gutter cleaning, gutter guard installation, downspout clearing, and minor gutter repairs',
      priceRange: '$100–$250 for cleaning, $500–$2,000 for gutter guard installation',
      serviceQ: 'What gutter service do you need today? Is it a standard cleanout, a blockage, you\'re interested in gutter guards, or maybe some repair work? We handle [EXAMPLES] across [CITY].'
    },
    {
      id: 'pressure-washing',
      name: 'Pressure Washing',
      icon: '💦',
      tagline: 'Driveways, decks, house exteriors & more',
      examples: 'driveway cleaning, deck and patio washing, house exterior washing, fence cleaning, and roof soft washing',
      priceRange: '$150–$400 for most residential jobs',
      serviceQ: 'What are we pressure washing today? Is it a driveway, patio or deck, the exterior of the house, a fence, or something else? We do [EXAMPLES] for homes all across [CITY].'
    },
    {
      id: 'tree-services',
      name: 'Tree Services',
      icon: '🌳',
      tagline: 'Trimming, removal, stump grinding & cleanup',
      examples: 'tree trimming, tree removal, stump grinding, emergency storm cleanup, and deep root fertilization',
      priceRange: '$200–$600 for trimming, $500–$3,000+ for full removal',
      serviceQ: 'What kind of tree work do you need? Is it trimming, a full removal, stump grinding, or maybe some emergency storm damage cleanup? We handle [EXAMPLES] throughout [CITY].'
    },
    {
      id: 'fencing',
      name: 'Fence Installation',
      icon: '🔩',
      tagline: 'New fences, repairs, gates & staining',
      examples: 'new fence installation in wood, vinyl, and aluminium, fence repairs, gate installation, and wood staining',
      priceRange: '$15–$40 per linear foot, $200–$800 for repairs',
      serviceQ: 'What fence project are you thinking about? Installing a brand new fence, repairing an existing one, adding a gate, or maybe treating or sealing the wood? We do [EXAMPLES] across [CITY].'
    },
    {
      id: 'appliance-repair',
      name: 'Appliance Repair',
      icon: '🔌',
      tagline: 'Fridges, washers, dryers, dishwashers & ovens',
      examples: 'refrigerator, washer and dryer, dishwasher, oven, and microwave repairs',
      priceRange: '$75–$150 for service calls, $150–$400 for most repairs',
      serviceQ: 'Which appliance are we looking at today, and what\'s it doing — or not doing? Is it a refrigerator, washer, dryer, dishwasher, oven, or something else? We repair [EXAMPLES] for homeowners throughout [CITY].'
    },
    {
      id: 'locksmith',
      name: 'Locksmith',
      icon: '🔑',
      tagline: 'Lockouts, re-keying, smart locks & safe opening',
      examples: 'lockout service, lock re-keying, lock replacement, smart lock installation, and safe opening',
      priceRange: '$75–$150 for lockouts, $100–$300 for most services',
      serviceQ: 'What kind of locksmith service do you need today? Are you locked out, looking to re-key your home, need a lock replaced, or interested in a smart lock upgrade? We offer [EXAMPLES] across [CITY].'
    },
    {
      id: 'moving',
      name: 'Moving Services',
      icon: '📦',
      tagline: 'Local, long-distance & specialty moves',
      examples: 'local moves, long-distance relocations, packing and unpacking, furniture-only moves, and piano moving',
      priceRange: '$100–$150 per hour for local moves',
      serviceQ: 'What kind of move are we talking about today? A local move around [CITY], a long-distance relocation, just a few heavy items, or are you also looking for packing help? We handle [EXAMPLES].'
    },
    {
      id: 'junk-removal',
      name: 'Junk Removal',
      icon: '🗑️',
      tagline: 'Furniture, appliances, debris & estate cleanouts',
      examples: 'furniture removal, appliance hauling, estate cleanouts, construction debris removal, and yard waste pickup',
      priceRange: '$100–$600 depending on load size',
      serviceQ: 'What kind of junk are we hauling away today? Is it furniture, appliances, general household clutter, construction debris, or maybe a full estate or garage cleanout? We handle [EXAMPLES] across [CITY].'
    },
    {
      id: 'carpet-cleaning',
      name: 'Carpet Cleaning',
      icon: '🧺',
      tagline: 'Steam cleaning, stain removal & upholstery',
      examples: 'whole-home steam cleaning, stain removal, pet odour treatment, area rug cleaning, and upholstery cleaning',
      priceRange: '$100–$300 for most homes',
      serviceQ: 'What does the carpet cleaning involve today? Are we doing the whole house, a few rooms, spot treatment for stains, or do you have rugs or upholstery as well? We offer [EXAMPLES] throughout [CITY].'
    },
    {
      id: 'solar',
      name: 'Solar Installation',
      icon: '☀️',
      tagline: 'Panels, battery storage & EV charger pairing',
      examples: 'full solar panel installation, battery backup systems, EV charger pairing, and existing system inspections',
      priceRange: '$15,000–$35,000 for full systems before incentives and rebates',
      serviceQ: 'What solar project are you looking into? A full home solar installation, battery backup, an EV charger, or a checkup on an existing system? We handle [EXAMPLES] for homeowners across [CITY].'
    },
    {
      id: 'home-security',
      name: 'Home Security',
      icon: '🔐',
      tagline: 'Cameras, alarms, smart locks & monitoring',
      examples: 'camera installation, full alarm systems, smart doorbells, motion sensors, and smart lock integration',
      priceRange: '$200–$1,500 for installation, plus optional monitoring plans',
      serviceQ: 'What kind of security setup are you looking for? Camera installation, a full alarm system, a smart doorbell, smart locks, or a full package? We set up [EXAMPLES] for homes across [CITY].'
    },
    {
      id: 'foundation',
      name: 'Foundation & Waterproofing',
      icon: '🏗️',
      tagline: 'Crack repairs, basement waterproofing & sump pumps',
      examples: 'foundation crack repair, basement waterproofing, sump pump installation, and crawl space encapsulation',
      priceRange: '$500–$5,000 for waterproofing, $5,000–$30,000+ for major structural repairs',
      serviceQ: 'What foundation or waterproofing issue are you dealing with? Are you seeing cracks, water getting into the basement or crawl space, or do you need a sump pump installed? We handle [EXAMPLES] throughout [CITY].'
    }
  ];

  /* ── Helper: resolve a variable (HTML or plain) ─ */
  function vHtml(key, fallback) {
    return vars[key]
      ? `<strong>${escHtml(vars[key])}</strong>`
      : `<span class="var-empty">${fallback}</span>`;
  }

  function vTxt(key, fallback) {
    return vars[key] || fallback;
  }

  function escHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Build HTML Script (for modal display) ────── */
  function buildScriptHtml(industry) {
    const a  = vHtml('agentName',    '{{AgentName}}');
    const b  = vHtml('businessName', '{{BusinessName}}');
    const o  = vHtml('ownerName',    '{{OwnerName}}');
    const c  = vHtml('cityArea',     '{{City/Area}}');
    const oh = vHtml('openHour',     '{{OpenHour}}');
    const ch = vHtml('closeHour',    '{{CloseHour}}');

    const cityTxt = vTxt('cityArea', '{{City/Area}}');
    const ownerTxt = vTxt('ownerName', '{{OwnerName}}');

    const serviceQ = industry.serviceQ
      .replace('[EXAMPLES]', `<em>${escHtml(industry.examples)}</em>`)
      .replace('[CITY]', c);

    return `
    <!-- STEP 1 -->
    <div class="script-step">
      <div class="step-header">
        <div class="step-num-badge">1</div>
        <div class="step-info">
          <h3>Greeting</h3>
          <p>Time-aware — use the version that matches when the caller rings.</p>
        </div>
      </div>
      <div class="step-content">
        <div class="variant-block">
          <div class="variant-label green">🟢 During Hours (${oh} – ${ch})</div>
          <div class="speech-bubble">
            "Thank you for calling ${b}! This is ${a}. How can I help you today?"
          </div>
        </div>
        <div class="variant-block">
          <div class="variant-label amber">🌅 Before Opening</div>
          <div class="speech-bubble">
            "Thank you for calling ${b}! You've reached us a little early — our team is available from ${oh} to ${ch}. I can take your information now and have ${o} call you as soon as we open. Does that work for you?"
          </div>
        </div>
        <div class="variant-block">
          <div class="variant-label slate">🌙 After Closing</div>
          <div class="speech-bubble">
            "Thank you for calling ${b}! We've wrapped up for the evening — our hours are ${oh} to ${ch}. I'd be happy to take your details so ${o} can give you a call first thing tomorrow morning. Sound good?"
          </div>
        </div>
      </div>
    </div>

    <!-- STEP 2 -->
    <div class="script-step">
      <div class="step-header">
        <div class="step-num-badge">2</div>
        <div class="step-info">
          <h3>Service Type</h3>
          <p>Identify exactly what the caller needs. Wait for a full response before continuing.</p>
        </div>
      </div>
      <div class="step-content">
        <div class="speech-bubble">
          "Wonderful! ${serviceQ}"
        </div>
        <div class="wait-pill">⏸ Wait for response before continuing</div>
      </div>
    </div>

    <!-- STEP 3 -->
    <div class="script-step">
      <div class="step-header">
        <div class="step-num-badge">3</div>
        <div class="step-info">
          <h3>Service Description</h3>
          <p>Get a brief description of the job or problem in the caller's own words.</p>
        </div>
      </div>
      <div class="step-content">
        <div class="speech-bubble">
          "Got it! Can you give me just a quick description of the situation? Even just a sentence or two — it really helps our team know what to expect when they call you back."
        </div>
        <div class="wait-pill">⏸ Wait for response before continuing</div>
      </div>
    </div>

    <!-- STEP 4 -->
    <div class="script-step">
      <div class="step-header">
        <div class="step-num-badge">4</div>
        <div class="step-info">
          <h3>Contact Information</h3>
          <p>Phone number is mandatory. Email is optional — never pressure.</p>
        </div>
      </div>
      <div class="step-content">
        <div class="speech-bubble">
          "Perfect! Let me grab your contact details so ${o} can follow up with you directly."
        </div>
        <div class="contact-steps">
          <div class="contact-step">
            <div class="contact-q">"First — what's your full name?"</div>
            <div class="wait-pill">⏸ Wait for name</div>
          </div>
          <div class="contact-step">
            <div class="contact-q">"And the best phone number to reach you at?"</div>
            <div class="mandatory-pill">📞 MANDATORY — do not continue without this</div>
          </div>
          <div class="contact-step">
            <div class="contact-q">"Do you have an email address you'd like us to use for a confirmation? Totally optional!"</div>
            <div class="wait-pill">⏸ Wait — optional, never pressure</div>
          </div>
        </div>
      </div>
    </div>

    <!-- STEP 5 -->
    <div class="script-step">
      <div class="step-header">
        <div class="step-num-badge">5</div>
        <div class="step-info">
          <h3>Address / Neighbourhood</h3>
          <p>Confirm where the service is needed.</p>
        </div>
      </div>
      <div class="step-content">
        <div class="speech-bubble">
          "Almost there! What's the address or neighbourhood where the work would take place? Even just the general area in <strong>${escHtml(cityTxt)}</strong> helps us plan."
        </div>
        <div class="wait-pill">⏸ Wait for response before continuing</div>
      </div>
    </div>

    <!-- STEP 6 -->
    <div class="script-step script-step--conditional">
      <div class="step-header">
        <div class="step-num-badge conditional">6</div>
        <div class="step-info">
          <h3>Quotes <span class="conditional-tag">Only if the caller asks</span></h3>
          <p>Give a rough range only. Never confirm exact pricing on the call.</p>
        </div>
      </div>
      <div class="step-content">
        <div class="speech-bubble">
          "Great question! I can give you a rough ballpark — for most ${escHtml(industry.name.toLowerCase())} jobs, ${b} typically starts around <strong>${escHtml(industry.priceRange)}</strong>. Every job is a little different though, so ${o} will give you an accurate quote when they call you back. Fair enough?"
        </div>
        <div class="info-note">
          ⚠️ Always defer exact pricing to ${escHtml(ownerTxt)}. Never commit to a final number on the call.
        </div>
      </div>
    </div>

    <!-- STEP 7 -->
    <div class="script-step">
      <div class="step-header">
        <div class="step-num-badge">7</div>
        <div class="step-info">
          <h3>Confirmation &amp; Close</h3>
          <p>Read back the details and confirm when the callback will happen.</p>
        </div>
      </div>
      <div class="step-content">
        <div class="speech-bubble">
          "Perfect — I've got everything I need! Let me just read that back:
          <br><br>
          &bull; <em>Service:</em> [what they described]<br>
          &bull; <em>Name:</em> [caller's name]<br>
          &bull; <em>Phone:</em> [phone number]<br>
          &bull; <em>Location:</em> [address or area]
          <br><br>
          ${o} will be giving you a call [<em>during hours: within our business hours today</em> / <em>after hours: first thing when we open at ${oh} tomorrow</em>]. Is there anything else I can help you with before we wrap up?"
        </div>
        <div class="speech-bubble speech-bubble--secondary">
          <em>If nothing else:</em> "Wonderful! Have a great [morning / afternoon / evening] — we'll be in touch very soon!"
        </div>
      </div>
    </div>

    <!-- STEP 8 -->
    <div class="script-step">
      <div class="step-header">
        <div class="step-num-badge rules">8</div>
        <div class="step-info">
          <h3>Rules &amp; Guardrails</h3>
          <p>Built-in guidelines for keeping every call on track.</p>
        </div>
      </div>
      <div class="step-content">
        <ul class="rules-list">
          <li><span class="rule-check">✅</span> Ask only <strong>one question at a time</strong> — always wait for a full response before moving on.</li>
          <li><span class="rule-check">✅</span> Keep your tone <strong>warm, friendly, and confident</strong> throughout the entire call.</li>
          <li><span class="rule-check">✅</span> Phone number is <strong>MANDATORY</strong> — do not end the call without it.</li>
          <li><span class="rule-check">✅</span> Email is <strong>OPTIONAL</strong> — never pressure the caller if they prefer not to share it.</li>
          <li><span class="rule-check">✅</span> If asked for pricing, give the rough range above only — always refer exact quotes to <strong>${escHtml(ownerTxt)}</strong>.</li>
          <li><span class="rule-check">✅</span> If the caller is frustrated or urgent, acknowledge it first: <em>"I completely understand — let me make sure we get the right person on this for you right away."</em></li>
          <li><span class="rule-check">✅</span> Always confirm the callback time before ending the call.</li>
          <li><span class="rule-check">✅</span> Close warmly — leave every caller feeling <strong>heard and taken care of</strong>.</li>
        </ul>
      </div>
    </div>
    `;
  }

  /* ── Build Plain Text Script (for clipboard) ─── */
  function buildScriptText(industry) {
    const a  = vTxt('agentName',    '{{AgentName}}');
    const b  = vTxt('businessName', '{{BusinessName}}');
    const o  = vTxt('ownerName',    '{{OwnerName}}');
    const c  = vTxt('cityArea',     '{{City/Area}}');
    const oh = vTxt('openHour',     '{{OpenHour}}');
    const ch = vTxt('closeHour',    '{{CloseHour}}');

    const serviceQ = industry.serviceQ
      .replace('[EXAMPLES]', industry.examples)
      .replace('[CITY]', c);

    const line = '═'.repeat(52);
    const dash = '─'.repeat(52);

    return `${line}
AI RECEPTIONIST SCRIPT — ${industry.name.toUpperCase()}
${line}
Business  : ${b}
Agent     : ${a}
Owner     : ${o}
Area      : ${c}
Hours     : ${oh} – ${ch}
${line}


${dash}
STEP 1 — GREETING
${dash}
Use the version that matches when the caller rings.

🟢 DURING HOURS (${oh} – ${ch}):
"Thank you for calling ${b}! This is ${a}. How can I help you today?"

🌅 BEFORE OPENING:
"Thank you for calling ${b}! You've reached us a little early — our team is available from ${oh} to ${ch}. I can take your information now and have ${o} call you as soon as we open. Does that work for you?"

🌙 AFTER CLOSING:
"Thank you for calling ${b}! We've wrapped up for the evening — our hours are ${oh} to ${ch}. I'd be happy to take your details so ${o} can give you a call first thing tomorrow morning. Sound good?"


${dash}
STEP 2 — SERVICE TYPE
${dash}
"Wonderful! ${serviceQ}"

[Wait for response before continuing]


${dash}
STEP 3 — SERVICE DESCRIPTION
${dash}
"Got it! Can you give me just a quick description of the situation? Even just a sentence or two — it really helps our team know what to expect when they call you back."

[Wait for response before continuing]


${dash}
STEP 4 — CONTACT INFORMATION
${dash}
"Perfect! Let me grab your contact details so ${o} can follow up with you directly."

"First — what's your full name?"
[Wait for name]

"And the best phone number to reach you at?"
*** MANDATORY — do not continue without this ***

"Do you have an email address you'd like us to use for a confirmation? Totally optional!"
[Wait — optional field, never pressure]


${dash}
STEP 5 — ADDRESS / NEIGHBOURHOOD
${dash}
"Almost there! What's the address or neighbourhood where the work would take place? Even just the general area in ${c} helps us plan."

[Wait for response before continuing]


${dash}
STEP 6 — QUOTES  (Only if the caller asks)
${dash}
"Great question! I can give you a rough ballpark — for most ${industry.name.toLowerCase()} jobs, ${b} typically starts around ${industry.priceRange}. Every job is a little different though, so ${o} will give you an accurate quote when they call you back. Fair enough?"

⚠ Always defer exact pricing to ${o}. Never commit to a final number on the call.


${dash}
STEP 7 — CONFIRMATION & CLOSE
${dash}
"Perfect — I've got everything I need! Let me just read that back:
  • Service  : [what they described]
  • Name     : [caller's name]
  • Phone    : [phone number]
  • Location : [address or area]

${o} will be giving you a call [during hours: within our business hours today / after hours: first thing when we open at ${oh} tomorrow]. Is there anything else I can help you with before we wrap up?"

If nothing else:
"Wonderful! Have a great [morning / afternoon / evening] — we'll be in touch very soon!"


${dash}
STEP 8 — RULES & GUARDRAILS
${dash}
✅ Ask only ONE question at a time — always wait for a full response before moving on.
✅ Keep your tone warm, friendly, and confident throughout the entire call.
✅ Phone number is MANDATORY — do not end the call without it.
✅ Email is OPTIONAL — never pressure the caller if they prefer not to share it.
✅ If asked for pricing, give the rough range above only — always refer exact quotes to ${o}.
✅ If the caller is frustrated or urgent, acknowledge it first: "I completely understand — let me make sure we get the right person on this for you right away."
✅ Always confirm the callback time before ending the call.
✅ Close warmly — leave every caller feeling heard and taken care of.

${line}
Generated by CoachMack AI Receptionist Playbook
${line}`;
  }

  /* ── Render Industry Grid ─────────────────────── */
  function renderGrid() {
    const grid = document.getElementById('industriesGrid');
    if (!grid) return;

    grid.innerHTML = INDUSTRIES.map(ind => `
      <button
        class="industry-card"
        data-id="${escHtml(ind.id)}"
        aria-label="View ${escHtml(ind.name)} script"
      >
        <span class="industry-card__icon" aria-hidden="true">${ind.icon}</span>
        <h3 class="industry-card__name">${escHtml(ind.name)}</h3>
        <p class="industry-card__tagline">${escHtml(ind.tagline)}</p>
        <span class="industry-card__cta" aria-hidden="true">View Script →</span>
      </button>
    `).join('');

    grid.querySelectorAll('.industry-card').forEach(card => {
      card.addEventListener('click', () => {
        const ind = INDUSTRIES.find(i => i.id === card.dataset.id);
        if (ind) openModal(ind);
      });
    });
  }

  /* ── Modal ───────────────────────────────────── */
  function openModal(industry) {
    activeIndustry = industry;

    document.getElementById('modalIcon').textContent    = industry.icon;
    document.getElementById('modalName').textContent    = industry.name;
    document.getElementById('modalTagline').textContent = industry.tagline;
    document.getElementById('modalBody').innerHTML      = buildScriptHtml(industry);
    document.getElementById('copyBtnText').textContent  = 'Copy Script';

    const overlay = document.getElementById('modalOverlay');
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Scroll modal to top
    const box = document.getElementById('modalBox');
    if (box) box.scrollTop = 0;

    // Focus the copy button for accessibility
    document.getElementById('copyBtn').focus();
  }

  function closeModal() {
    activeIndustry = null;
    const overlay = document.getElementById('modalOverlay');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ── Download as PDF ─────────────────────────── */
  function handleDownloadPdf() {
    if (!activeIndustry) return;
    const text  = buildScriptText(activeIndustry);
    const title = `${activeIndustry.name} — AI Receptionist Script`;

    const win = window.open('', '_blank');
    if (!win) return; // popup blocked

    win.document.write(`<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8">
<title>${escHtml(title)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, 'Helvetica Neue', sans-serif; max-width: 720px; margin: 48px auto; padding: 0 24px; color: #0c1a2e; font-size: 12px; line-height: 1.75; }
  pre { white-space: pre-wrap; word-break: break-word; font-family: inherit; }
  @page { margin: 20mm; }
  @media print { body { margin: 0; } }
</style>
</head><body>
<pre>${escHtml(text)}</pre>
<script>window.print(); window.onafterprint = () => window.close();<\/script>
</body></html>`);
    win.document.close();
  }

  /* ── Copy to Clipboard ───────────────────────── */
  async function handleCopy() {
    if (!activeIndustry) return;
    const text = buildScriptText(activeIndustry);
    const btnText = document.getElementById('copyBtnText');

    try {
      await navigator.clipboard.writeText(text);
      btnText.textContent = '✓ Copied!';
      setTimeout(() => { btnText.textContent = 'Copy Script'; }, 2500);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = text;
      el.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand('copy');
        btnText.textContent = '✓ Copied!';
        setTimeout(() => { btnText.textContent = 'Copy Script'; }, 2500);
      } catch {
        btnText.textContent = 'Copy failed';
        setTimeout(() => { btnText.textContent = 'Copy Script'; }, 2500);
      }
      document.body.removeChild(el);
    }
  }

  /* ── Re-render open modal when vars change ────── */
  function refreshModal() {
    if (activeIndustry) {
      document.getElementById('modalBody').innerHTML = buildScriptHtml(activeIndustry);
    }
  }

  /* ── Init ─────────────────────────────────────── */
  function init() {
    /* Navbar scroll behaviour */
    const nav = document.getElementById('pbNav');
    if (nav) {
      const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* Mobile burger */
    const burger   = document.getElementById('pbBurger');
    const navLinks = document.getElementById('pbNavLinks');
    if (burger && navLinks) {
      burger.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        burger.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
      });
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }

    /* Restore saved variables from localStorage */
    const STORAGE_KEY = 'pb_vars';
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      Object.keys(vars).forEach(key => {
        if (saved[key]) {
          vars[key] = saved[key];
          const input = document.querySelector(`[data-var="${key}"]`);
          if (input) input.value = saved[key];
        }
      });
    } catch { /* ignore parse errors */ }

    /* Variable inputs — live update + persist */
    document.querySelectorAll('[data-var]').forEach(input => {
      input.addEventListener('input', () => {
        vars[input.dataset.var] = input.value.trim();
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(vars)); } catch { /* ignore */ }
        refreshModal();
      });
    });

    /* Render the 25 industry cards */
    renderGrid();

    /* Modal close events */
    document.getElementById('modalClose').addEventListener('click', closeModal);

    document.getElementById('modalOverlay').addEventListener('click', e => {
      if (e.target === document.getElementById('modalOverlay')) closeModal();
    });

    /* Copy button */
    document.getElementById('copyBtn').addEventListener('click', handleCopy);

    /* PDF download button */
    document.getElementById('pdfBtn').addEventListener('click', handleDownloadPdf);

    /* ESC to close */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });
  }

  /* Run after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
