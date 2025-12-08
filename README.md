
# 🐾  It Academy Mascota virtual - Meditation Buddys 🧘‍♂️




Este es un proyecto de la IT Academy para la especialización Java con Spring Framework, en el que es requisito crear una app estilo mascota virtual generando el frontend con IA, cuyo objetivo es acercar al programador novato a entornos reales donde la IA será parte del flujo de trabajo, desarrollar el pensamiento analítico y crítico del código generado, soft skills en prompt engineering, integración de tecnologías, documentación y arquitecturas, así como preparar al alumno para el trabajo autónomo y creativo.




Pensado para familiarizarse con:



Uso de inteligencia artificial en el desarrollo de frontend.




Integración frontend-backend.




Seguridad y autorización.




Debugging en aplicaciones full-stack.




Documentación técnica.




Trabajo con repositorios.




Uso de la caché.




Reflexión sobre el aprendizaje.




Prácticas modernas de integración y seguridad web.




Trabajo autónomo, creativo y reflexivo.





---



## Comenzando 🚀

https://meditation-buddys.vercel.app/

Aterrizaras en la pagina de autenticación donde puedes ir al registro, debes pulsar "registrarse" agregar un nombre de usuario, correo y contraseña, espera 2 o 3 minutos a que aparezca el aviso de "REGISTRO ALINEADO", este retraso se debe a que el servidor gratuito tarda en "despertar" antes de procesar la información.

<img width="1920" height="1200" alt="Screenshot 2025-10-23 000758" src="https://github.com/user-attachments/assets/8db00fbe-93ef-46de-9bca-5f435794ed9f" />



Automaticamente la aplicación redirigira al inicio de sesion y solo debes pulsar "ENTRAR", tu cuenta ya ha sido creada.


<img width="1920" height="1200" alt="Screenshot 2025-10-23 000814" src="https://github.com/user-attachments/assets/bfd26414-0c95-4fd5-8414-9b9b5dcb1b19" />
<img width="1920" height="1200" alt="Screenshot 2025-10-23 001614" src="https://github.com/user-attachments/assets/7dfab50b-ac9f-437a-9311-16fcde9ebabb" />

Ya estas lista para crear tu primer compañero de meditacion pulsando "Crear Buddy", se desplegará una nueva pagina donde puedes seleccionar un avatar que prefieras, escribir un nombre y "Crear Buddy".

<img width="1920" height="1200" alt="Screenshot 2025-10-23 001644" src="https://github.com/user-attachments/assets/c418b614-62a7-4f17-881d-0da81413bc01" />
<img width="1920" height="1200" alt="Screenshot 2025-10-23 002710" src="https://github.com/user-attachments/assets/531de2a9-0ffa-485a-9307-91de331e2f57" />

<img width="1920" height="1200" alt="Screenshot 2025-10-23 003547" src="https://github.com/user-attachments/assets/ddfd7cfc-bb7e-4d93-92f5-d88039462a3c" />

Una vez creado volverás a tu dashboard donde puedes abrir la tarjeta de tu primer buddy.
Allí, tienes dos opciones:

<img width="960" height="600" alt="Screenshot 2025-10-23 003800" src="https://github.com/user-attachments/assets/09796f65-00fb-4fa2-bf6e-c51974f6e21b" />

-Abrazar: aporta un 10% de felicidad y corazones flotan a tu alrededor, tiene un cooldown, no puedes apabullar de amor a tu nuevo buddy.

<img width="1920" height="1200" alt="Screenshot 2025-10-23 004423" src="https://github.com/user-attachments/assets/7efffa7d-cefc-4df6-82a0-96788db9159f" />

-Meditar: se despliega la pagina de diseño de sesion de meditación, donde puedes seleccionar el destino geografico al cual viajar con tu buddy y los minutos que deseas meditar.

<img width="1920" height="1200" alt="Screenshot 2025-10-23 004029" src="https://github.com/user-attachments/assets/7c9d7fd6-76de-4fc1-b604-fcc36302186d" />

Si pulsas "Comenzar Meditacion" directamente te transportará al destino seleccionado, donde un sonido y un mensaje inspirador te darán el primer aliento.

<img width="1920" height="1200" alt="Screenshot 2025-10-23 004453" src="https://github.com/user-attachments/assets/470ca34d-905a-4099-bb02-4d155144f200" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/cb28563f-4eae-4498-8e9e-d26fdc888202" />

Cada minuto meditado te aportará 3pts de experiencia y 1pt de felicidad, todas tus sesiones quedaran registradas en el historial.

<img width="1920" height="1200" alt="Screenshot 2025-10-23 010821" src="https://github.com/user-attachments/assets/8011b094-2f7b-4977-9d25-6e82a67b183b" />

Tus buddys evolucionaran cada vez que alcances 100pts de experiencia, añadiendo nuevas caracteristica zen al personaje, estas son todos los niveles que puedes alcanzar de momento.

<img width="1920" height="1200" alt="Screenshot 2025-09-20 221004" src="https://github.com/user-attachments/assets/c815edf7-98bb-4506-85e6-ac5ff59eecef" />


Por otro lado, existe la pagina de gestion del administrador:

**WORK IN PROGRESS**




### Para probar la app.




1 - Abre el siguiente enlace y ten un poco de paciencia mientras despierta el servidor gratuito: 




https://meditation-buddys.vercel.app/




2 - Para documentación:




https://meditation-buddys-app.onrender.com/swagger-ui/index.html#






### Para tener una copia local de este proyecto.




1) Clona los repositorios.




clona el back:




```
git clone https://github.com/rioacosta/S5-02-Virtual-Pet-App

git checkout localconfig

```

en tu IDE:

```
mvn clean install
```




clona el front:




```
git clone https://github.com/rioacosta/S5-02-Virtual-Pet-App-Front

git checkout localconfig
```

en tu IDE:

```
npm install
```




Si vas a trabajar sobre el proyecto, crea tu propia rama a partir de este punto.




2) Inicia el servicio local de MongoDB y configura tus credenciales si es necesario.




3) Ejecuta.




Ejecuta el backend:

```
mvn spring-boot:run
```

Ejecuta el frontend:

```
npm run dev
```




4) Prueba la app en: http://localhost:5177/






---

## 🛠️️️ Tecnologías utilizadas




### Back:




- Java 21 




- Spring Boot




- Maven




- Mongo




- WebFlux




- JWT




- JUnit




- Mockito




- Lombok




- Jackson




- Hibernate




- Logger Slf4j




- Caffeine




### Front:




- JavaScript 




- React




- Axios




- Vite




- npm




- Tailwind CSS




- JWT decode




---




## ⚙️Funcionalidades




### Funcionalidades para usuarios:




Crear cuenta (/users/register)




Iniciar sesión (/auth/login)




Cambiar contraseña (/users/change-password)




Cambiar datos personales (/users/update)




Consultar perfil (/users/me)




Eliminar cuenta (/users/delete/{username})





### Gestión de buddys virtuales:




Crear nueva buddy (/buddys/create)




Consultar buddy por ID (/buddys/{id})




Modificar o eliminar buddy (PUT y DELETE en /buddys/{id})





### Interacciones emocionales:




Meditar con un buddy (/buddys/{id}/meditate)




Dar abrazos (/buddys/{id}/hug)





### Sistema de recompensas:




Ver recompensas (/buddys/{id}/rewards)




Añadir recompensas (PATCH /buddys/{id}/rewards)





### Seguimiento del estado:




Consultar estado del buddy (/buddys/{id}/status)




Ver historial de sesiones de meditación (/buddys/{id}/history)





### Funcionalidades para administradores:




Página de gestión de usuarias




Página de usuaria




Ver usuarios con sus mascotas (/admin/users-with-buddys)




Consultar usuaria por nombre (/admin/users/{username})




Crear administradora (/admin/create-admin)




Actualizar datos o roles de usuarias (/admin/users/{username}/update, /roles)




Bloquear temporalmente (/admin/users/{username}/toggle-enabled)




Eliminar usuarios (/admin/delete/{username})




---




## 🤝 Contribuciones





1) Haz un fork del repositorio y crea tu propia copia del proyecto en tu cuenta de GitHub.




2) Crea una rama para tu contribución, usando un nombre descriptivo:




```
git checkout -b feature/nombre-de-tu-feature-especifico
```




3) Realiza tus cambios siguiendo las convenciones de estilo y estructura del proyecto.




4) Haz commit de tus cambios.




```
git commit -m "Agrega nueva funcionalidad: nombre-de-tu-feature"
```




5) Haz push a tu rama.





```
git push origin feature/nombre-de-tu-feature
```

6) Abre un Pull Request describiendo claramente qué cambios hiciste y por qué.




#### 📋 Recomendaciones





- Usa comentarios claros en el código.








- Si agregas nuevas dependencias, actualiza la documentación.








- Prueba tu código antes de enviar el PR.


