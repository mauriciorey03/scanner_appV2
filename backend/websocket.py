from fastapi import WebSocket, WebSocketDisconnect

# Diccionario para mantener agentes conectados: {local_id: websocket}
connected_agents = {}

async def agent_connect(websocket: WebSocket, local_id: str):
    await websocket.accept()
    connected_agents[local_id] = websocket
    print(f"[WS] Agente {local_id} conectado.")
    try:
        while True:
            data = await websocket.receive_json()
            print(f"[WS] Mensaje recibido de {local_id}: {data}")
            # Aquí puedes procesar mensajes recibidos de los agentes si es necesario
    except WebSocketDisconnect:
        print(f"[WS] Agente {local_id} desconectado.")
        connected_agents.pop(local_id, None)

async def enviar_orden_escanear(local_id: str):
    """
    Envía la orden de escaneo al agente especificado por WebSocket.
    """
    ws = connected_agents.get(local_id)
    if ws:
        await ws.send_json({"accion": "escanear"})
        return True
    else:
        print(f"[WS] No se encontró agente {local_id} conectado.")
        return False

def get_connected_agents():
    """Devuelve los agentes actualmente conectados"""
    return list(connected_agents.keys())
