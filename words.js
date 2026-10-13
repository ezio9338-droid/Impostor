// Listas de palabras por categoría. Añade o quita las que quieras.
const CATEGORIES = {
  "Comida": [
    "Pizza", "Paella", "Tortilla de patatas", "Hamburguesa", "Sushi", "Tacos",
    "Croquetas", "Gazpacho", "Churros", "Helado", "Chocolate", "Lasaña",
    "Ensalada", "Palomitas", "Huevo frito", "Espaguetis", "Bocadillo", "Pulpo",
    "Queso", "Jamón", "Patatas fritas", "Fresas", "Sandía", "Plátano", "Donut"
  ],
  "Animales": [
    "Perro", "Gato", "León", "Elefante", "Jirafa", "Delfín", "Tiburón",
    "Pingüino", "Caballo", "Vaca", "Cerdo", "Gallina", "Serpiente", "Cocodrilo",
    "Mono", "Oso", "Lobo", "Zorro", "Conejo", "Tortuga", "Águila", "Búho",
    "Mariposa", "Abeja", "Pulpo", "Canguro", "Koala", "Murciélago"
  ],
  "Lugares": [
    "Playa", "Hospital", "Colegio", "Aeropuerto", "Supermercado", "Cine",
    "Biblioteca", "Gimnasio", "Iglesia", "Estadio", "Museo", "Zoo", "Discoteca",
    "Restaurante", "Hotel", "Piscina", "Montaña", "Desierto", "Cárcel",
    "Parque de atracciones", "Peluquería", "Comisaría", "Estación de tren",
    "Farmacia", "Circo", "Castillo", "Barco pirata"
  ],
  "Objetos": [
    "Paraguas", "Teléfono", "Reloj", "Llave", "Gafas", "Silla", "Espejo",
    "Lámpara", "Tijeras", "Cepillo de dientes", "Mochila", "Almohada",
    "Bicicleta", "Guitarra", "Cámara", "Vela", "Martillo", "Escoba",
    "Nevera", "Microondas", "Mando de la tele", "Calcetín", "Sombrero",
    "Pelota", "Libro", "Botella", "Cartera"
  ],
  "Profesiones": [
    "Médico", "Bombero", "Policía", "Profesor", "Cocinero", "Piloto",
    "Astronauta", "Dentista", "Peluquero", "Fontanero", "Abogado", "Actor",
    "Cantante", "Futbolista", "Veterinario", "Panadero", "Taxista", "Pintor",
    "Mago", "Carpintero", "Periodista", "Enfermero", "Granjero", "Socorrista",
    "Youtuber", "Arquitecto"
  ],
  "Deportes": [
    "Fútbol", "Baloncesto", "Tenis", "Natación", "Ciclismo", "Boxeo",
    "Golf", "Esquí", "Surf", "Voleibol", "Balonmano", "Atletismo", "Pádel",
    "Rugby", "Béisbol", "Patinaje", "Escalada", "Karate", "Ajedrez",
    "Fórmula 1", "Gimnasia", "Hockey", "Tiro con arco", "Bolos"
  ],
  "Películas y series": [
    "Titanic", "Harry Potter", "Star Wars", "El Rey León", "Shrek",
    "Toy Story", "Frozen", "Spider-Man", "Batman", "Jurassic Park",
    "La casa de papel", "Juego de tronos", "Los Simpson", "Breaking Bad",
    "Stranger Things", "El juego del calamar", "Avatar", "Piratas del Caribe",
    "Buscando a Nemo", "Matrix", "Tiburón", "Friends", "Coco", "Barbie"
  ],
  "Transporte": [
    "Coche", "Avión", "Tren", "Barco", "Moto", "Autobús", "Helicóptero",
    "Submarino", "Patinete", "Metro", "Taxi", "Cohete", "Globo aerostático",
    "Tractor", "Ambulancia", "Camión", "Tranvía", "Velero", "Teleférico",
    "Monopatín", "Caravana", "Kayak"
  ],
  "Frutas y verduras": [
    "Manzana", "Pera", "Naranja", "Limón", "Uva", "Melón", "Piña", "Mango",
    "Kiwi", "Cereza", "Melocotón", "Aguacate", "Coco", "Tomate", "Lechuga",
    "Zanahoria", "Patata", "Cebolla", "Ajo", "Pimiento", "Pepino", "Brócoli",
    "Calabaza", "Berenjena", "Champiñón", "Maíz", "Espárrago"
  ],
  "Bebidas": [
    "Agua", "Café", "Té", "Leche", "Zumo de naranja", "Coca-Cola", "Cerveza",
    "Vino", "Sangría", "Horchata", "Batido", "Chocolate caliente", "Limonada",
    "Mojito", "Champán", "Kombucha", "Tinto de verano", "Gaseosa",
    "Bebida energética", "Granizado", "Sidra", "Agua con gas", "Smoothie"
  ],
  "Postres y dulces": [
    "Tarta de queso", "Flan", "Natillas", "Arroz con leche", "Tiramisú",
    "Brownie", "Gofre", "Tortitas", "Crepe", "Magdalena", "Galleta",
    "Piruleta", "Chicle", "Gominolas", "Algodón de azúcar", "Turrón",
    "Roscón de Reyes", "Palmera", "Cruasán", "Macarons", "Mousse de chocolate",
    "Crema catalana", "Polvorón", "Cupcake"
  ],
  "Países": [
    "España", "México", "Argentina", "Francia", "Italia", "Alemania",
    "Japón", "China", "Brasil", "Estados Unidos", "Canadá", "Australia",
    "Egipto", "India", "Rusia", "Reino Unido", "Portugal", "Grecia",
    "Marruecos", "Colombia", "Perú", "Chile", "Cuba", "Noruega",
    "Corea del Sur", "Suiza", "Tailandia", "Irlanda"
  ],
  "Ciudades": [
    "Madrid", "Barcelona", "París", "Londres", "Nueva York", "Roma",
    "Tokio", "Berlín", "Ámsterdam", "Lisboa", "Sevilla", "Valencia",
    "Buenos Aires", "Ciudad de México", "Los Ángeles", "Las Vegas", "Venecia",
    "Moscú", "Dubái", "Río de Janeiro", "Sídney", "El Cairo", "Atenas",
    "Bilbao", "Granada", "Pekín", "Estambul"
  ],
  "Monumentos": [
    "Torre Eiffel", "Sagrada Familia", "Coliseo", "Estatua de la Libertad",
    "Pirámides de Egipto", "Gran Muralla China", "Machu Picchu", "Big Ben",
    "Alhambra", "Torre de Pisa", "Taj Mahal", "Cristo Redentor", "Stonehenge",
    "Acrópolis", "Puerta de Alcalá", "Acueducto de Segovia", "Chichén Itzá",
    "Ópera de Sídney", "Puerta de Brandeburgo", "Burj Khalifa",
    "Golden Gate", "Kremlin", "Petra"
  ],
  "Naturaleza": [
    "Río", "Volcán", "Cascada", "Bosque", "Selva", "Isla", "Lago", "Cueva",
    "Glaciar", "Arcoíris", "Tormenta", "Rayo", "Nieve", "Tornado",
    "Terremoto", "Océano", "Arena", "Flor", "Árbol", "Cactus", "Luna",
    "Sol", "Estrella", "Nube", "Niebla", "Aurora boreal", "Duna"
  ],
  "Partes del cuerpo": [
    "Ojo", "Nariz", "Boca", "Oreja", "Mano", "Pie", "Rodilla", "Codo",
    "Corazón", "Cerebro", "Pulmón", "Estómago", "Diente", "Lengua", "Pelo",
    "Uña", "Hombro", "Espalda", "Cuello", "Ombligo", "Ceja", "Tobillo",
    "Muñeca", "Barbilla", "Pestaña", "Esqueleto"
  ],
  "Ropa y accesorios": [
    "Camiseta", "Pantalón", "Falda", "Vestido", "Chaqueta", "Abrigo",
    "Bufanda", "Guantes", "Gorra", "Zapatillas", "Botas", "Sandalias",
    "Chanclas", "Corbata", "Pijama", "Bañador", "Cinturón", "Collar",
    "Pendientes", "Anillo", "Pulsera", "Bolso", "Sudadera", "Vaqueros",
    "Gafas de sol", "Chándal"
  ],
  "En casa": [
    "Cocina", "Baño", "Dormitorio", "Salón", "Garaje", "Balcón", "Ático",
    "Sótano", "Sofá", "Cama", "Armario", "Mesa", "Ducha", "Bañera", "Váter",
    "Lavadora", "Lavavajillas", "Horno", "Tostadora", "Ventilador",
    "Radiador", "Cortina", "Alfombra", "Estantería", "Chimenea", "Timbre"
  ],
  "Colegio": [
    "Pizarra", "Tiza", "Lápiz", "Goma de borrar", "Sacapuntas", "Regla",
    "Estuche", "Cuaderno", "Calculadora", "Examen", "Recreo", "Deberes",
    "Director", "Pupitre", "Patio", "Comedor", "Excursión", "Matemáticas",
    "Historia", "Educación física", "Boletín de notas", "Compás", "Pegamento",
    "Diccionario", "Mapa"
  ],
  "Tecnología": [
    "Ordenador", "Portátil", "Tablet", "Móvil", "Auriculares", "Teclado",
    "Ratón", "Impresora", "Wifi", "Cargador", "Pendrive", "Smartwatch",
    "Consola", "Televisión", "Altavoz", "Robot", "Dron", "Realidad virtual",
    "Inteligencia artificial", "Contraseña", "Correo electrónico",
    "Bluetooth", "Batería", "Webcam", "Router"
  ],
  "Apps y redes sociales": [
    "WhatsApp", "Instagram", "TikTok", "YouTube", "Twitter", "Facebook",
    "Netflix", "Spotify", "Google Maps", "Snapchat", "Twitch", "Telegram",
    "Amazon", "Uber", "Tinder", "Wikipedia", "Pinterest", "Discord",
    "LinkedIn", "Zoom", "Glovo", "Shazam", "Duolingo", "BeReal"
  ],
  "Marcas": [
    "Nike", "Adidas", "Apple", "Samsung", "McDonald's", "Burger King",
    "Coca-Cola", "Zara", "IKEA", "Lego", "Disney", "Ferrari", "Mercedes",
    "Google", "Microsoft", "Nintendo", "PlayStation", "Starbucks",
    "Mercadona", "El Corte Inglés", "Chupa Chups", "Nutella", "Barbie",
    "Tesla", "Red Bull"
  ],
  "Videojuegos": [
    "Mario Bros", "Minecraft", "Fortnite", "Pokémon", "Tetris", "Pac-Man",
    "FIFA", "GTA", "Call of Duty", "Zelda", "Sonic", "Among Us", "Roblox",
    "Los Sims", "Mario Kart", "Candy Crush", "Clash Royale", "League of Legends",
    "Animal Crossing", "Street Fighter", "Angry Birds", "The Last of Us",
    "Rocket League", "Fall Guys"
  ],
  "Superhéroes y villanos": [
    "Superman", "Batman", "Spider-Man", "Iron Man", "Capitán América",
    "Hulk", "Thor", "Wonder Woman", "Flash", "Aquaman", "Black Panther",
    "Viuda Negra", "Deadpool", "Lobezno", "Joker", "Thanos", "Loki",
    "Darth Vader", "Catwoman", "Doctor Strange", "Harley Quinn",
    "Capitana Marvel", "Magneto", "Venom"
  ],
  "Dibujos animados": [
    "Bob Esponja", "Mickey Mouse", "Pato Donald", "Homer Simpson", "Goku",
    "Pikachu", "Shrek", "Peppa Pig", "Scooby-Doo", "Bugs Bunny", "Doraemon",
    "Pocoyó", "Pantera Rosa", "Garfield", "Snoopy", "Los Picapiedra",
    "Naruto", "Bart Simpson", "Tom y Jerry", "Mortadelo y Filemón",
    "Pitufos", "Heidi", "Oliver y Benji", "Hello Kitty"
  ],
  "Famosos": [
    "Shakira", "Messi", "Cristiano Ronaldo", "Rosalía", "Bad Bunny",
    "Rafa Nadal", "Taylor Swift", "Michael Jackson", "Einstein", "Picasso",
    "Elon Musk", "Leonardo DiCaprio", "Penélope Cruz", "Antonio Banderas",
    "Beyoncé", "Bill Gates", "Frida Kahlo", "Cervantes", "Dalí",
    "Fernando Alonso", "Pau Gasol", "Julio Iglesias", "Ibai", "Madonna",
    "Napoleón", "Cristóbal Colón"
  ],
  "Instrumentos musicales": [
    "Piano", "Guitarra", "Violín", "Batería", "Flauta", "Trompeta",
    "Saxofón", "Arpa", "Acordeón", "Bajo", "Violonchelo", "Clarinete",
    "Armónica", "Ukelele", "Castañuelas", "Pandereta", "Gaita", "Tambor",
    "Xilófono", "Órgano", "Triángulo", "Maracas", "Trombón", "Banjo"
  ],
  "Fiestas y celebraciones": [
    "Navidad", "Nochevieja", "Halloween", "Carnaval", "Cumpleaños", "Boda",
    "San Valentín", "Semana Santa", "San Fermín", "Las Fallas",
    "La Tomatina", "Feria de Abril", "Reyes Magos", "Día de Muertos",
    "Graduación", "Despedida de soltero", "Bautizo", "Oktoberfest",
    "Año Nuevo chino", "Fiesta de pijamas", "Baby shower", "Barbacoa"
  ],
  "Hobbies": [
    "Leer", "Cocinar", "Bailar", "Cantar", "Pintar", "Fotografía",
    "Jardinería", "Pescar", "Senderismo", "Acampar", "Yoga", "Meditar",
    "Videojuegos", "Puzles", "Coleccionar sellos", "Hacer punto",
    "Karaoke", "Escape room", "Viajar", "Hacer surf", "Montar en bici",
    "Ver series", "Juegos de mesa", "Origami"
  ],
  "Fantasía y mitología": [
    "Dragón", "Unicornio", "Sirena", "Vampiro", "Hombre lobo", "Fantasma",
    "Zombi", "Bruja", "Hada", "Duende", "Gigante", "Ogro", "Elfo", "Fénix",
    "Centauro", "Minotauro", "Medusa", "Zeus", "Hércules", "Genio de la lámpara",
    "Momia", "Yeti", "Pegaso", "Kraken", "Mago Merlín"
  ],
  "En la playa": [
    "Sombrilla", "Toalla", "Crema solar", "Castillo de arena", "Ola",
    "Socorrista", "Chiringuito", "Tumbona", "Concha", "Cangrejo", "Medusa",
    "Gaviota", "Faro", "Flotador", "Cubo y pala", "Paddle surf", "Moreno",
    "Chanclas", "Helado", "Puesta de sol", "Pala de playa", "Nevera portátil"
  ],
  "Tareas del día a día": [
    "Hacer la compra", "Poner la lavadora", "Fregar los platos",
    "Hacer la cama", "Sacar al perro", "Planchar", "Barrer", "Cocinar",
    "Sacar la basura", "Ir al banco", "Hacer cola", "Coger el metro",
    "Ducharse", "Lavarse los dientes", "Echar la siesta", "Poner la mesa",
    "Regar las plantas", "Hacer deporte", "Ir al médico", "Cortarse el pelo"
  ],
  "Emociones y sensaciones": [
    "Alegría", "Tristeza", "Miedo", "Vergüenza", "Celos", "Nervios",
    "Aburrimiento", "Sorpresa", "Enfado", "Amor", "Cosquillas", "Hambre",
    "Sueño", "Frío", "Calor", "Dolor de cabeza", "Hipo", "Mareo",
    "Orgullo", "Nostalgia", "Envidia", "Estrés"
  ]
};
