# comm_ws.py

import asyncio
import websockets
import json
from config import BACKEND_WS_URL, LOCAL_ID
from scanner import escanear_factura
from ocr_openai import ocr_openai    # CORRECTO: importar la función con su nombre real
from crm import enviar_datos_ocr
import logger

def escuchar_ordenes():
    asyncio.run(main_ws())

async def main_ws():
    async with websockets.connect(BACKEND_WS_URL) as websocket:
        logger.info("[AGENTE] Conectado a backend")
        while True:
            mensaje = await websocket.recv()
            logger.info(f"[AGENTE] Mensaje recibido: {mensaje}")
            try:
                msg_obj = json.loads(mensaje)
            except Exception as e:
                logger.error(f"[AGENTE] Error al parsear mensaje: {e}")
                continue
            if msg_obj.get("accion") == "escanear":
                logger.info("[AGENTE] Escaneando factura...")
                img_path = escanear_factura()
                datos_ocr = ocr_openai(img_path)
                logger.info(f"[AGENTE] Datos OCR: {datos_ocr}")
                resultado = enviar_datos_ocr(datos_ocr)
                logger.info(f"[AGENTE] Resultado CRM: {resultado}")
