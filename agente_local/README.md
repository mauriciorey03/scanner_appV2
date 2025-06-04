# Agente Local para Scanneos Distribuidos

Este agente permite automatizar el flujo de escaneo y envío de facturas, conectado a un backend orquestador y usando OCR con OpenAI.

## 📦 Estructura de archivos

- `main.py`          – Ciclo principal del agente.
- `config.py`        – Configuración del agente (local_id, rutas, claves).
- `scanner.py`       – Escaneo físico o simulado de facturas.
- `ocr_openai.py`    – Proceso OCR usando OpenAI Vision API.
- `crm.py`           – Envío de los datos extraídos a la API de WeGrow CRM.
- `comm_ws.py`       – Comunicación WebSocket con backend orquestador.
- `logger.py`        – Logging básico en consola.
- `requirements.txt` – Dependencias Python.
- `README.md`        – Esta documentación.
- `logs/`            – Carpeta para logs (opcional, puedes no usarla si solo imprimes en consola).

## 🚀 Instalación

1. Clona este repositorio o copia los archivos.
2. Instala las dependencias (en un entorno virtual recomendado):

   ```bash
   pip install -r requirements.txt
