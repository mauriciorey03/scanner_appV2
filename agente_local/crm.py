# crm.py

import requests
from config import CRM_API_KEY

def enviar_datos_ocr(datos_ocr):
    """
    Envía los datos extraídos por OCR a la API de WeGrow CRM.
    datos_ocr: dict con los campos requeridos
    """
    url = "https://api.wegrowcrm.com/v1/OCR"
    headers = {
        "X-Api-Key": CRM_API_KEY
    }
    # Mapea los campos según tu necesidad y lo que devuelve OpenAI
    datos = {
        "documento": datos_ocr.get("documento", ""),
        "nit": datos_ocr.get("NIT", ""),
        "codigo": datos_ocr.get("codigo", ""),
        "prefijo": datos_ocr.get("prefijo", ""),
        "valor": datos_ocr.get("valor_total", ""),
        "fecha": datos_ocr.get("fecha_compra", "")
    }
    try:
        resp = requests.post(url, headers=headers, data=datos)
        if resp.status_code == 200:
            try:
                return resp.json()
            except Exception:
                return {"texto_respuesta": resp.text}
        else:
            return {"error": f"Código de estado: {resp.status_code}", "detalle": resp.text}
    except Exception as e:
        return {"error": str(e)}
