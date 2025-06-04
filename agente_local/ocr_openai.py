# ocr_openai.py
import base64
import requests

def ocr_openai(image_path, api_key):
    with open(image_path, "rb") as image_file:
        b64img = base64.b64encode(image_file.read()).decode("utf-8")
    endpoint = "https://api.openai.com/v1/chat/completions"
    headers = {"Authorization": f"Bearer {api_key}"}
    # Prompt ajustado
    data = {
        "model": "gpt-4o",
        "messages": [
            {"role": "system", "content": "Eres un experto en facturas colombianas. Extrae los datos y responde en JSON."},
            {"role": "user", "content": [
                {"type": "text", "text": "Extrae toda la información posible de esta factura colombiana. Devuélveme un JSON con titular, documento, tienda, NIT, contacto, fecha_compra, valor_total, prefijo."},
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64img}"}}
            ]}
        ],
        "temperature": 0.1
    }
    resp = requests.post(endpoint, headers=headers, json=data)
    if resp.status_code == 200:
        content = resp.json()
        text = content['choices'][0]['message']['content']
        import json
        try:
            return json.loads(text)
        except Exception:
            return {"ocr_raw": text}
    else:
        return {"error": f"OCR failed {resp.status_code}: {resp.text}"}
