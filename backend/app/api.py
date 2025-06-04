# app/api.py

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from app.ws import enviar_orden_escanear, get_connected_agents
from app.logs import registrar_log, listar_logs

router = APIRouter()

@router.post("/orden_escanear/{local_id}")
async def api_orden_escanear(local_id: str):
    ok = await enviar_orden_escanear(local_id)
    return {"ok": ok}

@router.post("/log_event")
async def api_log_event(request: Request):
    evento = await request.json()
    registrar_log(evento)
    return {"ok": True}

@router.get("/agentes_conectados")
def api_agentes():
    return {"agentes": get_connected_agents()}

@router.get("/logs")
def api_logs():
    return {"logs": listar_logs()}

