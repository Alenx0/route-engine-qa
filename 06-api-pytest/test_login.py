import pytest
import os
import requests

BASE_URL = os.getenv("BASE_URL", "http://127.0.0.1:5000")
LOGIN = f"{BASE_URL}/api/auth/login"


def test_login_con_clave_incorrecta_responde_401():
    respuesta = requests.post(
        LOGIN,
        json={"email": "admin@alenxo", "password": "ClaveMala123"},
        timeout=10,
    )
    assert respuesta.status_code == 401
    assert respuesta.json()["error"] == "Credenciales inválidas"
    assert "access_token" not in respuesta.json()


def intentar_login(clave):
    return requests.post(
        LOGIN,
        json={"email": "admin@alenxo", "password": clave},
        timeout=10,
    )


@pytest.mark.parametrize("largo", [1, 71, 72])
def test_clave_de_hasta_72_bytes_responde_401(largo):
    respuesta = intentar_login("a" * largo)
    assert respuesta.status_code == 401


@pytest.mark.xfail(
    strict=True,
    reason="BUG-004: bcrypt rechaza claves de mas de 72 bytes y el login responde 500",
)
@pytest.mark.parametrize("largo", [73, 100, 1000])
def test_clave_de_mas_de_72_bytes_debe_responder_401(largo):
    respuesta = intentar_login("a" * largo)
    assert respuesta.status_code == 401
