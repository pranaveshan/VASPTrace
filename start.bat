@echo off
echo =========================================================================
echo    I4C BLOCKCHAIN FORENSICS WORKSTATION - SIH26183
echo    Ministry of Home Affairs / Indian Cybercrime Coordination Centre
echo =========================================================================
echo.
echo Starting Backend API Engine on http://localhost:5000 ...
start "SIH Forensics Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend Forensic Workstation on http://localhost:5173 ...
start "SIH Forensics Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Application initialized!
echo Open your browser at: http://localhost:5173
echo =========================================================================
