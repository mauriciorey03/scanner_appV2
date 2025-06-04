import os
from fastapi import FastAPI, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
import shutil
from app.ocr import dummy_ocr
from backend.app.api import enviar_datos_ocr_al_crm


app = FastAPI()

# Guardamos conexiones de agentes conectados
connected_agents = {}

@app.get("/")
async def root():
    return {"message": "Backend operativo"}

# 1. Endpoint para subir imagen (el agente llama aquí después de escanear)
@app.post("/upload_ocr")
async def upload_ocr(file: UploadFile = File(...), local_id: str = "local1"):
    save_dir = "imagenes_recibidas"
    os.makedirs(save_dir, exist_ok=True)
    file_path = os.path.join(save_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    print(f"[BACKEND] Imagen recibida de {local_id}: {file.filename}")
    # 1. Simula OCR
    resultado_ocr = dummy_ocr(file_path)
    # 2. Envía datos a CRM (mock api_key aquí)
    api_key = "A6RM1yofeA56etbfXEKOdDOrxZpRd8lg"
    crm_result = enviar_datos_ocr_al_crm(resultado_ocr, api_key)
    # 3. Retorna ambos resultados
    return JSONResponse({
        "status": "ok",
        "filename": file.filename,
        "local_id": local_id,
        "ocr": resultado_ocr,
        "crm_result": crm_result
    })


# 2. WebSocket para comunicación bidireccional
from fastapi import WebSocket
from typing import Dict

@app.websocket("/ws/agent/{local_id}")
async def ws_agent(websocket: WebSocket, local_id: str):
    await websocket.accept()
    connected_agents[local_id] = websocket
    print(f"[BACKEND] Agente {local_id} conectado")
    try:
        while True:
            data = await websocket.receive_json()
            print(f"[BACKEND] Mensaje de {local_id}: {data}")
            # Aquí podrías recibir status, logs, etc.
    except WebSocketDisconnect:
        print(f"[BACKEND] Agente {local_id} desconectado")
        connected_agents.pop(local_id, None)

# 3. Endpoint para enviar orden de escaneo a un agente
@app.post("/orden_escanear/{local_id}")
async def orden_escanear(local_id: str):
    ws = connected_agents.get(local_id)
    if ws:
        await ws.send_json({"accion": "escanear"})
        return {"status": "orden enviada"}
    else:
        return {"status": "agente no conectado"}, 404
