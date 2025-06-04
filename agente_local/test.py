import twain
from PIL import Image
import os
import datetime

def test_escaner():
    carpeta_destino = r"D:\Scanner\Recibos"
    if not os.path.exists(carpeta_destino):
        os.makedirs(carpeta_destino)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    archivo_salida = os.path.join(carpeta_destino, f"test_scan_{timestamp}.png")

    print("Iniciando SourceManager TWAIN...")
    sm = twain.SourceManager(0)
    fuente = None
    try:
        fuentes = sm.GetSourceList()
        print("Fuentes TWAIN detectadas:", fuentes)
        if not fuentes:
            print("No se encontraron escáneres TWAIN disponibles.")
            return
        # Si tienes más de un escáner, puedes elegir el índice aquí
        fuente = sm.OpenSource(fuentes[0])
        print(f"Usando escáner: {fuentes[0]}")

        fuente.SetCapability(twain.ICAP_XRESOLUTION, twain.TWTY_FIX32, 200.0)
        fuente.SetCapability(twain.ICAP_YRESOLUTION, twain.TWTY_FIX32, 200.0)
        fuente.SetCapability(twain.ICAP_PIXELTYPE, twain.TWTY_UINT16, 0)  # 0: color

        print("Coloca el documento en el escáner. Aparecerá la ventana del escáner...")
        fuente.RequestAcquire(1, 1)  # 1,1 = UI visible
        info = fuente.GetImageInfo()
        imagen = fuente.XferImageNatively()
        handle, count = imagen
        bmp_path = os.path.join(carpeta_destino, f"temp_{timestamp}.bmp")
        twain.DIBToBMFile(handle, bmp_path)
        img_pil = Image.open(bmp_path)
        img_pil.save(archivo_salida)
        os.remove(bmp_path)
        print(f"¡Escaneo completado! Imagen guardada en: {archivo_salida}")
    except Exception as e:
        print(f"[ERROR] Durante el escaneo: {e}")
    finally:
        try:
            if fuente:
                fuente.Close()
        except:
            pass
        # No usar sm.Destroy()  # No existe en muchas versiones

if __name__ == "__main__":
    test_escaner()
