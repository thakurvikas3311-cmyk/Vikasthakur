/* Case study content — full for Schoolpad, lean fallback for the rest */

(function(){
  const P = window.PROJECTS || [];
  const byId = Object.fromEntries(P.map(p => [p.slug, p]));

  /* Default tools chip list */
  const baseTools = ['Figma', 'Design Systems', 'Prototyping', 'User Research'];

  /* Build a "lean" case study from the basic project data — used as fallback
     when we don't have a rich write-up yet. */
  function lean(slug, year, client, type) {
    const p = byId[slug];
    if (!p) return null;
    return {
      title: p.title,
      sub: p.sub,
      tag: p.services,
      year, client,
      type: type || 'Product · UX/UI',
      cover: p.img,
      overview: p.desc,
      sections: [
        {
          h: 'The Brief',
          body: p.desc + ' The project required end-to-end UX/UI craft — from early discovery and journey mapping, through high-fidelity design, to a development-ready handoff aligned with the client\u2019s system constraints.',
        },
        {
          h: 'Approach',
          features: [
            ['Research', 'Stakeholder interviews and competitive scans to anchor the problem before any pixel was drawn.'],
            ['Information architecture', 'Mapped flows, surfaces, and edge cases so the structure could carry future scope.'],
            ['Visual system', 'Tokens for type, color, spacing, and elevation — assembled into a small, opinionated component set.'],
            ['Prototyping & test', 'Mid-fi prototypes pressure-tested with real users; iterated before high-fidelity.'],
            ['Handoff', 'Specs, redlines, and a written design system kept engineering velocity high through delivery.'],
          ],
        },
        p.quote ? {
          h: 'Client',
          body: '\u201C' + p.quote + '\u201D \u2014 ' + p.quoteBy,
        } : null,
        {
          h: 'Services',
          chips: p.services.split(/\s*[\u00b7,]\s*/).filter(Boolean),
        },
      ].filter(Boolean),
      gallery: [p.img],
    };
  }

  const richSchoolpad = {
    title: 'Schoolpad',
    sub: 'Modern, intuitive B2B2C school platform',
    tag: 'EdTech · SaaS · School ERP',
    year: '2022',
    client: 'SchoolPad Technologies',
    type: 'Web · Mobile · Design System',
    cover: 'https://framerusercontent.com/images/MmhHr0idwsy470W0OtYDStSq5yw.png?width=1400&height=1728',
    overview: 'Schoolpad\u2019s legacy platform had become feature-heavy, visually outdated, and operationally inefficient. The redesign aimed to improve usability, cross-platform consistency, and workflow efficiency across all user groups \u2014 administrators, teachers, staff, students, and parents.',
    sections: [
      {
        h: 'The Challenge',
        body: 'Rapid feature growth over the years had fragmented the UX across modules, produced data-heavy screens that overwhelmed users, and created misaligned workflows between web and mobile. Teachers and admins struggled to find key actions quickly, parents found the mobile app cluttered, and legacy technical constraints required solutions that aligned closely with Atlassian\u2019s system to minimize development friction.',
      },
      {
        h: 'Discovery & Research',
        body: 'We ran in-depth interviews with school admins, teachers across grade levels, operational staff, students, and parents. Heuristic evaluation exposed poor hierarchy, confusing terminology, redundant actions, inefficient layouts, and unnecessary workflow steps. Usage data highlighted drop-offs in attendance flows and low engagement with announcements and secondary modules. Teachers were peak-load users who needed faster repetitive actions; admins required quick data summaries; parents wanted instant updates without the noise.',
      },
      {
        h: 'Defining the Core Problem',
        body: 'Schoolpad users were spending excessive time completing routine tasks due to non-intuitive workflows, inconsistent UI, and a lack of harmony between web and mobile \u2014 producing frustration, inefficiency, and reduced product adoption across roles.',
      },
      {
        h: 'Root Cause',
        body: 'Years of feature accumulation without IA re-evaluation, absence of a unified design framework, navigation that was not prioritized by user role, and a mobile app treated as a visual adaptation of the web rather than a purpose-built experience.',
      },
      {
        h: 'UX Strategy & IA',
        features: [
          ['Role-based dashboards', 'Each user sees only what matters to them \u2014 driven by role, not navigation depth.'],
          ['Atlassian-aligned shell', 'Simplified primary navigation and contextual actions in line with the existing Atlassian foundations.'],
          ['Critical workflow rebuild', 'Attendance, homework, lesson planning, fees, communication, and reports re-scored for clarity and task efficiency.'],
          ['Mobile, parent-first', 'A daily home feed for parents with notifications, simplified overviews, and improved readability.'],
        ],
      },
      {
        h: 'Interaction Design',
        body: 'Key interaction decisions separated \u201Cview\u201D and \u201Caction\u201D zones to reduce cognitive load, introduced contextual toolbars for faster task discovery, standardized forms and tables using Atlassian foundations, improved readability through modern spacing and typography tokens, and added micro-interactions for alerts, reminders, and submissions \u2014 especially in the mobile app.',
      },
      {
        h: 'Prototyping & Testing',
        body: 'Moderated remote usability tests with teachers and admins were supported by internal testing from the support team and small parent testing groups for the mobile app. Feedback surfaced excessive filtering on web screens, a strong preference for a parent home feed, and the need for quicker teacher actions \u2014 each driving iterative refinements across the flows.',
      },
      {
        h: 'UI & Design System',
        body: 'The Atlassian Design System was used as the foundation to ensure consistency, scalability, and reduced engineering overhead. Design tokens for typography, spacing, elevation, and color were introduced, alongside card-based dashboards, modernized tables, and mobile-first layouts for the parent and student experiences.',
      },
      {
        h: 'Final Solution',
        body: 'Clean, structured dashboards, improved information architecture, and streamlined workflows across the web platform, while the mobile app focused on a parent-first experience with strong notifications, simplified daily overviews, and improved readability for younger users.',
      },
      {
        h: 'Impact',
        features: [
          ['Faster task completion', 'Teachers shipped routine actions in fewer steps; visible time saving across attendance and homework flows.'],
          ['Lower support load', 'Fewer support tickets from parents after the mobile app refresh.'],
          ['Higher daily active use', 'Improved teacher adoption and reduced onboarding time for new schools.'],
          ['Qualitative wins', 'Simpler daily workflows for teachers, easier access to reports for admins, clearer experiences for parents.'],
        ],
      },
      {
        h: 'Reflections',
        body: 'B2B2C systems require deeply role-based mental models. Legacy redesigns demand a balance between innovation and constraint. A mature design system like Atlassian can significantly accelerate scalability and engineering alignment. Multi-platform alignment requires distinct UX logic for each surface \u2014 and real user feedback remains the most valuable driver of meaningful design decisions.',
      },
      {
        h: 'Tools',
        chips: ['Figma', 'Atlassian Design System', 'Design Tokens', 'Usability Testing', 'Mobile-first', 'Sprint-aligned delivery'],
      },
    ],
    gallery: [
      'https://framerusercontent.com/images/Z9cJxo6Cm4w2oRVyUK7AWZ39T0.png',
      'https://framerusercontent.com/images/aUvqVpGWgr3Q9KWiM8E0M25yvzo.png',
      'https://framerusercontent.com/images/zF61x8iJhpFQ3kDair4m0ZeZQcU.png?width=4000&height=4000',
      'https://framerusercontent.com/images/9e9v23KhlJth2VGMfCMqst3U.jpg?width=3000&height=2250',
      'https://framerusercontent.com/images/Ctq7h6JAC5jBRzaqeq2CBVMIzYw.jpg?width=3000&height=2250',
      'https://framerusercontent.com/images/vLyzjjT02DwGS3PIUeYiikNQfPQ.jpg?width=3000&height=2250',
      'https://framerusercontent.com/images/pVeYHOO0Z92R4gvgWeVKOiiZvgE.png?width=4000&height=4000',
      'https://framerusercontent.com/images/favlefa6ynO2LLMpIJJiwrrcl8.png?width=4000&height=4000',
      'https://framerusercontent.com/images/JFmxK053gYdueGr3H2BKXavs3A.jpg?width=3000&height=2250',
      'https://framerusercontent.com/images/vENWvOkxe6wsAeWDKGamAeFqTHU.png?width=4000&height=4000',
      'https://framerusercontent.com/images/gUjEOZG88KpCBL7EmTMZkkBJmk.png?width=4000&height=4000',
      'https://framerusercontent.com/images/3LvQl9iJAuBbsQEyRqCmiYb49Qc.png?width=4000&height=4000',
    ],
  };

  /* Map of slug → case study */
  const yearMap = {
    'schoolpad': '2022', 'design-school': '2024', 'fintap': '2023', 'lifey': '2023',
    'telos': '2025', 'atom': '2024', 'e-pay': '2023', 'simplysales': '2023',
    'jd-world': '2023', 'zingit-patient-application': '2024',
    'chitkara-business-school': '2024', 'eld-application': '2023',
    'inbox--zingit': '2024', 'chitkara-university': '2024', 'icertify': '2023',
    'thrilldubai': '2023', 'agency-maison': '2023', 'my-online-college': '2023',
    'campus-360': '2024', 'home-decor': '2024', 'ui-snapshots': '2024',
  };
  const clientMap = {
    'schoolpad': 'SchoolPad Technologies', 'design-school': 'Chitkara Design School',
    'fintap': 'FinTap UAE', 'lifey': 'Taif Tec', 'telos': 'Telos',
    'atom': 'Chitkara University', 'e-pay': 'Taif Tec', 'simplysales': 'Simply Sales / Fluent',
    'jd-world': 'Taif Tec', 'zingit-patient-application': 'Zingit',
    'chitkara-business-school': 'Chitkara University', 'eld-application': 'ELD Co.',
    'inbox--zingit': 'Zingit', 'chitkara-university': 'Chitkara University',
    'icertify': 'ICertify', 'thrilldubai': 'ThrillDubai',
    'agency-maison': 'Agency Maison', 'my-online-college': 'My Online College',
    'campus-360': 'Campus 360', 'home-decor': 'Homely', 'ui-snapshots': 'Studio'
  };
  const typeMap = {
    'schoolpad': 'Web · Mobile · ERP', 'design-school': 'Brand · Website',
    'fintap': 'Mobile · Fintech', 'lifey': 'Mobile · e-commerce',
    'telos': 'Web · Platform', 'atom': 'Portal · Web',
    'e-pay': 'Mobile · Fintech', 'simplysales': 'Web · CRM · B2B',
    'jd-world': 'Mobile · Media', 'zingit-patient-application': 'Mobile · Healthcare',
    'chitkara-business-school': 'Web · Brand', 'eld-application': 'Mobile · Compliance',
    'inbox--zingit': 'Web · SaaS', 'chitkara-university': 'Web · System',
    'icertify': 'Web · Platform', 'thrilldubai': 'Mobile · Travel',
    'agency-maison': 'Mobile · Web · Service', 'my-online-college': 'Web · EdTech',
    'campus-360': 'Web · EdTech', 'home-decor': 'Web · Brand', 'ui-snapshots': 'Visual'
  };

  const CASE_STUDIES = {};
  P.forEach(p => {
    if (p.slug === 'schoolpad') { CASE_STUDIES[p.slug] = richSchoolpad; return; }
    CASE_STUDIES[p.slug] = lean(p.slug, yearMap[p.slug] || '2024', clientMap[p.slug] || 'Client', typeMap[p.slug] || 'Product');
  });

  /* Order — used for "next case" link */
  window.CASE_ORDER = P.map(p => p.slug);
  window.CASE_STUDIES = CASE_STUDIES;
})();
