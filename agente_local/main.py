# main.py
from config import LOCAL_ID, BACKEND_WS_URL
from comm_ws import escuchar_ordenes
import logger

if __name__ == "__main__":
    logger.info(f"[AGENTE] Iniciando agente para local_id: {LOCAL_ID}")
    try:
        escuchar_ordenes()
    except Exception as e:
        logger.error(f"[AGENTE] Error inesperado: {e}")
