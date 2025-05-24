# Choconautas

Proyecto Sistemas Web II

## Temática

- La temática del proyecto será una implementar una API REST con una base de datos MongoDB sobre noticias espaciales.
- Para ello, los usuarios podrán realizar funciones CRUD sobre noticias que ellos mismos publiquen.
- Esta API estará conectada a una API externa de la NASA, la cual devolverá mensajes JSON.
- Estas noticias estarán almacenadas en la base de datos de MongoDB y todas las funciones CRUD realizaras por el usuario se verán aplicadas aquí.

## Detalles sobre ejecución

### Generador de datos

- Si se busca ejecutar el script de Python generador_noticias.py, es necesario:
```bash
    pip install pymongo
```
- La API de la NASA ya está incluida en el fichero .env (público en el repositorio)

### Arranque de la aplicación
```bash
    npm install
    npm start
```
- Nota: los datos ya se cargan automáticamente

## Integrantes

- Hugo Herrera
- Daniel Escribano
- Germán Fábregas
- Álvaro Sanz
- Tomás Machín
- Juan García
