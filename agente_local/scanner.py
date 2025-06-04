# scanner.py
import os

def escanear_factura():
    # Simulación: usa una imagen demo de facturas (colócala en el mismo directorio como demo.png)
    ruta = os.path.join(os.path.dirname(__file__), "demo.png")
    if not os.path.exists(ruta):
        raise FileNotFoundError("No se encontró demo.png, coloca una imagen de prueba en el directorio del agente.")
    return ruta
