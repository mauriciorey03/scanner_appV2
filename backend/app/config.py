import os
import datetime
try:
    import twain
    from PIL import Image
except ImportError:
    print("Faltan módulos: instala 'twain' y 'Pillow' con pip.")

CARPETA_DESTINO = r"C:\scanneos"

def escanear_recibo():
    """
    Escanea un recibo/factura y lo guarda en CARPETA_DESTINO con timestamp.
    Retorna la ruta del archivo escaneado o None si falla.
    """
    if not os.path.exists(CARPETA_DESTINO):
        os.makedirs(CARPETA_DESTINO)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    archivo_salida = os.path.join(CARPETA_DESTINO, f"recibo_{timestamp}.jpg")

    administrador_twain = twain.SourceManager(0)
    fuente = None
    fuentes = administrador_twain.GetSourceList()
    if not fuentes:
        print("[ESCANEAR] No se encontraron escáneres TWAIN disponibles.")
        administrador_twain.destroy()
        return None

    try:
        print(f"[ESCANEAR] Usando escáner: {fuentes[0]}")
        fuente = administrador_twain.OpenSource(fuentes[0])
        # Ajusta aquí la resolución/color según tus necesidades
        fuente.SetCapability(twain.ICAP_PIXELTYPE, twain.TWTY_UINT16, 0)  # 0 = color
        fuente.SetCapability(twain.ICAP_XRESOLUTION, twain.TWTY_FIX32, 100.0)
        fuente.SetCapability(twain.ICAP_YRESOLUTION, twain.TWTY_FIX32, 100.0)

        # Inicia escaneo
        print("[ESCANEAR] Iniciando escaneo...")
        fuente.RequestAcquire(1, 1)  # Mostrar UI del escáner
        imagen = fuente.XferImageNatively()
        temp_bmp = os.path.join(CARPETA_DESTINO, f"temp_{timestamp}.bmp")
        handle, count = imagen
        twain.DIBToBMFile(handle, temp_bmp)
        img_pil = Image.open(temp_bmp)
        img_pil.save(archivo_salida)
        os.remove(temp_bmp)

        print(f"[ESCANEAR] Escaneo completado: {archivo_salida}")
        return archivo_salida

    except Exception as e:
        print(f"[ESCANEAR] Error durante el escaneo: {e}")
        return None
    finally:
        try:
            if fuente:
                fuente.Close()
        except Exception as e:
            print(f"[ESCANEAR] Error al cerrar la fuente: {e}")
        try:
            administrador_twain.Destroy()
        except Exception as e:
            print(f"[ESCANEAR] Error al destruir el administrador TWAIN: {e}")
