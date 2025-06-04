# app/logs.py

logs = []

def registrar_log(evento: dict):
    logs.append(evento)

def listar_logs():
    return logs[-200:]   # Últimos 200 eventos
