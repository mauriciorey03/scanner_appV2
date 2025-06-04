import asyncio
import websockets
import json
import requests

from config import BACKEND_WS_URL, BACKEND_UPLOAD_URL, LOCAL_ID, OPENAI_API_KEY
from scanner import escanear_factura
from ocr_openai import ocr_openai

async def agente():
    uri = BACKEND_WS_URL
    async with websockets.connect(uri) as websocket:
        print("[AGENTE] Conectado a backend")
        while True:
            mensaje = await websocket.recv()
            print("[AGENTE] Mensaje recibido:", mensaje)
            try:
                msg_obj = json.loads(mensaje)
            except Exception:
                continue
            if msg_obj.get("accion") == "escanear":
                print("[AGENTE] Escaneando factura...")
                ruta = escanear_factura()
                datos_ocr = ocr_openai(ruta, OPENAI_API_KEY)
                print("[AGENTE] Datos OCR:", datos_ocr)
                # Subir resultado al backend (POST)
                payload = {
                    "local_id": LOCAL_ID,
                    "ocr": datos_ocr
                }
                resp = requests.post(BACKEND_UPLOAD_URL, json=payload)
                print("[AGENTE] Resultado subida backend:", resp.text)

if __name__ == "__main__":
    asyncio.run(agente())
