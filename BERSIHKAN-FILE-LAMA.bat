@echo off
chcp 65001 >nul
echo.
echo  Membersihkan file lama di folder utama...
echo.
if not exist public\index.html (
  echo  GAGAL: folder public belum lengkap. Salin dulu semua isi zip ke folder ini.
  echo.
  pause
  exit /b
)
for %%F in (app.js index.html style.css server.js package-lock.json) do if exist "%%F" (del /f /q "%%F" & echo  dihapus: %%F)
if exist assets (rd /s /q assets & echo  dihapus: folder assets)
echo.
echo  Selesai. Sekarang commit dan push lewat GitHub Desktop.
echo.
pause
(goto) 2>nul & del "%~f0"
