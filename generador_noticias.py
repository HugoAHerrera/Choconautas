import json
import random
from datetime import datetime, timedelta

usuarios = [
    {
        "_id": i + 1,
        "nombre": nombre,
        "email": f"{nombre.lower().replace(' ', '')}@choconautas.com",
        "fechaRegistro": (datetime.now() - timedelta(days=random.randint(100, 1000))).isoformat()
    }
    for i, nombre in enumerate([
        "Elena Martínez", "Carlos Vega", "Lucía Navarro", "Martín Ruiz", "Sofía Herrera",
        "Andrés Ibáñez", "Valeria Paredes", "Hugo Lozano", "Isabela Ríos", "Javier Fuentes",
        "Camila Soto", "Fernando Salas", "Paula Medina", "Manuel Ortega", "Sara Delgado",
        "Ignacio Torres", "Emma Galván", "Diego Camacho", "Laura Peña", "Adrián Cordero",
        "Nicolás Ramírez", "Mariana Castaño", "Tomás Aguirre"
    ])
]

for usuario in usuarios[-3:]:
    usuario["email"] = f"{usuario['nombre'].lower().replace(' ', '')}@nasa.gov"

categorias = [
    {"_id": 1, "nombre": "Astronomía", "descripcion": "Estudio de cuerpos celestes y el universo"},
    {"_id": 2, "nombre": "Astrofísica", "descripcion": "Física aplicada a fenómenos espaciales"},
    {"_id": 3, "nombre": "Exploración espacial", "descripcion": "Misiones y avances tecnológicos"},
    {"_id": 4, "nombre": "Astrobiología", "descripcion": "Estudio de la vida en el universo"},
    {"_id": 5, "nombre": "Observación astronómica", "descripcion": "Uso de telescopios y satélites"},
    {"_id": 6, "nombre": "Cosmología", "descripcion": "Origen y evolución del universo"},
    {"_id": 7, "nombre": "Ingeniería espacial", "descripcion": "Diseño de naves y estaciones"}
]

titulos = [
    "Nuevo planeta potencialmente habitable descubierto", "NASA lanza misión pionera a Júpiter",
    "El telescopio James Webb capta imágenes inéditas", "Detectan señales inusuales desde una galaxia lejana",
    "China establece nueva base lunar experimental", "El futuro del turismo espacial más cerca que nunca",
    "Descubren agua congelada en un asteroide cercano", "Simulación de vida en Marte inicia en laboratorio",
    "Satélite europeo detecta anomalías solares", "Aumenta el interés por la minería espacial",
    "La ESA planifica misión conjunta con SpaceX", "Nueva teoría sobre materia oscura genera debate",
    "¿Hay vida en Encélado? Nuevas pruebas lo sugieren", "Exploración de exoplanetas se intensifica este año",
    "Avances en trajes espaciales para largas misiones", "Colisión de galaxias observada en tiempo real",
    "Misterioso objeto interestelar intriga a científicos", "Radiación cósmica y salud de astronautas: nuevo estudio",
    "Prototipos de hábitats lunares presentados en la ONU", "Simulacro de emergencia espacial en órbita terrestre"
]

contenidos = [
    "El hallazgo podría cambiar nuestra comprensión del universo.",
    "Expertos coinciden en la importancia histórica de este avance.",
    "La misión se desarrollará durante los próximos cinco años.",
    "Las imágenes publicadas revelan detalles nunca antes vistos.",
    "El fenómeno ha sido detectado por múltiples observatorios.",
    "Esta iniciativa internacional marca un hito en la exploración espacial.",
    "Los datos serán analizados por científicos de todo el mundo.",
    "Se prevén futuras misiones basadas en estos descubrimientos.",
    "El experimento recrea condiciones extremas de otros planetas.",
    "Esta tecnología podría aplicarse también en la Tierra.",
    "Los resultados preliminares ya han generado entusiasmo.",
    "Un equipo multidisciplinario ha liderado el estudio.",
    "Los fondos provienen de varias agencias espaciales.",
    "Este descubrimiento abre la puerta a nuevas investigaciones.",
    "Los científicos advierten sobre las implicaciones éticas.",
    "La colaboración internacional ha sido clave en este logro.",
    "Este evento ha sido transmitido en directo a todo el mundo.",
    "Se estudia cómo podría afectar a futuras colonias espaciales.",
    "El avance podría acelerar el desarrollo de cohetes reutilizables.",
    "El impacto mediático de este hallazgo ha sido considerable."
]

comentarios_posibles = [
    "Muy interesante.", "Qué gran noticia.", "No puedo esperar a ver los avances.",
    "La ciencia nunca deja de sorprendernos.", "Esto cambiará el futuro.",
    "Impresionante descubrimiento.", "Una noticia que da esperanza.",
    "¿Será esto el inicio de una nueva era?", "Asombroso.", "Me encantaría saber más sobre esto."
]

noticias = []
comentarios = []
comentario_id_counter = 1
fecha_base = datetime.now() - timedelta(days=365)

for i in range(1, 1001):
    autor = random.choice(usuarios)
    categoria = random.choice(categorias)
    fecha_noticia = (fecha_base + timedelta(days=random.randint(0, 365))).isoformat()

    noticia = {
        "_id": i,
        "titulo": random.choice(titulos),
        "contenido": random.choice(contenidos),
        "fecha": fecha_noticia,
        "autorId": autor["_id"],
        "categoriaId": categoria["_id"]
    }
    noticias.append(noticia)

    if random.random() < 0.3:
        for _ in range(random.randint(1, 3)):
            comentador = random.choice(usuarios)
            comentario = {
                "_id": comentario_id_counter,
                "contenido": random.choice(comentarios_posibles),
                "fecha": (fecha_base + timedelta(days=random.randint(0, 365))).isoformat(),
                "autorId": comentador["_id"],
                "noticiaId": i
            }
            comentario_id_counter += 1
            comentarios.append(comentario)

ruta_directorio = "datasets/"

with open(ruta_directorio + "usuarios.json", "w", encoding="utf-8") as f:
    json.dump(usuarios, f, ensure_ascii=False, indent=2)

with open(ruta_directorio + "categorias.json", "w", encoding="utf-8") as f:
    json.dump(categorias, f, ensure_ascii=False, indent=2)

with open(ruta_directorio + "noticias.json", "w", encoding="utf-8") as f:
    json.dump(noticias, f, ensure_ascii=False, indent=2)

with open(ruta_directorio + "comentarios.json", "w", encoding="utf-8") as f:
    json.dump(comentarios, f, ensure_ascii=False, indent=2)
