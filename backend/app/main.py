# app/main.py

from fastapi import FastAPI, WebSocket
from app.api import router as api_router
from app.ws import agent_connect

app = FastAPI(title="Backend Orquestador Scanneos")

@app.get("/")
def root():
    return {
        "status": "Backend orquestador activo",
        "endpoints": [
            "/logs",
            "/agentes_conectados",
            "/orden_escanear/{local_id}"
        ]
    }

# WebSocket para agentes
@app.websocket("/ws/agent/{local_id}")
async def ws_agent(websocket: WebSocket, local_id: str):
    await agent_connect(websocket, local_id)

# Monta las rutas REST del API
app.include_router(api_router)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Para pruebas, en producción usa tu dominio
    allow_methods=["*"],
    allow_headers=["*"],
)
