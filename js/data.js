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
    name: 'Ozlem Yıldız',
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
      'I am a research scientist at Meta, where I work on how AI coding agents share what they learn. Right now that means two things: a plugin that carries context between agents so they stop re-failing problems another agent already solved, and the benchmark tasks and evaluation frameworks that decide whether any of it actually worked.',
      'Before that I spent a year post-training multimodal models for Ray-Ban Meta glasses, across text, vision and audio in 11 languages. I built the data curation pipeline behind it and the LLM-as-a-judge system that graded its output, which then got reused as the reward signal for RL.',
      'I have a Ph.D. in Electrical and Computer Engineering from NYU Tandon, advised by Prof. Elza Erkip. I started in wireless: beam alignment, hardware-constrained receivers, information theory. Somewhere between a passthrough-rendering internship and a pile of translation evals, I ended up here. The through line is that I like problems where nobody has agreed yet on what counts as a correct answer.'
    ],
    stats: [
      { value: 8, label: 'publications', note: 'Two of them still say "submitted" and I check the portal weekly.' },
      { value: 2, label: 'patents pending', note: 'Both from summer internships, which still surprises me.' },
      { value: 11, label: 'languages shipped', note: 'I only speak two of them.' },
      { value: 5, label: 'years of research', note: '2020 to 2025, NYU Wireless.' }
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
      'Designed benchmark tasks and evaluation frameworks for AI coding agents, turning "good agentic coding behavior" into reproducible criteria you can actually measure instead of argue about.'
    ],
    pipeline: ['Task design', 'Agent execution', 'Evaluation', 'Scoring']
  };

  P.data.previousWork = [
    {
      org: 'Meta',
      title: 'Research Scientist, Multimodal AI',
      project: 'Ray-Ban Meta Glasses',
      period: 'September 2025 to May 2026',
      location: 'New York, NY',
      teaser: 'Post-training multimodal models for glasses people actually wear.',
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
      teaser: 'Filling in the pixels a headset cannot see.',
      supervisor: 'Supervised by Dr. Margarita Grinvald',
      points: [
        'Delivered an end-to-end ML inpainting model for depth and texture synthesis at disocclusion regions, the gaps that appear when the camera view gets reprojected to where your eye actually is.',
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
        'Electrical and Electronics Engineering on a full fellowship, after ranking 215th out of about two million in the national placement exam. Graduated with a 3.83 GPA. Taught Algorithms and Programming 1 and Microprocessors along the way.'
    },
    {
      year: '2019',
      title: 'Erasmus exchange',
      org: 'University of Erlangen-Nuremberg, Germany',
      values: [5, 3, 3, 1, 0, 0],
      detail:
        'Six months in Germany on an Erasmus+ scholarship, March to August. First time doing engineering in a language I was still learning.'
    },
    {
      year: '2020',
      title: 'Ph.D. begins at NYU Tandon',
      org: 'NYU Wireless, advised by Prof. Elza Erkip',
      values: [6, 4, 3, 2, 1, 0],
      detail:
        'School of Engineering Fellowship. Research on deep neural networks for nonlinear channel capacity estimation under hardware constraints, group testing for beam alignment, and neural architectures for semantic joint source-channel coding. Taught Probability and Stochastic Processes with Prof. Erkip and Machine Learning with Prof. Musco.'
    },
    {
      year: '2021',
      title: 'Intern at InterDigital',
      org: 'R&I Intern, New York',
      values: [7, 5, 4, 3, 1, 0],
      detail:
        'Evaluated non-linear waveform spectral performance and developed a waveform energy KPI for high-frequency wireless. Supervised by Dr. Ramon Khalona.'
    },
    {
      year: '2022',
      title: 'Intern at Dell, first patent filed',
      org: 'Graduate Research Intern, New York',
      values: [8, 6, 4, 3, 1, 0],
      detail:
        'ML-based optimization of secrecy capacity in IRS-assisted mmWave indoor systems. Turned into a U.S. patent application and an RWS paper. Supervised by Dr. Tejinder Singh.'
    },
    {
      year: '2023',
      title: 'Samsung Research America, Best Poster Award',
      org: 'Graduate Research Intern, Dallas',
      values: [9, 7, 5, 4, 2, 0],
      detail:
        'ML-based optimization of 3D frequency-dependent beamforming using true time delay elements and phase shifters. Won Best Poster among all intern final presentations, and the work became a VTC 2024 paper and a second patent application. Supervised by Dr. Jianhua Mo and Dr. Ahmad AlAmmouri.'
    },
    {
      year: '2024',
      title: 'Meta AR/VR internship',
      org: 'Reality Labs, Burlingame',
      values: [8, 8, 6, 5, 6, 1],
      detail:
        'End-to-end ML inpainting for depth and texture synthesis in AR passthrough rendering, integrated into a production pipeline. This is the point where the work stopped being about radios and started being about pixels and models.'
    },
    {
      year: '2025',
      title: 'Ph.D. completed',
      org: 'NYU Tandon, August 2025',
      values: [7, 8, 6, 6, 6, 2],
      detail:
        'Five years, one thesis on hardware-aware design for millimeter wave and sub-terahertz systems, and a defense where half the committee joined on screen. Advised by Prof. Elza Erkip.',
      photos: [
        { src: 'defense', alt: 'Presenting at my thesis defense, with the committee joining on screen' },
        { src: 'graduation', alt: 'Graduation at NYU with my advisor, Prof. Elza Erkip, and labmates' }
      ]
    },
    {
      year: '2025',
      title: 'Joined Meta full-time',
      org: 'Research Scientist, Ray-Ban Meta Glasses',
      values: [5, 9, 8, 8, 9, 4],
      detail:
        'Started in September on multimodal post-training for smart glasses: translation quality across 11 languages, the data pipeline feeding it, and the LLM-as-a-judge system grading the output.'
    },
    {
      year: '2026',
      title: 'Agent Data & Optimization',
      org: 'Meta, New York',
      values: [3, 9, 9, 10, 7, 9],
      detail:
        'Context sharing between coding agents, plus the benchmarks and evaluation frameworks that tell us whether an agent is genuinely better or just better at looking busy.',
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
      gallery: [
        {
          src: 'plant-shelf',
          alt: 'A ZZ plant in a mirrored disco ball pot, beside an orchid and a trailing pothos',
          caption: 'ZZ plant, in a disco ball. Obviously.'
        },
        {
          src: 'plant-windowsill',
          alt: 'A snake plant, a red moon cactus and a jade plant on a windowsill above a rainy street',
          caption: 'Snake plant, moon cactus, jade.'
        },
        {
          src: 'plant-palm',
          alt: 'A parlor palm with wide green fronds filling the frame',
          caption: 'The palm. Bought small. Regrets: none.'
        }
      ],
      back:
        'Eleven of them, and I have never lost one, which I bring up more often than anyone wants. The moon cactus is the interesting one: the red part cannot photosynthesise at all, so it lives entirely off the green stem it is grafted onto.'
    },
    {
      kind: 'photo',
      image: 'volleyball',
      title: 'Pier Pressure',
      alt: 'My volleyball team in pink Volo jerseys on a sand court with the Manhattan skyline behind us',
      back:
        'Our Volo team, on sand at the pier with the skyline behind us. We named ourselves before we found out how we would play. The name is still the strongest part of our game.'
    },
    {
      kind: 'gallery',
      title: 'Hiking',
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
        'Most weekends, somewhere upstate. I am the one who says the summit is fifteen minutes away when it is fifty.'
    },
    {
      kind: 'link',
      image: 'film',
      title: 'Film photography',
      alt: 'A grainy film photograph of a church tower against a dusk sky',
      back:
        'Thirty-six frames and no screen on the back. I shoot a roll, forget what is on it, and get it back weeks later like a message from someone else.',
      url: 'https://instagram.com/c_ozy_film?igshid=OGQ5ZDc2ODk2ZA%3D%3D&utm_source=qr',
      linkLabel: 'More on Instagram'
    },
    {
      kind: 'book',
      title: 'Reading',
      icon: 'book',
      front: 'Sublimation, Isabel J. Kim',
      back:
        'Science fiction, mostly, with a detour through psychology. I finish about half of what I start and refuse to feel bad about it.'
    },
    {
      kind: 'list',
      title: 'Climbing and yoga',
      icon: 'mountain',
      front: 'Indoors, when the weather wins',
      back:
        'Climbing is the one that transfers. You fail the same move eleven times, change one small thing, and suddenly it goes. That is most of research, with better shoes.'
    }
  ];

  /* Rotating one-liners for the plant confetti burst. */
  P.data.plantQuips = [
    'Watered. Probably.',
    'Photosynthesis: still undefeated.',
    'This one has outlived three laptops.',
    'No notes. Perfect plant.',
    'Repotted under protest.',
    'It grew toward the window again.',
    'Certified low maintenance, unlike the benchmark suite.'
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
          'The best questions I have worked on did not come from a paper. They came from something being visibly wrong in front of a user, and then turning out to be genuinely hard underneath. I want to keep standing at that seam: close enough to the product to know what actually matters, close enough to the research to answer it properly instead of patching it.'
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
          'Picking the problem is the part that decides whether any of the work matters, and it is the part I most want to get better at. I want to be the person who notices the investigation worth running before it is obvious, and who can say early and clearly when something is not worth the next three months.'
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
