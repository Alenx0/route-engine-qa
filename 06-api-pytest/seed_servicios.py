import json
import os
import random
import sys
from datetime import date, timedelta

import requests

BASE_URL = os.getenv("BASE_URL", "http://127.0.0.1:5000")
ARCHIVO_IDS = os.path.join(os.path.dirname(__file__), ".qa_load_ids.json")

ORIGENES = ["Santiago", "Valparaíso", "Rancagua", "San Antonio", "Talca"]
DESTINOS = ["Temuco", "Concepción", "La Serena", "Puerto Montt", "Antofagasta"]


def login():
    clave = os.getenv("ADMIN_PASSWORD")
    if not clave:
        sys.exit("Falta la variable de entorno ADMIN_PASSWORD")
    r = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": "admin@alenxo", "password": clave},
        timeout=15,
    )
    if r.status_code != 200:
        sys.exit(f"El login falló con {r.status_code}")
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def obtener_cliente(headers):
    r = requests.get(f"{BASE_URL}/api/clients", headers=headers, timeout=15)
    if r.status_code != 200:
        sys.exit(f"No pude listar clientes: {r.status_code}")
    datos = r.json()
    lista = datos if isinstance(datos, list) else datos.get("clients", [])
    if not lista:
        sys.exit("No hay clientes en la empresa. Crea uno a mano y repite.")
    return lista[0]["id"]


def leer_ids():
    if os.path.exists(ARCHIVO_IDS):
        with open(ARCHIVO_IDS) as f:
            return json.load(f)
    return []


def guardar_ids(ids):
    with open(ARCHIVO_IDS, "w") as f:
        json.dump(ids, f)


def cargar(cantidad):
    headers = login()
    client_id = obtener_cliente(headers)
    random.seed(42)
    hoy = date.today()
    ids = leer_ids()

    for _ in range(cantidad):
        numero = len(ids) + 1
        cuerpo = {
            "client_id": client_id,
            "amount": random.randint(20000, 900000),
            "date": (hoy - timedelta(days=random.randint(0, 90))).isoformat(),
            "origin": random.choice(ORIGENES),
            "destination": random.choice(DESTINOS),
            "description": f"Servicio de carga {numero}",
            "waybill_number": f"QA-LOAD-{numero:04d}",
        }
        r = requests.post(
            f"{BASE_URL}/api/services", json=cuerpo, headers=headers, timeout=15
        )
        if r.status_code != 201:
            print(
                f"Se detuvo en el servicio {numero}: {r.status_code} {r.text[:200]}")
            break
        ids.append(r.json()["service"]["id"])
        if numero % 50 == 0:
            guardar_ids(ids)
            print(f"{numero} servicios creados")

    guardar_ids(ids)
    print(f"Listo. Servicios QA en total: {len(ids)}")


def borrar():
    headers = login()
    ids = leer_ids()
    for sid in ids:
        r = requests.delete(f"{BASE_URL}/api/services/{sid}",
                            headers=headers, timeout=15)
        if r.status_code not in (200, 404):
            print(f"No pude borrar {sid}: {r.status_code}")
    if os.path.exists(ARCHIVO_IDS):
        os.remove(ARCHIVO_IDS)
    print(f"Borrados {len(ids)} servicios QA")


if __name__ == "__main__":
    accion = sys.argv[1] if len(sys.argv) > 1 else ""
    if accion == "cargar":
        cargar(int(sys.argv[2]) if len(sys.argv) > 2 else 20)
    elif accion == "borrar":
        borrar()
    else:
        sys.exit("Uso: seed_servicios.py cargar <cantidad> | borrar")
