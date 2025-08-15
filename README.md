
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


