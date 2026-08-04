/* data.js
 *
 * Every piece of content on the site. Nothing else hardcodes text, so editing
 * this file is enough to update the page. Attached to window.Portfolio because
 * the scripts load as classic <script> tags, not modules, which keeps the whole
 * thing working when opened straight off the filesystem.
 */
(function (P) {
  'use strict';

  P.data = {};

  /* ---------------------------------------------------------------- profile */

  P.data.profile = {
    name: 'Özlem Yıldız',
    role: 'Research Scientist, Meta',
    tagline: 'I work on <em>AI coding agents</em> at Meta: what they learn from each other, and how we measure whether it helped.',
    location: 'New York City',
    email: 'ozlemyildizee@gmail.com',
    resume: 'files/Resume_OzlemYildiz.pdf',
    links: {
      linkedin: 'https://www.linkedin.com/in/ozlem-yildiz-95a47bb5/',
      github: 'https://github.com/OzleemYildiz',
      scholar: 'https://scholar.google.com/citations?user=I93NXVwAAAAJ&hl=en',
      instagram: 'https://instagram.com/c_ozy_film?igshid=OGQ5ZDc2ODk2ZA%3D%3D&utm_source=qr'
    },
    bio: [
      'I am a research scientist at Meta, where I work on how AI coding agents share what they learn. Right now that means two things: a plugin that carries context between agents so they stop re-failing problems another agent already solved, and the benchmark tasks and evaluation frameworks that measure whether it worked.',
      'Before that I spent a year post-training multimodal models for Ray-Ban Meta glasses, across text, vision and audio in 11 languages. I built the data curation pipeline behind it and the LLM-as-a-judge system that graded its output, which then got reused as the reward signal for RL.',
      'I have a Ph.D. in Electrical and Computer Engineering from NYU Tandon, advised by Prof. Elza Erkip. My doctoral work was on hardware-aware design for millimeter wave and sub-terahertz systems: beam alignment, hardware-constrained receivers, and information theory. I moved into large-scale AI systems after an AR/VR internship at Meta Reality Labs in 2024.'
    ],
    stats: [
      { value: 8, label: 'publications', note: 'Six published, two under review at Asilomar 2026 and IEEE TWC.' },
      { value: 2, label: 'patents pending', note: 'Filed from the Samsung Research America and Dell internships.' },
      { value: 11, label: 'languages shipped', note: 'Ray-Ban Meta Glasses translation, in production.' },
      { value: 6, label: 'years of research', note: 'NYU Wireless with Prof. Elza Erkip, plus research internships each summer.' }
    ]
  };

  /* ------------------------------------------------------------------- work */

  P.data.currentWork = {
    org: 'Meta',
    title: 'Research Scientist, Agent Data & Optimization',
    period: 'May 2026 to present',
    location: 'New York, NY',
    summary:
      'My work splits into two parts: getting agents to carry what they have learned across runs, and building the evaluation that shows whether it made any difference.',
    points: [
      'Built a plugin for an AI coding agent harness that shares learned context across agents, so a failure one agent already worked through does not get repeated by the next one.',
      'Designed benchmark tasks and evaluation frameworks for AI coding agents, turning what counts as good agentic coding behavior into reproducible, measurable criteria.'
    ]
  };

  P.data.previousWork = [
    {
      org: 'Meta',
      title: 'Research Scientist, Multimodal AI',
      project: 'Ray-Ban Meta Glasses',
      period: 'September 2025 to May 2026',
      location: 'New York, NY',
      teaser: 'Multimodal post-training for Ray-Ban Meta Glasses, across 11 languages.',
      points: [
        'Built a production translation evaluation and auto-rewrite workflow with iterative improvement loops, raising success rates from 48% to 90% across European languages.',
        'Drove the Turkish voice LLM launch, lifting the LLM-judge translation quality score from 67.8 to 86.4 over 1M samples, including the phonetic error cases that only show up in production. The judge was calibrated against human annotations and then reused as the RL reward signal.',
        'Post-trained multimodal models for AR wearables, improving image-based translation quality by 14.7% and contributing to task success gains on text-in-image queries.',
        'Architected and shipped a fully async data curation pipeline that replaced manual per-topic workflows, producing 100K+ quality-checked training samples across 11 languages, with adaptive concurrency control, buffered checkpoint writes and per-phase fault isolation so a crash could resume instead of starting over.',
        'Designed the pipeline’s multi-dimensional LLM-as-a-judge framework covering topic relevance, image quality, redaction detection, translation grading, refusal detection and helpfulness.'
      ]
    },
    {
      org: 'Meta',
      title: 'PhD Software Engineer Intern, AR/VR',
      project: 'Reality Labs, Burlingame',
      period: 'June to August 2024',
      location: 'Burlingame, CA',
      teaser: 'ML inpainting for depth and texture in AR passthrough rendering.',
      supervisor: 'Supervised by Dr. Margarita Grinvald',
      points: [
        'Delivered an end-to-end ML inpainting model for depth and texture synthesis at disocclusion regions, the gaps left when the camera view is reprojected to the position of the eye.',
        'Integrated a layered depth inpainting model into a production AR/VR passthrough rendering pipeline, including camera model projections, coordinate transforms, temporal stability via blending, and GPU kernel testing across 100+ frame sequences.',
        'Improved reconstruction quality (PSNR and SSIM) over baselines, which shows up directly as visual fidelity in the AR display.'
      ]
    }
  ];

  /* ----------------------------------------------------------- publications */

  P.data.publications = [
    {
      title: 'Hardware-Algorithm Co-Design for Interference Mitigation in FR3 Receivers',
      authors: ['P. Yang', 'O. Yıldız', 'R. Nikandish', 'W. Xia', 'S. Rangan', 'E. Erkip', 'H. Rahmani'],
      venue: 'Accepted at IEEE Asilomar Conference on Signals, Systems, and Computers',
      year: 2026,
      type: 'conference',
      topic: 'Hardware constrained optimization'
    },
    {
      title: 'Hardware Constrained Receiver Under Strong Structured Interference',
      authors: ['O. Yıldız', 'S. Rangan', 'H. Rahmani', 'E. Erkip'],
      venue: 'Submitted to IEEE Transactions on Wireless Communications',
      year: 2026,
      type: 'journal',
      topic: 'Hardware constrained optimization'
    },
    {
      title: '3D Beamforming Through Joint Phase-Time Arrays',
      authors: ['O. Yıldız', 'A. AlAmmouri', 'J. Mo', 'Y. Nam', 'E. Erkip', 'J. Zhang'],
      venue: 'IEEE Vehicular Technology Conference (VTC)',
      year: 2024,
      type: 'conference',
      topic: 'Frequency dependent beamforming',
      url: 'https://ieeexplore.ieee.org/abstract/document/10757955',
      abstract:
        'High-frequency wideband cellular communications over mmWave and sub-THz offer the opportunity for high data rates. However, it also presents high path loss, resulting in limited coverage. High-gain beamforming from the antenna array is essential to mitigate the coverage limitations. The conventional phased antenna arrays (PAA) cause high scheduling latency owing to analog beam constraints, i.e., only one frequency-flat beam is generated. Recently introduced joint phase-time array (JPTA) architecture, which utilizes both true-time-delay (TTD) units and phase shifters (PSs), alleviates analog beam constraints by creating multiple frequency-dependent beams for scheduling multiple users at different directions in a frequency-division manner. This paper presents a novel 3D beamforming design that maximizes beamforming gain toward desired azimuth and elevation directions and across sub-bands partitioned according to scheduled users’ bandwidth requirements. We provide analytical solutions and iterative algorithms to design the PSs and TTD units for a desired subband beam pattern.'
    },
    {
      title:
        'Investigation and Optimization of Secrecy Capacity for Intelligent Reflective Surfaces-Assisted Secure mmWave Indoor Wireless Communication',
      authors: ['O. Yıldız', 'M. Alavirad', 'T. Singh'],
      venue: 'IEEE Radio and Wireless Symposium (RWS)',
      year: 2023,
      type: 'conference',
      topic: 'Intelligent reflective surfaces',
      url: 'https://ieeexplore.ieee.org/abstract/document/10046340',
      extras: [{ label: 'Slides', url: 'files/RIS_pres.pdf' }],
      abstract:
        'This paper investigates the secrecy performance of an intelligent reflective surface (IRS)-assisted 28 GHz indoor system where the IRS is capable of adjusting the direction and phase shift of reflected signal on its surface and assists a source to communicate with an authenticated user in the presence of a passive eavesdropper. We propose the design of a tile-allocation-and-phase-shift-adjustment strategy for the IRS to optimize the secrecy capacity. In addition to the alignment strategy, the optimal placement to achieve the maximum secrecy capacity is also evaluated through a ray-tracing algorithm.'
    },
    {
      title: 'Pathfinding Neural Cellular Automata',
      authors: ['S. Earle', 'O. Yıldız', 'J. Togelius', 'C. Hegde'],
      venue: 'arXiv:2301.06820',
      year: 2023,
      type: 'preprint',
      topic: 'Neural network learning capability',
      url: 'https://arxiv.org/abs/2301.06820',
      abstract:
        'Pathfinding makes up an important sub-component of a broad range of complex tasks in AI, such as robot path planning, transport routing, and game playing. While classical algorithms can efficiently compute shortest paths, neural networks could be better suited to adapting these sub-routines to more complex and intractable tasks. We hand-code and learn models for Breadth-First Search using the unified architectural framework of Neural Cellular Automata. We find that adversarially evolving mazes leads to increased generalization on out-of-distribution examples.'
    },
    {
      title: 'Federated Spatial Reuse Optimization in Next-Generation Decentralized IEEE 802.11 WLANs',
      authors: [
        'F. Wilhelmi', 'J. Hribar', 'S. F. Yilmaz', 'E. Ozfatura', 'K. Ozfatura', 'O. Yıldız',
        'D. Gündüz', 'H. Chen', 'X. Ye', 'L. You', 'Y. Shao', 'P. Dini', 'B. Bellalta'
      ],
      venue: 'ITU Journal on Future and Evolving Technologies (ITU J-FET)',
      year: 2022,
      type: 'journal',
      topic: 'Federated learning',
      url: 'https://arxiv.org/abs/2203.10472',
      abstract:
        'As wireless standards evolve, more complex functionalities are introduced to address the increasing requirements in terms of throughput, latency, security, and efficiency. In this paper, we explore the feasibility of applying ML in next-generation wireless local area networks. More specifically, we focus on the IEEE 802.11ax spatial reuse problem and predict its performance through federated learning models. The set of FL solutions overviewed in this work is part of the 2021 International Telecommunication Union AI for 5G Challenge.'
    },
    {
      title: 'Hybrid Beam Alignment for Multi-Path Channels: A Group Testing Viewpoint',
      authors: ['O. Yıldız', 'A. Khalili', 'E. Erkip'],
      venue: 'IEEE Asilomar Conference on Signals, Systems, and Computers',
      year: 2022,
      type: 'conference',
      topic: 'Beam alignment',
      url: 'https://ieeexplore.ieee.org/abstract/document/10051965',
      extras: [
        { label: 'Slides', url: 'files/BA_pres.pdf' },
        { label: 'Poster', url: 'files/BA_poster.pdf' }
      ],
      abstract:
        'High-frequency bands such as millimeter-wave and terahertz require narrow beams due to path loss and shadowing. Beam alignment methods allow the transceivers to adjust the directions of these beams efficiently by exploiting the channel sparsity at high frequencies. This paper investigates BA for an uplink scenario where the channel between the user equipment and base station consists of multiple paths. To minimize the expected BA duration, a group testing framework is devised, and the associated novel analog and hybrid BA strategies are described.'
    },
    {
      title: 'Power Allocation and Temporal Fair User Group Scheduling for Downlink NOMA',
      authors: ['E. Erturk', 'O. Yıldız', 'S. Shahsavari', 'N. Akar'],
      venue: 'Telecommunication Systems, vol. 77, pp. 753 to 766',
      year: 2021,
      type: 'journal',
      topic: 'Non-orthogonal multiple access',
      url: 'https://link.springer.com/article/10.1007/s11235-021-00786-x',
      abstract:
        'Non-Orthogonal Multiple Access has been proposed as a new radio access technique for cellular networks as an alternative to Orthogonal Multiple Access, in which the users of a group are allowed to use the wireless channel simultaneously. For downlink single-input single-output SISO-NOMA, a heuristic power allocation algorithm within a group is first proposed which attempts to ensure that the users of a group benefit from simultaneous transmission equally in terms of achievable throughput.'
    }
  ];

  P.data.patents = [
    {
      title: '3D Beamforming Through Joint Phase-Time Arrays',
      authors: ['O. Yıldız', 'A. AlAmmouri', 'J. Mo', 'Y. Nam'],
      number: 'U.S. Patent App. 18/811,643',
      filed: 'Filed August 2024, pending',
      url: 'https://patents.google.com/patent/US20250070847A1/en'
    },
    {
      title: 'Increasing Secrecy Capacity for Intelligent Reflective Surface-Assisted Wireless Communications',
      authors: ['O. Yıldız', 'M. Alavirad', 'T. Singh'],
      number: 'U.S. Patent App. 18/469,724',
      filed: 'Filed September 2023, pending',
      url: 'https://patents.google.com/patent/US20240098516A1/en'
    }
  ];

  P.data.teaching = [
    {
      course: 'Introduction to Probability and Stochastic Processes',
      school: 'NYU Tandon',
      role: 'Teaching assistant',
      note: 'With Prof. Elza Erkip. Graduate core course.'
    },
    {
      course: 'Machine Learning',
      school: 'NYU Tandon',
      role: 'Teaching assistant',
      note: 'With Prof. Christopher Musco.'
    },
    {
      course: 'Algorithms and Programming 1',
      school: 'Bilkent University',
      role: 'Teaching assistant',
      note: 'Undergraduate, first-year programming.'
    },
    {
      course: 'Microprocessors',
      school: 'Bilkent University',
      role: 'Teaching assistant',
      note: 'Undergraduate, hardware and assembly.'
    }
  ];

  P.data.talks = [
    {
      title: 'Hybrid Beam Alignment for Multi-Path Channels: A Group Testing Viewpoint',
      venue: 'IEEE Asilomar Conference on Signals, Systems, and Computers',
      year: 2022,
      kind: 'Conference talk and poster',
      links: [
        { label: 'Slides', url: 'files/BA_pres.pdf' },
        { label: 'Poster', url: 'files/BA_poster.pdf' }
      ]
    },
    {
      title: 'Investigation and Optimization of Secrecy Capacity for IRS-Assisted Secure mmWave Indoor Wireless Communication',
      venue: 'IEEE Radio and Wireless Symposium',
      year: 2023,
      kind: 'Conference talk',
      links: [{ label: 'Slides', url: 'files/RIS_pres.pdf' }]
    },
    {
      title: 'ML-based optimization of 3D frequency-dependent beamforming',
      venue: 'Samsung Research America intern symposium',
      year: 2023,
      kind: 'Poster',
      award: 'Best Poster Award among all intern final presentations'
    }
  ];

  P.data.thesis = {
    title: 'Hardware-Aware Design and Optimization for Millimeter Wave and Sub-Terahertz Wireless Systems',
    school: 'NYU Tandon School of Engineering',
    year: 2025,
    advisor: 'Prof. Elza Erkip'
  };

  /* ----------------------------------------------------------------- skills */

  P.data.skillGroups = [
    {
      name: 'ML & AI',
      skills: [
        'PyTorch', 'Hugging Face Transformers', 'RLHF', 'DPO', 'SFT', 'Reward Modeling',
        'LLM Post-training', 'AI Agents', 'Agent Evaluation', 'Benchmark Design',
        'LLM-as-a-Judge', 'Multimodal Models', 'Prompt Engineering', 'Computer Vision', 'TensorFlow'
      ]
    },
    {
      name: 'Systems & Infra',
      skills: [
        'Python', 'SQL', 'Async / Concurrent Systems', 'Distributed Training (torch.distributed)',
        'CUDA', 'HPC / GPU Clusters', 'Workflow Orchestration', 'Distributed Storage',
        'Linux', 'C/C++', 'Java'
      ]
    },
    {
      name: 'Research Tools',
      skills: ['MATLAB', 'Simulink', '5G NR Toolbox', 'Ray Tracing Toolbox']
    }
  ];

  /* ------------------------------------------------------------------ radar */

  /* Six axes chosen to span both halves of the career, so the shape stays
   * comparable from the Bilkent years through to the agent work. These are the
   * share of day-to-day work, not a competence score. */
  P.data.radarAxes = [
    'Wireless & Signal Processing',
    'ML & Deep Learning',
    'Systems & Infra',
    'Evaluation & Benchmarking',
    'Multimodal AI',
    'Agents & Tooling'
  ];

  P.data.radarMax = 10;

  /* -------------------------------------------------------------- timeline */

  /* values[] lines up index-for-index with radarAxes above. */
  P.data.timeline = [
    {
      year: '2015',
      title: 'B.Sc. begins at Bilkent',
      org: 'Bilkent University, Ankara',
      values: [4, 2, 3, 1, 0, 0],
      detail:
        'B.Sc. in Electrical and Electronics Engineering on a full fellowship, after ranking 215th out of roughly two million in the national university placement exam. Graduated with a 3.83 GPA. Teaching assistant for Algorithms and Programming 1 and for Microprocessors.'
    },
    {
      year: '2019',
      title: 'Erasmus exchange',
      org: 'University of Erlangen-Nuremberg, Germany',
      values: [5, 3, 3, 1, 0, 0],
      detail:
        'Six months at the University of Erlangen-Nuremberg on an Erasmus+ scholarship, March to August 2019. Courses: Image and Video Compression, Mobile Communications, Optimization for Engineers, Speech and Audio Signal Processing, plus German A2.1 and A2.2.'
    },
    {
      year: '2020',
      title: 'Ph.D. begins at NYU Tandon',
      org: 'NYU Wireless, advised by Prof. Elza Erkip',
      values: [6, 4, 3, 2, 1, 0],
      detail:
        'Started the Ph.D. on a School of Engineering Fellowship, advised by Prof. Elza Erkip. Research on deep neural networks for nonlinear channel capacity estimation under hardware constraints with Prof. Sundeep Rangan, group testing for beam alignment, and neural architectures for semantic joint source-channel coding with Prof. Yao Wang. Teaching assistant for Probability and Stochastic Processes with Prof. Erkip and for Machine Learning with Prof. Christopher Musco.'
    },
    {
      year: '2021',
      title: 'Intern at InterDigital',
      org: 'R&I Intern, New York',
      values: [7, 5, 4, 3, 1, 0],
      detail:
        'Research and Innovation intern, June to August 2021. Evaluated non-linear waveform spectral performance and developed a waveform energy KPI for high-frequency wireless communications. Supervised by Dr. Ramon Khalona.'
    },
    {
      year: '2022',
      title: 'Intern at Dell, first patent filed',
      org: 'Graduate Research Intern, New York',
      values: [8, 6, 4, 3, 1, 0],
      detail:
        'Graduate research intern, June to August 2022. ML-based optimization of secrecy capacity in IRS-assisted mmWave indoor systems, supervised by Dr. Tejinder Singh. The work became U.S. Patent App. 18/469,724 and a paper at IEEE RWS 2023.'
    },
    {
      year: '2023',
      title: 'Samsung Research America, Best Poster Award',
      org: 'Graduate Research Intern, Dallas',
      values: [9, 7, 5, 4, 2, 0],
      detail:
        'Graduate research intern, June to August 2023, supervised by Dr. Jianhua Mo and Dr. Ahmad AlAmmouri. ML-based optimization of 3D frequency-dependent beamforming using true time delay elements and phase shifters. Received the Best Poster Award among all intern final presentations. The work became a paper at IEEE VTC 2024 and U.S. Patent App. 18/811,643.'
    },
    {
      year: '2024',
      title: 'Meta AR/VR internship',
      company: 'Meta',
      org: 'Reality Labs, Burlingame',
      values: [8, 8, 6, 5, 6, 1],
      detail:
        'PhD software engineer intern at Meta Reality Labs, June to August 2024, supervised by Dr. Margarita Grinvald. Built an end-to-end ML inpainting model for depth and texture synthesis at disocclusion regions in AR passthrough rendering, and integrated it into a production pipeline.'
    },
    {
      year: '2025',
      title: 'Ph.D. completed',
      org: 'NYU Tandon, August 2025',
      values: [7, 8, 6, 6, 6, 2],
      detail:
        'Five years of Ph.D. work on hardware-aware design for millimeter wave and sub-terahertz wireless systems with Prof. Elza Erkip. Committee members are Prof. Sundeep Rangan and Prof. Hamed Rahmani. Graduated with a 3.93 GPA.',
      photos: [
        { src: 'defense', alt: 'Presenting at my thesis defense, with the committee joining on screen' },
        { src: 'graduation', alt: 'Graduation at NYU with my advisor, Prof. Elza Erkip, and labmates' }
      ]
    },
    {
      year: '2025',
      title: 'Joined Meta full-time',
      company: 'Meta',
      org: 'Research Scientist, Multimodal AI, Ray-Ban Glasses',
      values: [5, 9, 8, 8, 9, 4],
      detail:
        'Joined Meta in September 2025 as a Research Scientist on the Multimodal AI team for Ray-Ban Meta Glasses. Post-training multimodal models across text, vision and audio, the async data curation pipeline behind them, and the LLM-as-a-judge framework used to grade the output and as an RL reward signal.'
    },
    {
      year: '2026',
      title: 'Moved teams inside Meta',
      company: 'Meta',
      org: 'Research Scientist, Agent Data & Optimization',
      values: [3, 9, 9, 10, 7, 9],
      detail:
        'Moved from the Multimodal AI team to Agent Data & Optimization in May 2026, staying at Meta. Working on context sharing between AI coding agents, and on the benchmark tasks and evaluation frameworks used to measure whether an agent has actually improved.',
      current: true
    }
  ];

  /* --------------------------------------------------------------- off duty */

  /* Cards with a `gallery` show arrows and dots to step through their photos.
   * `poke` marks a card that throws confetti when you click the image. */
  P.data.offDuty = [
    {
      kind: 'plants',
      title: 'Plants',
      poke: true,
      pokeLabel: 'tap me',
      gallery: [
        {
          src: 'plant-shelf',
          alt: 'An orchid, a ZZ plant in a mirrored disco ball pot, and a trailing pothos',
          caption: 'Orchid, ZZ plant, pothos.'
        },
        {
          src: 'plant-windowsill',
          alt: 'A snake plant, a red moon cactus and a kalanchoe on a windowsill above a rainy street',
          caption: 'Snake plant, moon cactus, kalanchoe.'
        },
        {
          src: 'plant-palm',
          alt: 'A parlor palm with wide green fronds filling the frame',
          caption: 'The palm. Bought small. Regrets: none.'
        }
      ],
      back:
        'New skill unlocked: extended into eleven plants and have not lost one yet. I am patient with their growth.'
    },
    {
      kind: 'photo',
      image: 'volleyball',
      title: 'Pier Pressure',
      poke: true,
      pokeLabel: 'tap me',
      quips: [
        'Point.',
        'That was in.',
        'Rotate.',
        'Nice dig.',
        'Called it out. It was in.'
      ],
      alt: 'My volleyball team in pink Volo jerseys on a sand court with the Manhattan skyline behind us',
      back:
        'Beach volleyball at the pier, in the rain, in three layers, whenever the season says so. We show up.'
    },
    {
      kind: 'gallery',
      title: 'Hiking',
      poke: true,
      pokeLabel: 'tap me',
      quips: [
        'Fifteen more minutes.',
        'Summit-ish.',
        'The dog is faster than all of us.',
        'Snack break, obviously.',
        'One more switchback.'
      ],
      gallery: [
        {
          src: 'hike-bay',
          alt: 'Sitting on a rock at the top of a trail, looking out over a bay',
          caption: 'Top of the trail. Earned it.'
        },
        {
          src: 'hike-trail',
          alt: 'Walking an autumn trail with friends and a dog, leaves everywhere',
          caption: 'Autumn trail, with the dog setting the pace.'
        }
      ],
      back:
        'The part I like is the middle, when it stops being scenic and becomes a long argument with yourself. I usually win.'
    },
    {
      kind: 'link',
      image: 'film',
      title: 'Film photography',
      poke: true,
      pokeLabel: 'tap me',
      quips: [
        'Click. Wound on.',
        'That one is probably blurry.',
        'Twelve frames left.',
        'See you in three weeks.',
        'Light leak. On purpose.'
      ],
      alt: 'A grainy film photograph of a church tower against a dusk sky',
      back:
        'Thirty-six frames, no second chances, and a mystery until the roll comes back.',
      url: 'https://instagram.com/c_ozy_film?igshid=OGQ5ZDc2ODk2ZA%3D%3D&utm_source=qr',
      linkLabel: 'More on Instagram'
    },
    {
      kind: 'book',
      title: 'Reading',
      image: 'book',
      fit: 'contain',
      alt: 'Cover of Sublimation by Isabel J. Kim',
      poke: true,
      pokeLabel: 'tap me',
      quips: [
        'Page forty.',
        'One more chapter.',
        'Borrowed. Not returned.',
        'Read that line twice.',
        'Bookmark: a receipt.'
      ],
      back:
        'Sublimation, by Isabel J. Kim. Science fiction mostly, with a detour through psychology.'
    },
  ];

  /* Rotating one-liners for the plant confetti burst. */
  P.data.plantQuips = [
    'Watered. Probably.',
    'It grew toward the window again.',
    'Repotted under protest.',
    'Still alive. Eleven for eleven.',
    'New leaf. Big day.'
  ];

  /* --------------------------------------------------------------- what next */

  P.data.aspirations = {
    intro:
      'Three things I want the next stretch of work to look like.',
    goals: [
      {
        icon: 'bridge',
        title: 'Sit where research and product meet',
        body:
          'The best questions I have worked on did not come from a paper. They came from something being visibly wrong in front of a user, and then turning out to be a hard problem underneath. I want to keep working at that boundary: close enough to the product to know which problems matter, and close enough to the research to answer them properly rather than patch them.'
      },
      {
        icon: 'spark',
        title: 'Make the models actually better',
        body:
          'It is easy to move a number and change nothing real. I would rather find where a model is genuinely weak, the failure that keeps showing up once it meets real users and real languages, and fix that. That means being honest about what a benchmark is and is not telling you, which is most of what I do now.'
      },
      {
        icon: 'compass',
        title: 'Get better at choosing the question',
        body:
          'Picking the problem is the part that decides whether any of the work matters, and it is the part I most want to get better at. I want to get better at spotting which investigation is worth running before it is obvious, and at saying clearly and early when something is not worth another three months.'
      }
    ],
    closing:
      'If you are working on any of this, I would like to hear about it.'
  };

  /* ---------------------------------------------------------------- contact */

  P.data.education = [
    {
      degree: 'Ph.D., Electrical and Computer Engineering',
      school: 'NYU Tandon School of Engineering',
      period: '2020 to 2025',
      note: 'GPA 3.93/4.0. School of Engineering Fellowship. Advised by Prof. Elza Erkip.'
    },
    {
      degree: 'B.Sc., Electrical and Electronics Engineering',
      school: 'Bilkent University, Ankara',
      period: '2015 to 2020',
      note: 'GPA 3.83/4.0. Fellowship student, ranked 215 out of roughly two million nationally.'
    }
  ];
})(window.Portfolio = window.Portfolio || {});
