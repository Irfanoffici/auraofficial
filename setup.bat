@echo off
echo ===================================
echo AURA Setup Script
echo ===================================

echo [1/3] Checking Backend Virtual Environment...
if not exist "backend\venv" (
    echo Creating virtual environment...
    python -m venv backend\venv
) else (
    echo Virtual environment exists.
)

echo [2/3] Installing Dependencies...
call backend\venv\Scripts\activate
pip install -r backend\requirements.txt

echo [3/3] Setup Complete!
echo.
echo To run the backend:
echo cd backend
echo venv\Scripts\activate
echo uvicorn app.main:app --reload
echo.
echo To run the frontend:
echo cd frontend
echo npm run dev
pause
