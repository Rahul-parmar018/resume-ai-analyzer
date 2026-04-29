"""
Production role templates for resume analysis.
Each role has a real-world JD and key_skills for accurate matching.
"""

ROLE_TEMPLATES = {
    # ── Engineering ─────────────────────────────
    "frontend_developer": {
        "title": "Frontend Developer", "category": "Engineering",
        "jd": "Build responsive web applications using React, Next.js, TypeScript. Implement UI/UX designs, optimize performance, write tests with Jest/Cypress, and manage state with Redux/Zustand. Experience with REST/GraphQL APIs, CI/CD, accessibility (WCAG), and design systems required.",
        "key_skills": ["React","TypeScript","Next.js","JavaScript","CSS3","Redux","Jest","GraphQL","Webpack","Git","HTML5","Tailwind","SASS","Figma","Responsive Design"]
    },
    "backend_developer": {
        "title": "Backend Developer", "category": "Engineering",
        "jd": "Design and build scalable backend services using Python/Django/FastAPI or Node.js/Express. Implement RESTful APIs, manage PostgreSQL/MongoDB databases, set up Redis caching, containerize with Docker, deploy on AWS/GCP. Experience with microservices, message queues, OAuth/JWT authentication, and CI/CD pipelines.",
        "key_skills": ["Python","Django","Node.js","PostgreSQL","Docker","AWS","Redis","REST API","Microservices","CI/CD","FastAPI","MongoDB","RabbitMQ","Kafka","Linux"]
    },
    "fullstack_developer": {
        "title": "Full Stack Developer", "category": "Engineering",
        "jd": "Develop end-to-end web applications with React/Next.js frontend and Python/Node.js backend. Manage databases, implement authentication, deploy via Docker/Kubernetes on cloud platforms. Strong understanding of system design, API architecture, and agile development.",
        "key_skills": ["React","Python","Node.js","TypeScript","PostgreSQL","Docker","AWS","REST API","Git","MongoDB","Next.js","Express","Django","Kubernetes","Agile"]
    },
    "mobile_developer": {
        "title": "Mobile Developer", "category": "Engineering",
        "jd": "Build cross-platform mobile apps with React Native or Flutter, or native iOS/Android with Swift/Kotlin. Implement push notifications, offline storage, app store deployment, and performance profiling.",
        "key_skills": ["React Native","Flutter","Swift","Kotlin","Firebase","REST API","Git","TypeScript","Redux","App Store","Google Play","SQLite","Push Notifications","CI/CD","Xcode"]
    },
    "devops_engineer": {
        "title": "DevOps Engineer", "category": "Engineering",
        "jd": "Manage cloud infrastructure on AWS/GCP/Azure. Implement CI/CD pipelines with Jenkins/GitHub Actions, containerize with Docker/Kubernetes, automate with Terraform/Ansible, and monitor with Prometheus/Grafana/Datadog.",
        "key_skills": ["AWS","Docker","Kubernetes","Terraform","CI/CD","Linux","Jenkins","Prometheus","Ansible","Grafana","Python","Bash","Helm","ArgoCD","CloudFormation"]
    },
    "sre_engineer": {
        "title": "Site Reliability Engineer", "category": "Engineering",
        "jd": "Ensure system reliability with 99.9%+ uptime. Implement monitoring, alerting, incident response, capacity planning, and chaos engineering. Automate toil reduction and manage infrastructure as code.",
        "key_skills": ["Kubernetes","Docker","Prometheus","Grafana","AWS","Terraform","Python","Linux","SLO","SLI","Incident Management","PagerDuty","Datadog","Go","Bash"]
    },
    "qa_engineer": {
        "title": "QA Engineer", "category": "Engineering",
        "jd": "Design and execute test plans, automate testing with Selenium/Cypress/Playwright, perform API testing with Postman, implement CI/CD test pipelines, and track defects in Jira.",
        "key_skills": ["Selenium","Cypress","Playwright","Postman","Jira","Python","JavaScript","API Testing","CI/CD","Git","Test Automation","Performance Testing","SQL","Jenkins","Agile"]
    },
    "security_engineer": {
        "title": "Security Engineer", "category": "Engineering",
        "jd": "Implement application and infrastructure security. Conduct penetration testing, vulnerability assessments, implement IAM policies, manage SIEM tools, and ensure compliance with SOC2/ISO27001.",
        "key_skills": ["Penetration Testing","OWASP","AWS Security","IAM","SIEM","Python","Linux","Firewall","Encryption","SOC2","ISO27001","Burp Suite","Terraform","Docker","Incident Response"]
    },
    "platform_engineer": {
        "title": "Platform Engineer", "category": "Engineering",
        "jd": "Build and maintain internal developer platforms. Create self-service tooling, manage Kubernetes clusters, implement service meshes, and optimize developer experience and deployment workflows.",
        "key_skills": ["Kubernetes","Docker","Terraform","AWS","Go","Python","Service Mesh","Istio","ArgoCD","Helm","CI/CD","Linux","Platform Engineering","IaC","Observability"]
    },
    "embedded_engineer": {
        "title": "Embedded Systems Engineer", "category": "Engineering",
        "jd": "Develop firmware and embedded software for IoT devices using C/C++. Interface with sensors, protocols (SPI/I2C/UART), RTOS, and hardware debugging tools.",
        "key_skills": ["C","C++","RTOS","Embedded Linux","ARM","SPI","I2C","UART","Python","Git","IoT","Firmware","PCB","Oscilloscope","Microcontrollers"]
    },
    "blockchain_developer": {
        "title": "Blockchain Developer", "category": "Engineering",
        "jd": "Develop smart contracts on Ethereum/Solana, build DApps with Web3.js/Ethers.js, implement DeFi protocols, and audit contract security. Experience with Solidity, Rust, and consensus mechanisms.",
        "key_skills": ["Solidity","Ethereum","Web3.js","Smart Contracts","Rust","DeFi","NFT","Hardhat","Truffle","TypeScript","React","Node.js","IPFS","Blockchain","Cryptography"]
    },
    "game_developer": {
        "title": "Game Developer", "category": "Engineering",
        "jd": "Develop games using Unity or Unreal Engine. Implement game mechanics, physics, AI behaviors, multiplayer networking, and optimize performance for target platforms.",
        "key_skills": ["Unity","Unreal Engine","C#","C++","3D Graphics","Physics Engine","Multiplayer","Game Design","Shader Programming","Git","Blender","OpenGL","DirectX","AI","Animation"]
    },
    # ── Data & AI ───────────────────────────────
    "data_scientist": {
        "title": "Data Scientist", "category": "Data & AI",
        "jd": "Apply statistical analysis and machine learning to solve business problems. Build predictive models, conduct A/B tests, create visualizations with Matplotlib/Tableau, and communicate insights to stakeholders.",
        "key_skills": ["Python","Machine Learning","TensorFlow","SQL","Statistics","Pandas","Scikit-learn","Tableau","A/B Testing","Deep Learning","NLP","R","Jupyter","Feature Engineering","Data Visualization"]
    },
    "ml_engineer": {
        "title": "ML Engineer", "category": "Data & AI",
        "jd": "Build and deploy machine learning models at scale. Design ML pipelines, implement model serving with TensorFlow Serving/TorchServe, manage MLflow/Kubeflow, optimize model performance, and monitor model drift in production.",
        "key_skills": ["Python","TensorFlow","PyTorch","MLflow","Kubeflow","Docker","Kubernetes","AWS SageMaker","Scikit-learn","SQL","Feature Engineering","Model Serving","CI/CD","Spark","MLOps"]
    },
    "ai_engineer": {
        "title": "AI/ML Engineer", "category": "Data & AI",
        "jd": "Design and implement AI systems including LLMs, computer vision, and NLP pipelines. Fine-tune foundation models, build RAG systems, implement vector databases, and deploy AI APIs at scale.",
        "key_skills": ["Python","LLM","GPT","Transformers","PyTorch","TensorFlow","LangChain","Vector Database","RAG","NLP","Computer Vision","Hugging Face","Docker","AWS","FastAPI"]
    },
    "data_engineer": {
        "title": "Data Engineer", "category": "Data & AI",
        "jd": "Design and maintain data pipelines using Spark/Airflow. Build data warehouses, implement ETL processes, manage data lakes on cloud platforms, and ensure data quality and governance.",
        "key_skills": ["Python","Apache Spark","Airflow","SQL","AWS","Snowflake","Kafka","dbt","ETL","Data Warehouse","Redshift","BigQuery","Docker","Terraform","Data Modeling"]
    },
    "data_analyst": {
        "title": "Data Analyst", "category": "Data & AI",
        "jd": "Analyze business data to identify trends and insights. Create dashboards in Tableau/Power BI, write SQL queries, perform statistical analysis, and present findings to stakeholders.",
        "key_skills": ["SQL","Python","Tableau","Power BI","Excel","Statistics","Data Visualization","A/B Testing","Google Analytics","Pandas","R","Jupyter","Looker","ETL","Business Intelligence"]
    },
    "nlp_engineer": {
        "title": "NLP Engineer", "category": "Data & AI",
        "jd": "Build natural language processing systems including text classification, named entity recognition, sentiment analysis, and conversational AI. Fine-tune transformer models and implement text pipelines.",
        "key_skills": ["Python","NLP","Transformers","BERT","GPT","spaCy","NLTK","PyTorch","TensorFlow","Hugging Face","Text Classification","Sentiment Analysis","LLM","Docker","FastAPI"]
    },
    "computer_vision_engineer": {
        "title": "Computer Vision Engineer", "category": "Data & AI",
        "jd": "Develop computer vision systems for object detection, image segmentation, and video analysis. Implement models with OpenCV, YOLO, and deep learning frameworks. Deploy on edge devices.",
        "key_skills": ["Python","OpenCV","PyTorch","TensorFlow","YOLO","CNN","Image Processing","Deep Learning","Docker","AWS","CUDA","Object Detection","Segmentation","C++","ONNX"]
    },
    # ── Design ──────────────────────────────────
    "ui_ux_designer": {
        "title": "UI/UX Designer", "category": "Design",
        "jd": "Design intuitive user interfaces and experiences. Conduct user research, create wireframes and prototypes in Figma, build design systems, and run usability tests. Ensure accessibility compliance.",
        "key_skills": ["Figma","Adobe XD","User Research","Wireframing","Prototyping","Design Systems","Usability Testing","HTML","CSS","Accessibility","Typography","Interaction Design","Sketch","InVision","Responsive Design"]
    },
    "product_designer": {
        "title": "Product Designer", "category": "Design",
        "jd": "Own end-to-end product design from research to high-fidelity mockups. Collaborate with PMs and engineers, conduct user interviews, define information architecture, and iterate based on data.",
        "key_skills": ["Figma","User Research","Prototyping","Design Systems","Information Architecture","Interaction Design","Usability Testing","Design Thinking","Sketch","HTML","CSS","Analytics","A/B Testing","Accessibility","Motion Design"]
    },
    "graphic_designer": {
        "title": "Graphic Designer", "category": "Design",
        "jd": "Create visual content for digital and print media. Design marketing materials, brand assets, social media graphics, and presentations using Adobe Creative Suite.",
        "key_skills": ["Photoshop","Illustrator","InDesign","Figma","Typography","Branding","Color Theory","Print Design","Social Media","After Effects","Canva","Layout Design","Photography","Vector Graphics","Creative Suite"]
    },
    # ── Management ──────────────────────────────
    "product_manager": {
        "title": "Product Manager", "category": "Management",
        "jd": "Define product vision and roadmap. Prioritize features using data, conduct user research, write PRDs, manage sprints, and collaborate with engineering and design teams. Drive go-to-market strategy.",
        "key_skills": ["Product Strategy","Agile","User Research","Data Analysis","Roadmap","Jira","SQL","A/B Testing","PRD","Stakeholder Management","Scrum","Analytics","Communication","OKR","Go-to-Market"]
    },
    "engineering_manager": {
        "title": "Engineering Manager", "category": "Management",
        "jd": "Lead and grow engineering teams. Manage sprint planning, conduct 1:1s, drive technical decisions, ensure delivery quality, and collaborate with product and design on roadmap execution.",
        "key_skills": ["Team Leadership","Agile","Scrum","Technical Architecture","Hiring","Mentoring","Sprint Planning","Jira","System Design","Code Review","CI/CD","Communication","OKR","Stakeholder Management","Performance Management"]
    },
    "scrum_master": {
        "title": "Scrum Master", "category": "Management",
        "jd": "Facilitate agile ceremonies, remove blockers, coach teams on Scrum practices, manage sprint metrics, and drive continuous improvement. SAFe or CSM certification preferred.",
        "key_skills": ["Scrum","Agile","Kanban","Jira","Sprint Planning","Retrospectives","SAFe","CSM","Facilitation","Coaching","Conflict Resolution","Metrics","Confluence","Communication","Continuous Improvement"]
    },
    "technical_program_manager": {
        "title": "Technical Program Manager", "category": "Management",
        "jd": "Coordinate complex cross-team technical programs. Define milestones, manage dependencies, mitigate risks, and ensure on-time delivery of large-scale engineering initiatives.",
        "key_skills": ["Program Management","Agile","Risk Management","Stakeholder Management","Jira","Technical Architecture","Communication","Cross-functional","Roadmap","OKR","Confluence","Gantt","Scrum","Dependency Management","Executive Reporting"]
    },
    # ── Cloud & Infrastructure ──────────────────
    "cloud_architect": {
        "title": "Cloud Architect", "category": "Cloud & Infra",
        "jd": "Design cloud-native architectures on AWS/GCP/Azure. Implement multi-region deployments, disaster recovery, cost optimization, and security best practices. Lead cloud migration initiatives.",
        "key_skills": ["AWS","Azure","GCP","Terraform","Kubernetes","Docker","Serverless","Lambda","CloudFormation","Networking","Security","Cost Optimization","Multi-Region","Disaster Recovery","Architecture"]
    },
    "database_administrator": {
        "title": "Database Administrator", "category": "Cloud & Infra",
        "jd": "Manage and optimize database systems including PostgreSQL, MySQL, MongoDB, and Redis. Implement backup strategies, replication, performance tuning, and migration planning.",
        "key_skills": ["PostgreSQL","MySQL","MongoDB","Redis","SQL","Replication","Backup","Performance Tuning","AWS RDS","Docker","Linux","Indexing","Query Optimization","Migration","Data Modeling"]
    },
    "network_engineer": {
        "title": "Network Engineer", "category": "Cloud & Infra",
        "jd": "Design and maintain enterprise network infrastructure. Configure routers, switches, firewalls, VPNs, and load balancers. Implement network security and monitoring.",
        "key_skills": ["Cisco","TCP/IP","DNS","DHCP","Firewall","VPN","Load Balancer","BGP","OSPF","Linux","AWS VPC","Wireshark","SDN","Network Security","Monitoring"]
    },
    # ── Marketing & Business ────────────────────
    "digital_marketing": {
        "title": "Digital Marketing Manager", "category": "Marketing",
        "jd": "Plan and execute digital marketing campaigns across SEO, SEM, social media, and email. Manage Google Ads/Meta Ads budgets, analyze campaign performance, and optimize conversion funnels.",
        "key_skills": ["Google Ads","Meta Ads","SEO","SEM","Google Analytics","Content Marketing","Email Marketing","Social Media","Conversion Optimization","A/B Testing","HubSpot","Copywriting","Marketing Automation","KPI","ROI"]
    },
    "growth_engineer": {
        "title": "Growth Engineer", "category": "Marketing",
        "jd": "Build growth experiments, implement analytics tracking, optimize onboarding funnels, and develop features that drive user acquisition and retention. Blend engineering with data-driven marketing.",
        "key_skills": ["Python","JavaScript","SQL","A/B Testing","Google Analytics","Mixpanel","Amplitude","React","APIs","Experimentation","Funnel Optimization","Segment","Growth Hacking","Data Analysis","Automation"]
    },
    "seo_specialist": {
        "title": "SEO Specialist", "category": "Marketing",
        "jd": "Optimize website content and structure for search engines. Conduct keyword research, technical SEO audits, link building, and content strategy. Monitor rankings with Ahrefs/SEMrush.",
        "key_skills": ["SEO","Google Analytics","Ahrefs","SEMrush","Keyword Research","Technical SEO","Link Building","Content Strategy","HTML","Schema Markup","Google Search Console","WordPress","Core Web Vitals","Copywriting","Analytics"]
    },
    "business_analyst": {
        "title": "Business Analyst", "category": "Marketing",
        "jd": "Gather and analyze business requirements, create process maps, write user stories, and bridge communication between business stakeholders and technical teams.",
        "key_skills": ["Requirements Gathering","SQL","Excel","Jira","User Stories","Process Mapping","Stakeholder Management","Data Analysis","Agile","Tableau","Power BI","Communication","Documentation","UML","Business Intelligence"]
    },
    "content_strategist": {
        "title": "Content Strategist", "category": "Marketing",
        "jd": "Develop content strategy aligned with business goals. Plan editorial calendars, manage content production, optimize for SEO, and measure content performance.",
        "key_skills": ["Content Strategy","SEO","Copywriting","Editorial Calendar","Google Analytics","CMS","WordPress","Social Media","Brand Voice","A/B Testing","Email Marketing","Content Marketing","Analytics","Storytelling","Research"]
    },
    # ── Specialized Engineering ─────────────────
    "ios_developer": {
        "title": "iOS Developer", "category": "Engineering",
        "jd": "Build native iOS applications using Swift and SwiftUI. Implement Core Data, networking with URLSession/Alamofire, push notifications, and App Store deployment. Follow Apple HIG.",
        "key_skills": ["Swift","SwiftUI","UIKit","Xcode","Core Data","REST API","Git","CocoaPods","SPM","App Store","Push Notifications","Auto Layout","MVVM","Combine","TestFlight"]
    },
    "android_developer": {
        "title": "Android Developer", "category": "Engineering",
        "jd": "Build native Android apps with Kotlin and Jetpack Compose. Implement Room database, Retrofit for networking, MVVM architecture, and Google Play deployment.",
        "key_skills": ["Kotlin","Jetpack Compose","Android Studio","Room","Retrofit","MVVM","Coroutines","Git","Google Play","Firebase","Dagger/Hilt","Material Design","REST API","Gradle","Unit Testing"]
    },
    "golang_developer": {
        "title": "Go Developer", "category": "Engineering",
        "jd": "Build high-performance backend services in Go. Design concurrent systems, implement gRPC/REST APIs, manage PostgreSQL databases, and deploy on Kubernetes.",
        "key_skills": ["Go","Golang","gRPC","REST API","PostgreSQL","Docker","Kubernetes","Concurrency","Microservices","Redis","Git","Linux","CI/CD","Prometheus","Testing"]
    },
    "java_developer": {
        "title": "Java Developer", "category": "Engineering",
        "jd": "Develop enterprise applications using Java and Spring Boot. Implement RESTful microservices, manage relational databases, write unit tests, and deploy on cloud platforms.",
        "key_skills": ["Java","Spring Boot","Hibernate","REST API","PostgreSQL","MySQL","Maven","Docker","Kubernetes","AWS","Microservices","JUnit","Git","Kafka","CI/CD"]
    },
    "dotnet_developer": {
        "title": ".NET Developer", "category": "Engineering",
        "jd": "Build enterprise web applications using C# and ASP.NET Core. Implement Web APIs, Entity Framework, Azure services, and follow clean architecture patterns.",
        "key_skills": ["C#","ASP.NET Core","Entity Framework","SQL Server","Azure","REST API","Docker","Git","LINQ","Blazor","MVC","Microservices","xUnit","CI/CD","Clean Architecture"]
    },
    "ruby_developer": {
        "title": "Ruby on Rails Developer", "category": "Engineering",
        "jd": "Build web applications using Ruby on Rails. Implement ActiveRecord models, Sidekiq background jobs, RSpec tests, and deploy on Heroku/AWS.",
        "key_skills": ["Ruby","Rails","ActiveRecord","PostgreSQL","Redis","Sidekiq","RSpec","Git","Heroku","AWS","Docker","REST API","JavaScript","HTML","CSS"]
    },
    "php_developer": {
        "title": "PHP Developer", "category": "Engineering",
        "jd": "Develop web applications using PHP and Laravel/Symfony. Implement MVC patterns, manage MySQL databases, build REST APIs, and integrate third-party services.",
        "key_skills": ["PHP","Laravel","MySQL","REST API","Git","Composer","Redis","Docker","JavaScript","HTML","CSS","Vue.js","PHPUnit","AWS","Nginx"]
    },
    "rust_developer": {
        "title": "Rust Developer", "category": "Engineering",
        "jd": "Build high-performance systems software in Rust. Implement memory-safe concurrent programs, WebAssembly modules, and systems-level tooling.",
        "key_skills": ["Rust","Systems Programming","Concurrency","WebAssembly","Cargo","Git","Linux","C","Docker","Memory Safety","Performance Optimization","Networking","CLI Tools","WASM","Testing"]
    },
    # ── Consulting & Support ────────────────────
    "technical_writer": {
        "title": "Technical Writer", "category": "Other",
        "jd": "Create technical documentation, API docs, user guides, and tutorials. Work with engineering teams to document systems, processes, and best practices.",
        "key_skills": ["Technical Writing","Documentation","API Documentation","Markdown","Git","Confluence","DITA","Swagger/OpenAPI","Diagramming","Communication","Editing","CMS","HTML","User Guides","Information Architecture"]
    },
    "solutions_architect": {
        "title": "Solutions Architect", "category": "Cloud & Infra",
        "jd": "Design end-to-end technical solutions for enterprise clients. Evaluate architectures, lead proof-of-concepts, and ensure solutions meet scalability, security, and compliance requirements.",
        "key_skills": ["AWS","Azure","System Design","Microservices","Docker","Kubernetes","API Design","Security","Compliance","Presentation","Networking","Databases","Serverless","Cost Optimization","Technical Leadership"]
    },
    "salesforce_developer": {
        "title": "Salesforce Developer", "category": "Other",
        "jd": "Customize Salesforce platform with Apex, Visualforce, and Lightning Web Components. Implement integrations, workflows, and reports for business processes.",
        "key_skills": ["Salesforce","Apex","Lightning Web Components","Visualforce","SOQL","REST API","Git","Salesforce Admin","Flows","Integration","JavaScript","HTML","CSS","Trailhead","Data Migration"]
    },
    "sap_consultant": {
        "title": "SAP Consultant", "category": "Other",
        "jd": "Implement and configure SAP modules (FI/CO, MM, SD, HR). Manage system migrations, customizations, and integrations. Support end-users and optimize business processes.",
        "key_skills": ["SAP","ABAP","SAP HANA","FI/CO","MM","SD","S/4HANA","Integration","Business Process","SQL","Configuration","Data Migration","Functional Consulting","Testing","Documentation"]
    },
    "support_engineer": {
        "title": "Technical Support Engineer", "category": "Other",
        "jd": "Provide L2/L3 technical support, troubleshoot complex issues, write knowledge base articles, and escalate critical incidents. Strong debugging and communication skills required.",
        "key_skills": ["Troubleshooting","Linux","SQL","Networking","Jira","Zendesk","Python","Bash","AWS","Docker","Monitoring","Communication","Documentation","Incident Management","Debugging"]
    },
    # ── Cybersecurity ───────────────────────────
    "cybersecurity_analyst": {
        "title": "Cybersecurity Analyst", "category": "Cloud & Infra",
        "jd": "Monitor and respond to security incidents. Conduct threat analysis, manage SIEM tools, perform vulnerability scanning, and ensure compliance with security frameworks.",
        "key_skills": ["SIEM","Threat Analysis","Vulnerability Scanning","Nessus","Splunk","Firewall","IDS/IPS","OWASP","Linux","Python","Incident Response","SOC","Compliance","Forensics","Risk Assessment"]
    },
    # ── More Data Roles ─────────────────────────
    "bi_analyst": {
        "title": "Business Intelligence Analyst", "category": "Data & AI",
        "jd": "Build BI dashboards and reports using Tableau/Power BI/Looker. Write complex SQL queries, model data warehouses, and deliver actionable insights to business teams.",
        "key_skills": ["Tableau","Power BI","SQL","Looker","Data Modeling","ETL","Excel","Python","Data Warehouse","Snowflake","BigQuery","Redshift","DAX","Business Intelligence","Analytics"]
    },
    "analytics_engineer": {
        "title": "Analytics Engineer", "category": "Data & AI",
        "jd": "Build and maintain data transformation pipelines using dbt. Define data models, ensure data quality, and bridge the gap between data engineering and data analysis.",
        "key_skills": ["dbt","SQL","Snowflake","BigQuery","Python","Git","Data Modeling","ETL","Airflow","Looker","Tableau","Data Quality","Analytics","Jinja","Testing"]
    },
    "mlops_engineer": {
        "title": "MLOps Engineer", "category": "Data & AI",
        "jd": "Build and manage ML infrastructure. Implement model training pipelines, model registries, A/B testing for models, monitoring for drift, and automated retraining workflows.",
        "key_skills": ["Python","MLflow","Kubeflow","Docker","Kubernetes","AWS SageMaker","Airflow","CI/CD","Terraform","Model Monitoring","Feature Store","Git","FastAPI","Prometheus","MLOps"]
    },
}

CATEGORIES = ["Engineering", "Data & AI", "Design", "Management", "Cloud & Infra", "Marketing", "Other"]
