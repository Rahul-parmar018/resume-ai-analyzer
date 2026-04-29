"""
Structured role templates for v1 focus.
Roles use weighted scoring categories: core, important, optional.
"""

ROLES = {
  "AI/ML Engineer": {
    "title": "AI/ML Engineer",
    "core": ["Python", "Machine Learning", "NLP", "Linear Algebra", "Calculus"],
    "important": ["PyTorch", "TensorFlow", "Scikit-learn", "Deep Learning", "Transformers"],
    "optional": ["Docker", "AWS", "FastAPI", "Pandas", "NumPy"]
  },
  "Cybersecurity Engineer": {
    "title": "Cybersecurity Engineer",
    "core": ["Network Security", "OWASP", "Linux", "Encryption", "TCP/IP"],
    "important": ["SIEM", "Penetration Testing", "Python", "IAM", "Wireshark"],
    "optional": ["Cloud Security", "SOC", "Compliance", "Docker", "AWS"]
  },
  "Full Stack Developer": {
    "title": "Full Stack Developer",
    "core": ["JavaScript", "React", "Node.js", "HTML", "CSS"],
    "important": ["TypeScript", "REST API", "SQL", "Git", "PostgreSQL"],
    "optional": ["Docker", "AWS", "Testing", "Next.js", "Express"]
  },
  "DevOps Engineer": {
    "title": "DevOps Engineer",
    "core": ["Docker", "CI/CD", "Linux", "Bash", "Git"],
    "important": ["Kubernetes", "AWS", "Terraform", "Jenkins", "Ansible"],
    "optional": ["Prometheus", "Grafana", "Python", "Helm", "CloudFormation"]
  },
  "Data Scientist": {
    "title": "Data Scientist",
    "core": ["Python", "Statistics", "Machine Learning", "SQL", "Calculus"],
    "important": ["Pandas", "Scikit-learn", "SQL", "R", "Jupyter"],
    "optional": ["Tableau", "Deep Learning", "NLP", "Spark", "Airflow"]
  }
}

CATEGORIES = ["Engineering", "Data & AI", "Cloud & Infra", "Cybersecurity"]
