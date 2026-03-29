import requests
import os

# Test configuration
API_URL = "http://127.0.0.1:8000/api/analyze/"
# Note: You need a valid token for a real test, 
# so I'll create a dummy resume file for the user to upload in the browser
# instead of trying to bypass auth in a script.

RESUME_CONTENT = """
Rahul Parmar
Full Stack Developer
Skills: Python, Django, React, SQL, Git, Docker, AWS.
Experience: Built a Resume AI Analyzer using Django and React.
"""

with open("test_resume.txt", "w") as f:
    f.write(RESUME_CONTENT)

print("Test resume created: test_resume.txt")
print("Please upload this file in the Dashboard to see the real ML output.")
