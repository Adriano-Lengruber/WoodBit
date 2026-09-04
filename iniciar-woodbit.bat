@echo off
title WoodBit ERP - Marcenaria 4.0
chcp 65001 > nul
cls
echo ======================================================================
echo           🪵 WOODBIT ERP — MARCENARIA & FABRICAÇÃO DIGITAL
echo ======================================================================
echo.
echo  Polo de Fabricação Digital • Natividade / Noroeste Fluminense - RJ
echo.
echo  [1/2] Verificando ambiente de execução Node.js...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo  [ERRO] O Node.js não foi encontrado no computador!
    echo  Por favor, baixe e instale a versão recomendada em: https://nodejs.org
    echo.
    pause
    exit /b
)

echo  [2/2] Iniciando o servidor local e abrindo o navegador...
echo.

:: Abre o navegador padrao em http://localhost:3000 apos 3 segundos
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

echo ======================================================================
echo  O WoodBit ERP está rodando em: http://localhost:3000
echo.
echo  DICA: Para encerrar o sistema, basta fechar esta janela preta.
echo ======================================================================
echo.

call npm run dev
pause
