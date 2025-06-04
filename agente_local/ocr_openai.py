# ocr_openai.py

import base64
import requests
from config import OPENAI_API_KEY

def ocr_openai(image_path):
    """
    Envía la imagen a la API de OpenAI Vision y retorna el JSON extraído.
    """
    with open(image_path, "rb") as img_file:
        img_base64 = base64.b64encode(img_file.read()).decode("utf-8")
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "gpt-4o",
        "messages": [
            {"role": "system", "content": "Eres un experto en facturas colombianas. Extrae los datos y responde en JSON."},
            {"role": "user", "content": [
                {"type": "text", "text": (
                    "Extrae toda la información posible de esta factura colombiana. "
                    "Devuélveme un JSON con los siguientes campos si están disponibles: "
                    "titular, documento, tienda, NIT, contacto, fecha_compra, valor_total, prefijo."
                )},
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{img_base64}"}}
            ]}
        ],
        "temperature": 0.1
    }
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code == 200:
        try:
            content = response.json()
            texto = content["choices"][0]["message"]["content"]
            import json as pyjson
            return pyjson.loads(texto)
        except Exception as e:
            return {"error": f"Error al parsear respuesta OpenAI: {str(e)}"}
    else:
        return {"error": f"OCR failed: {response.status_code}, {response.text}"}
