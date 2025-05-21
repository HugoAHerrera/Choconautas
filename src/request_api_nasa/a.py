import requests

# URL del endpoint (por ejemplo, la API Astronomy Picture of the Day)
url = "https://api.nasa.gov/planetary/apod"

# Tu clave de API (la puedes obtener en https://api.nasa.gov)
params = {
    "api_key": "SA0hBTH3ILI5dHrrxSFuodjtoCgUKKdedmDeaP5e"
}

# Hacer la solicitud GET
response = requests.get(url, params=params)

# Mostrar el contenido de la respuesta (opcional)
print(response.json())

# Ver los encabezados relacionados al límite de uso
print("Límite por hora:", response.headers.get("X-RateLimit-Limit"))
print("Solicitudes restantes:", response.headers.get("X-RateLimit-Remaining"))
