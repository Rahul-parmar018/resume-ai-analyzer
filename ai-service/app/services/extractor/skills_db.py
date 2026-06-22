"""
Skills Database
Comprehensive list of skills organized by category
Used for matching against resume text
"""

# Technical Skills - Frontend
FRONTEND_SKILLS = {
    # JavaScript Frameworks
    "react", "react.js", "reactjs", "next.js", "nextjs", "vue", "vue.js", "vuejs",
    "angular", "angular.js", "svelte", "solid.js", "astro",

    # CSS & Styling
    "css", "scss", "sass", "tailwind", "tailwindcss", "styled-components",
    "bootstrap", "material-ui", "mui", "ant design", "chakra ui",

    # HTML
    "html", "html5", "jsx", "tsx",
}

# Technical Skills - Backend
BACKEND_SKILLS = {
    # Languages
    "python", "javascript", "typescript", "java", "c++", "c#", "go", "golang",
    "rust", "ruby", "php", "swift", "kotlin", "scala",

    # Frameworks & Libraries
    "node.js", "nodejs", "express", "express.js", "django", "flask", "fastapi",
    "spring", "rails", "laravel", "asp.net", ".net", "dotnet",

    # APIs
    "rest", "restful", "graphql", "grpc", "webSocket", "websocket",
}

# AI & ML Skills
AI_ML_SKILLS = {
    # Machine Learning
    "machine learning", "ml", "deep learning", "neural networks",
    "natural language processing", "nlp", "computer vision", "cv",
    "reinforcement learning", "rl", "transfer learning",

    # ML Libraries & Frameworks
    "tensorflow", "pytorch", "keras", "scikit-learn", "sklearn",
    "pandas", "numpy", "scipy", "pillow", "opencv",

    # AI Concepts
    "llm", "llms", "large language model", "generative ai", "genai",
    "gpt", "chatgpt", "transformers", "bert", "attention mechanism",
    "prompt engineering", "rag", "fine-tuning",

    # MLOps
    "mlflow", "kubeflow", "tensorboard", "wandb", "weights & biases",
}

# Databases
DATABASE_SKILLS = {
    # Relational
    "mysql", "postgresql", "postgres", "sqlite", "mariadb", "oracle",
    "sql server", "mssql",

    # NoSQL
    "mongodb", "redis", "cassandra", "dynamodb", "firebase", "firestore",
    "neo4j", "couchdb", "elasticSearch", "elasticsearch",
}

# DevOps & Tools
DEVOPS_SKILLS = {
    # Version Control
    "git", "github", "gitlab", "bitbucket", "svn",

    # Container & Orchestration
    "docker", "kubernetes", "k8s", "helm", "compose",

    # Cloud Platforms
    "aws", "amazon web services", "azure", "gcp", "google cloud",
    "heroku", "vercel", "netlify",

    # CI/CD
    "jenkins", "travis ci", "circleci", "github actions", "gitlab ci",
    "docker swarm",

    # Infrastructure
    "terraform", "ansible", "puppet", "chef",
}

# Data Engineering
DATA_ENGINEERING_SKILLS = {
    "spark", "hadoop", "hive", "pig", "kafka", "airflow", " Luigi",
    "dbt", "snowflake", "bigquery", "databricks", "etl", "elt",
}

# Tools & Soft Skills
TOOLS_SKILLS = {
    # IDEs & Editors
    "vscode", "visual studio code", "intellij", "pycharm", "webstorm",
    "sublime text", "atom",

    # Productivity
    "jira", "confluence", "notion", "slack", "zoom", "teams",

    # Design
    "figma", "sketch", "adobe xd", "photoshop", "illustrator",

    # Testing
    "jest", "mocha", "cypress", "selenium", "playwright", "pytest",
    "unittest", "junit", "postman", "insomnia",
}

# Soft Skills (for reference - usually not technical)
SOFT_SKILLS = {
    "leadership", "communication", "teamwork", "problem-solving",
    "analytical", "time management", "agile", "scrum",
}

# Mapping of categories to skill sets
SKILLS_CATEGORIES = {
    "frontend": FRONTEND_SKILLS,
    "backend": BACKEND_SKILLS,
    "ai_ml": AI_ML_SKILLS,
    "databases": DATABASE_SKILLS,
    "devops": DEVOPS_SKILLS,
    "data_engineering": DATA_ENGINEERING_SKILLS,
    "tools": TOOLS_SKILLS,
}

# All skills combined for quick lookup
ALL_SKILLS = (
    FRONTEND_SKILLS | BACKEND_SKILLS | AI_ML_SKILLS |
    DATABASE_SKILLS | DEVOPS_SKILLS | DATA_ENGINEERING_SKILLS | TOOLS_SKILLS
)


def normalize_skill(skill: str) -> str:
    """
    Normalize a skill string for matching
    - Convert to lowercase
    - Remove special characters
    - Standardize variations
    """
    # Convert to lowercase
    normalized = skill.lower().strip()

    # Remove special characters except spaces and hyphens
    normalized = ''.join(c if c.isalnum() or c in [' ', '-'] else '' for c in normalized)

    # Standardize common variations
    replacements = {
        "react.js": "react",
        "reactjs": "react",
        "node.js": "node.js",
        "nodejs": "node.js",
        "next.js": "next.js",
        "nextjs": "next.js",
        "vue.js": "vue",
        "vuejs": "vue",
        "angular.js": "angular",
        "angularjs": "angular",
        "express.js": "express",
        "expressjs": "express",
        "postgresql": "postgres",
        "machine learning": "machine learning",
        "deep learning": "deep learning",
        "natural language processing": "nlp",
    }

    for old, new in replacements.items():
        normalized = normalized.replace(old, new)

    return normalized


def get_all_skills() -> set:
    """Return all skills as a normalized set"""
    return ALL_SKILLS