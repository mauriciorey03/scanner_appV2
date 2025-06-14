import twain
from PIL import Image
import os
import datetime

def escanear_factura():
    carpeta_destino = r"D:\Scanner\Recibos"
    if not os.path.exists(carpeta_destino):
        os.makedirs(carpeta_destino)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    archivo_salida = os.path.join(carpeta_destino, f"recibo_{timestamp}.png")

    sm = twain.SourceManager(0)
    fuente = None
    try:
        fuentes = sm.GetSourceList()
        print("Fuentes TWAIN:", fuentes)
        if not fuentes:
            raise Exception("No se encontraron escáneres TWAIN disponibles")
        fuente = sm.OpenSource(fuentes[0])  # O busca por nombre: 'EPSON DS-C330'
        # Parámetros
        fuente.SetCapability(twain.ICAP_XRESOLUTION, twain.TWTY_FIX32, 200.0)
        fuente.SetCapability(twain.ICAP_YRESOLUTION, twain.TWTY_FIX32, 200.0)
        fuente.SetCapability(twain.ICAP_PIXELTYPE, twain.TWTY_UINT16, 0)  # 0: color
        print("¡Por favor, coloca la factura en el escáner y confirma en la UI si aparece!")
        fuente.RequestAcquire(1, 1)  # 1,1 = muestra UI, espera confirmación
        info = fuente.GetImageInfo()
        imagen = fuente.XferImageNatively()
        handle, count = imagen
        bmp_path = os.path.join(carpeta_destino, f"temp_{timestamp}.bmp")
        twain.DIBToBMFile(handle, bmp_path)
        img_pil = Image.open(bmp_path)
        img_pil.save(archivo_salida)
        os.remove(bmp_path)
        print(f"Factura escaneada y guardada en: {archivo_salida}")
        return archivo_salida
    except Exception as e:
        print(f"Error durante el escaneo: {e}")
        raise
    finally:
        try:
            if fuente:
                fuente.Close()
        except:
            pass
        sm.Destroy()
