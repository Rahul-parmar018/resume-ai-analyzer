@echo off
cd /d c:\resume-ai-analyzer
start "Backend" cmd /k ".venv\Scripts\python.exe manage.py runserver"
cd /d frontend
start "Frontend" cmd /k "npm run dev"
