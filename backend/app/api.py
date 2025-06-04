# app/api.py
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from app.storage import guardar_factura, listar_facturas

router = APIRouter()

@router.post("/upload_ocr")
async def upload_ocr(request: Request):
    """
    Recibe JSON de un agente, lo almacena.
    Espera:
    {
      "local_id": "local1",
      "ocr": { ...datos OCR... }
    }
    """
    data = await request.json()
    print("[BACKEND] JSON recibido:", data)
    guardar_factura(data)
    return JSONResponse({"status": "ok", "msg": "Factura recibida", "facturas_total": len(listar_facturas())})

@router.get("/facturas")
def get_facturas():
    """Devuelve todas las facturas recibidas."""
    return {"facturas": listar_facturas()}
