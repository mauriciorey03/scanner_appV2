# app/ws.py

from fastapi import WebSocket, WebSocketDisconnect
from app.logs import registrar_log

connected_agents = {}

async def agent_connect(websocket: WebSocket, local_id: str):
    await websocket.accept()
    connected_agents[local_id] = websocket
    registrar_log({"evento": "agente_conectado", "local_id": local_id})
    try:
        while True:
            data = await websocket.receive_json()
            registrar_log({"evento": "mensaje_agente", "local_id": local_id, "data": data})
    except WebSocketDisconnect:
        connected_agents.pop(local_id, None)
        registrar_log({"evento": "agente_desconectado", "local_id": local_id})

async def enviar_orden_escanear(local_id: str):
    ws = connected_agents.get(local_id)
    if ws:
        await ws.send_json({"accion": "escanear"})
        registrar_log({"evento": "orden_escanear", "local_id": local_id})
        return True
    else:
        registrar_log({"evento": "orden_fallida", "local_id": local_id})
        return False

def get_connected_agents():
    return list(connected_agents.keys())
