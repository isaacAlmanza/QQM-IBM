/**
 * Banco Integral de Preguntas Bíblicas para "¿Quién Quiere Ser Millonario?"
 * Contiene más de 65 preguntas clasificadas por dificultad (Fácil, Media, Difícil).
 * En cada partida se seleccionan 15 al azar:
 * - 5 Fáciles (Nivel 1 al 5)
 * - 5 Medias  (Nivel 6 al 10)
 * - 5 Difíciles (Nivel 11 al 15)
 */
const questionsData = [
  // =========================================================================
  // NIVEL FÁCIL (easy) - 22 Preguntas
  // =========================================================================
  {
    question: "¿Quién construyó el arca para salvar a su familia y a los animales del diluvio?",
    options: ["Moisés", "Noé", "Abraham", "David"],
    correct: 1,
    difficulty: "easy",
    explanation: "Génesis 6:13-14 - Dios le ordenó a Noé construir un arca de madera de gofer."
  },
  {
    question: "¿En qué río fue bautizado Jesús por Juan el Bautista?",
    options: ["Río Nilo", "Río Éufrates", "Río Jordán", "Río Tigris"],
    correct: 2,
    difficulty: "easy",
    explanation: "Mateo 3:13 - Jesús vino de Galilea a Juan al Jordán, para ser bautizado por él."
  },
  {
    question: "¿A qué gigante filisteo derrotó David con una honda y una piedra?",
    options: ["Goliat", "Og", "Sisnác", "Anac"],
    correct: 0,
    difficulty: "easy",
    explanation: "1 Samuel 17:49-50 - David venció al gigante Goliat de Gat con una honda y una piedra."
  },
  {
    question: "¿Cuántos días y noches llovió durante el diluvio universal?",
    options: ["7 días y 7 noches", "12 días y 12 noches", "40 días y 40 noches", "100 días y 100 noches"],
    correct: 2,
    difficulty: "easy",
    explanation: "Génesis 7:12 - Y hubo lluvia sobre la tierra cuarenta días y cuarenta noches."
  },
  {
    question: "¿Cuál es el primer libro de la Biblia?",
    options: ["Éxodo", "Salmos", "Mateo", "Génesis"],
    correct: 3,
    difficulty: "easy",
    explanation: "Génesis narra los orígenes del mundo y de la humanidad."
  },
  {
    question: "¿En qué ciudad nació Jesús?",
    options: ["Nazaret", "Belén", "Jerusalén", "Jericó"],
    correct: 1,
    difficulty: "easy",
    explanation: "Miqueas 5:2 y Mateo 2:1 - Jesús nació en Belén de Judea en días del rey Herodes."
  },
  {
    question: "¿Quién fue tragado por un gran pez tras intentar huir de Dios?",
    options: ["Jonás", "Elías", "Amós", "Moisés"],
    correct: 0,
    difficulty: "easy",
    explanation: "Jonás 1:17 - Jehová tenía preparado un gran pez que tragase a Jonás."
  },
  {
    question: "¿Cuántos discípulos o apóstoles principales eligió Jesús?",
    options: ["7", "10", "12", "70"],
    correct: 2,
    difficulty: "easy",
    explanation: "Mateo 10:1-2 - Llamando a sus doce discípulos, les dio autoridad."
  },
  {
    question: "¿Quién recibió las tablas de los Diez Mandamientos en el Monte Sinaí?",
    options: ["Abraham", "Moisés", "Josué", "Aarón"],
    correct: 1,
    difficulty: "easy",
    explanation: "Éxodo 20 / 31:18 - Dios entregó a Moisés dos tablas del testimonio escritas con su dedo."
  },
  {
    question: "¿Cuál era la ocupación de José, el padre terrenal de Jesús?",
    options: ["Pescador", "Carpintero", "Pastor de ovejas", "Escriba"],
    correct: 1,
    difficulty: "easy",
    explanation: "Mateo 13:55 - '¿No es este el hijo del carpintero?'."
  },
  {
    question: "¿Quién traicionó a Jesús por 30 piezas de plata?",
    options: ["Pedro", "Judas Iscariote", "Tomás", "Juan"],
    correct: 1,
    difficulty: "easy",
    explanation: "Mateo 26:14-15 - Judas Iscariote pactó entregar a Jesús por treinta piezas de plata."
  },
  {
    question: "¿Cómo se llamaba el jardín donde Dios puso a Adán y Eva?",
    options: ["Getsemaní", "Edén", "Canaán", "Sinaí"],
    correct: 1,
    difficulty: "easy",
    explanation: "Génesis 2:8 - Jehová Dios plantó un huerto en Edén, al oriente, y puso allí al hombre."
  },
  {
    question: "¿Qué mar abrió Moisés para que el pueblo de Israel escapara de Egipto?",
    options: ["Mar Muerto", "Mar Rojo", "Mar de Galilea", "Mar Mediterráneo"],
    correct: 1,
    difficulty: "easy",
    explanation: "Éxodo 14:21 - Moisés extendió su mano sobre el mar Rojo y las aguas se dividieron."
  },
  {
    question: "¿Qué pájaro envió Noé primero desde el arca para ver si las aguas habían bajado?",
    options: ["Una paloma", "Un cuervo", "Un gorrión", "Un águila"],
    correct: 1,
    difficulty: "easy",
    explanation: "Génesis 8:6-7 - Noé envió primero un cuervo, y después una paloma."
  },
  {
    question: "¿A qué amigo resucitó Jesús cuatro días después de haber muerto?",
    options: ["Lázaro", "Jairo", "Bartimeo", "Nicodemo"],
    correct: 0,
    difficulty: "easy",
    explanation: "Juan 11:43-44 - Jesús clamó a gran voz: '¡Lázaro, ven fuera!', y el que había muerto salió."
  },
  {
    question: "¿Cuántos mandamientos entregó Dios en las tablas de la ley?",
    options: ["7", "10", "12", "15"],
    correct: 1,
    difficulty: "easy",
    explanation: "Éxodo 20:1-17 - Los Diez Mandamientos o Decálogo moral entregados al pueblo de Israel."
  },
  {
    question: "¿Cuál es el último libro del Nuevo Testamento?",
    options: ["Hebreos", "Judas", "Hechos", "Apocalipsis"],
    correct: 3,
    difficulty: "easy",
    explanation: "El Apocalipsis o Revelación de San Juan cierra el canon del Nuevo Testamento."
  },
  {
    question: "¿Cómo se llamaba la madre terrenal de Jesús?",
    options: ["Marta", "María", "Sara", "Elisabet"],
    correct: 1,
    difficulty: "easy",
    explanation: "Lucas 1:27 - La virgen se llamaba María, desposada con un varón llamado José."
  },
  {
    question: "¿Quién era conocido por tener una fuerza sobrehumana en su cabello?",
    options: ["Sansón", "Gedeón", "Saúl", "Salomón"],
    correct: 0,
    difficulty: "easy",
    explanation: "Jueces 16:17 - Sansón declaró que era nazareo de Dios y su fuerza residía en su voto reflejado en su cabello."
  },
  {
    question: "¿Qué señal puso Dios en el cielo como pacto de que no volvería a destruir la tierra con un diluvio?",
    options: ["Una estrella brillante", "Un arcoíris", "Un cometa", "Una nube de fuego"],
    correct: 1,
    difficulty: "easy",
    explanation: "Génesis 9:13 - 'Mi arco he puesto en las nubes, el cual será por señal del pacto'."
  },
  {
    question: "¿Cuántas veces negó Pedro a Jesús antes de que cantara el gallo?",
    options: ["1 vez", "2 veces", "3 veces", "7 veces"],
    correct: 2,
    difficulty: "easy",
    explanation: "Mateo 26:34 - 'Antes que el gallo cante, me negarás tres veces'."
  },
  {
    question: "¿Quién fue el hombre más sabio del Antiguo Testamento que construyó el primer Templo en Jerusalén?",
    options: ["Salomón", "David", "Roboam", "Josafat"],
    correct: 0,
    difficulty: "easy",
    explanation: "1 Reyes 4:29-30 - Dios dio a Salomón sabiduría y prudencia muy grandes."
  },

  // =========================================================================
  // NIVEL MEDIO (medium) - 23 Preguntas
  // =========================================================================
  {
    question: "¿Quién fue vendido por sus hermanos a unos mercaderes madianitas por 20 piezas de plata?",
    options: ["Benjamín", "José", "Judá", "Rubén"],
    correct: 1,
    difficulty: "medium",
    explanation: "Génesis 37:28 - Los hermanos de José lo vendieron a los ismaelitas por veinte piezas de plata."
  },
  {
    question: "¿Cuál era la profesión de Mateo (Leví) antes de seguir a Jesús?",
    options: ["Pescador", "Carpintero", "Cobrador de impuestos", "Médico"],
    correct: 2,
    difficulty: "medium",
    explanation: "Mateo 9:9 - Jesús vio a un hombre llamado Mateo sentado al banco de los tributos públicos."
  },
  {
    question: "¿Qué profeta fue arrojado al foso de los leones por orar únicamente al Dios verdadero?",
    options: ["Jeremías", "Daniel", "Ezequiel", "Isaías"],
    correct: 1,
    difficulty: "medium",
    explanation: "Daniel 6:16 - El rey Darío ordenó que Daniel fuera llevado y echado en el foso de los leones."
  },
  {
    question: "¿En qué monte derrotó el profeta Elías a los cuatrocientos cincuenta profetas de Baal?",
    options: ["Monte Carmelo", "Monte Sinaí", "Monte Tabor", "Monte de los Olivos"],
    correct: 0,
    difficulty: "medium",
    explanation: "1 Reyes 18:19-20 - Elías desafió a los profetas de Baal en la cumbre del Monte Carmelo."
  },
  {
    question: "¿Qué cayó del cielo como alimento para alimentar a los israelitas en el desierto?",
    options: ["Trigo de oro", "Maná", "Higos secos", "Pan de cebada"],
    correct: 1,
    difficulty: "medium",
    explanation: "Éxodo 16:31 - La casa de Israel lo llamó Maná; era como semilla de culantro, blanco y con sabor a hojuelas con miel."
  },
  {
    question: "¿Quién fue el primer rey ungido de la nación de Israel?",
    options: ["David", "Saúl", "Salomón", "Samuel"],
    correct: 1,
    difficulty: "medium",
    explanation: "1 Samuel 10:1 - Samuel tomó una redoma de óleo, la derramó sobre la cabeza de Saúl y lo ungió como rey."
  },
  {
    question: "¿Qué jueza y profetisa lideró a Israel y cantó un famoso cántico de victoria junto a Barac?",
    options: ["Rut", "Débora", "Abigaíl", "Ester"],
    correct: 1,
    difficulty: "medium",
    explanation: "Jueces 4:4-5 - Gobernaba en aquel tiempo a Israel una mujer, Débora, profetisa."
  },
  {
    question: "¿Con cuántos hombres escogidos derrotó Gedeón al inmenso ejército madianita?",
    options: ["300 hombres", "1,000 hombres", "3,000 hombres", "10,000 hombres"],
    correct: 0,
    difficulty: "medium",
    explanation: "Jueces 7:7 - Con trescientos hombres que lamieron el agua os salvaré y entregaré a los madianitas."
  },
  {
    question: "¿Quién era la suegra moabita de Rut a quien Rut acompañó fielmente a Belén?",
    options: ["Sara", "Noemí", "Rebeca", "Lea"],
    correct: 1,
    difficulty: "medium",
    explanation: "Rut 1:16 - 'No me ruegues que te deje... tu pueblo será mi pueblo, y tu Dios mi Dios', le dijo Rut a Noemí."
  },
  {
    question: "¿A qué ciego de Jericó devolvió Jesús la vista cuando éste gritó: '¡Hijo de David, ten misericordia de mí!'?",
    options: ["Zaqueo", "Bartimeo", "Malco", "Simón"],
    correct: 1,
    difficulty: "medium",
    explanation: "Marcos 10:46-52 - Bartimeo el ciego, hijo de Timeo, estaba sentado junto al camino mendigando."
  },
  {
    question: "¿Qué apóstol dudó de la resurrección de Jesús hasta que pudo ver y tocar sus heridas?",
    options: ["Felipe", "Tomás", "Bartolomé", "Andrés"],
    correct: 1,
    difficulty: "medium",
    explanation: "Juan 20:25 - Tomás dijo: 'Si no viere en sus manos la señal de los clavos, no creeré'."
  },
  {
    question: "¿Cuál fue el primer milagro público registrado de Jesús en los Evangelios?",
    options: ["Multiplicar los panes", "Caminar sobre el agua", "Convertir el agua en vino en Caná", "Sanar al paralítico"],
    correct: 2,
    difficulty: "medium",
    explanation: "Juan 2:11 - Este principio de señales hizo Jesús en Caná de Galilea, transformando el agua en vino."
  },
  {
    question: "¿Quién era el recaudador de impuestos de baja estatura que se subió a un sicómoro para ver a Jesús?",
    options: ["Nicodemo", "Zaqueo", "Cornelio", "Barrabás"],
    correct: 1,
    difficulty: "medium",
    explanation: "Lucas 19:3-4 - Zaqueo, jefe de publicanos, corrió y se subió a un árbol sicómoro para ver a Jesús."
  },
  {
    question: "¿En qué camino experimentó Saulo de Tarso su impactante conversión al ver una luz del cielo?",
    options: ["Camino a Jericó", "Camino a Damasco", "Camino a Emaús", "Camino a Gaza"],
    correct: 1,
    difficulty: "medium",
    explanation: "Hechos 9:3 - Yendo por el camino, aconteció que al llegar cerca de Damasco, le rodeó un resplandor de luz del cielo."
  },
  {
    question: "¿Quién escribió la mayor parte del libro de los Salmos?",
    options: ["Moisés", "El rey David", "Salomón", "Asaf"],
    correct: 1,
    difficulty: "medium",
    explanation: "Al rey David se le atribuyen al menos 73 de los 150 Salmos del Salterio."
  },
  {
    question: "¿Qué río se convirtió en sangre en la primera plaga sobre Egipto?",
    options: ["Río Jordán", "Río Nilo", "Río Éufrates", "Río Pisón"],
    correct: 1,
    difficulty: "medium",
    explanation: "Éxodo 7:20 - Todas las aguas que había en el río Nilo se convirtieron en sangre."
  },
  {
    question: "¿Cuántas plagas envió Dios sobre Egipto para que el Faraón dejara ir a su pueblo?",
    options: ["7", "10", "12", "40"],
    correct: 1,
    difficulty: "medium",
    explanation: "Éxodo capítulos 7 al 12 relata las 10 plagas sobre Egipto que culminaron con la Pascua."
  },
  {
    question: "¿Quién interpretó los sueños del faraón sobre las siete vacas gordas y las siete vacas flacas?",
    options: ["Daniel", "José", "Nehemías", "Esdras"],
    correct: 1,
    difficulty: "medium",
    explanation: "Génesis 41:25-30 - José explicó que venían 7 años de abundancia seguidos de 7 años de hambre."
  },
  {
    question: "¿Cómo se llamaba la esposa de Abraham y madre de Isaac?",
    options: ["Rebeca", "Sara", "Raquel", "Cetura"],
    correct: 1,
    difficulty: "medium",
    explanation: "Génesis 17:15-19 - Dios prometió que Sara concebiría un hijo a quien llamarían Isaac."
  },
  {
    question: "¿Qué profeta fue llevado al cielo en un carro y torbellino de fuego sin pasar por la muerte?",
    options: ["Eliseo", "Elías", "Isaías", "Enoc"],
    correct: 1,
    difficulty: "medium",
    explanation: "2 Reyes 2:11 - Un carro de fuego y caballos de fuego apartaron a ambos, y Elías subió al cielo en un torbellino."
  },
  {
    question: "¿Qué instrumento tocaba David para calmar el espíritu atormentado del rey Saúl?",
    options: ["La flauta", "El arpa", "La trompeta", "El pandero"],
    correct: 1,
    difficulty: "medium",
    explanation: "1 Samuel 16:23 - David tomaba el arpa y tocaba con su mano; Saúl tenía alivio y se sentía mejor."
  },
  {
    question: "¿Qué pariente de Jesús nació unos seis meses antes que Él y preparó el camino en el desierto?",
    options: ["Esteban", "Juan el Bautista", "Santiago", "Timoteo"],
    correct: 1,
    difficulty: "medium",
    explanation: "Lucas 1:36 - Elisabet, prima de María, concibió a Juan el Bautista seis meses antes de la anunciación a Jesús."
  },
  {
    question: "¿En qué idioma se escribió principalmente el Antiguo Testamento?",
    options: ["Latín", "Griego Koiné", "Hebreo", "Arameo únicamente"],
    correct: 2,
    difficulty: "medium",
    explanation: "El Antiguo Testamento fue redactado originalmente en hebreo, con breves secciones en arameo."
  },

  // =========================================================================
  // NIVEL DIFÍCIL (hard) - 23 Preguntas
  // =========================================================================
  {
    question: "¿Quién fue el hombre más longevo mencionado en la Biblia, alcanzando 969 años?",
    options: ["Enoc", "Matusalén", "Jared", "Lamec"],
    correct: 1,
    difficulty: "hard",
    explanation: "Génesis 5:27 - Todos los días de Matusalén fueron novecientos sesenta y nueve años; y murió."
  },
  {
    question: "¿Cuál es el versículo más corto en la mayoría de las Biblias en español?",
    options: ["Dios es amor", "Jesús lloró", "Orad sin cesar", "Alabad a Dios"],
    correct: 1,
    difficulty: "hard",
    explanation: "Juan 11:35 - 'Jesús lloró', constando únicamente de 10 letras y dos palabras."
  },
  {
    question: "¿En qué isla estaba desterrado el apóstol Juan cuando recibió la visión del Apocalipsis?",
    options: ["Chipre", "Malta", "Creta", "Patmos"],
    correct: 3,
    difficulty: "hard",
    explanation: "Apocalipsis 1:9 - 'Yo Juan... estaba en la isla llamada Patmos, por causa de la palabra de Dios'."
  },
  {
    question: "¿Cómo se llamaba el sumo sacerdote ante quien Jesús fue llevado inicialmente la noche de su arresto?",
    options: ["Caifás", "Anás", "Gamaliel", "Nicodemo"],
    correct: 1,
    difficulty: "hard",
    explanation: "Juan 18:13 - Le llevaron primero a Anás, porque era suegro de Caifás, que era sumo sacerdote aquel año."
  },
  {
    question: "¿Cuál es el capítulo más largo de toda la Biblia, con 176 versículos?",
    options: ["Salmo 23", "Salmo 119", "Isaías 53", "1 Corintios 13"],
    correct: 1,
    difficulty: "hard",
    explanation: "El Salmo 119 tiene 176 versículos y está estructurado como un acróstico alfabético hebreo."
  },
  {
    question: "¿Quién fue el rey que vio una mano misteriosa escribir en la pared 'Mene, Mene, Tequel, Uparsín'?",
    options: ["Nabucodonosor", "Belsasar", "Darío", "Ciro"],
    correct: 1,
    difficulty: "hard",
    explanation: "Daniel 5:1-5 - Durante el banquete del rey Belsasar aparecieron los dedos de una mano de hombre que escribían en la pared."
  },
  {
    question: "¿Qué profeta se casó con Gómer por mandato divino como símbolo de la infidelidad de Israel?",
    options: ["Amós", "Oseas", "Miqueas", "Malaquías"],
    correct: 1,
    difficulty: "hard",
    explanation: "Oseas 1:2-3 - Jehová dijo a Oseas: 'Ve, toma una mujer fornicaria y engendra hijos de fornicación'."
  },
  {
    question: "¿Cómo se llamaban los tres amigos de Daniel que fueron librados del horno de fuego ardiendo?",
    options: ["Efraín, Manasés y Gad", "Sadrac, Mesac y Abed-nego", "Eleazar, Finees e Itamar", "Natán, Gad y Asaf"],
    correct: 1,
    difficulty: "hard",
    explanation: "Daniel 3:12 - Los jóvenes hebreos Sadrac, Mesac y Abed-nego rehusaron adorar la estatua de oro de Nabucodonosor."
  },
  {
    question: "¿Cuál era el nombre hebreo original de la reina Ester antes de recibir su nombre persa?",
    options: ["Hadasa", "Séfora", "Milca", "Dina"],
    correct: 0,
    difficulty: "hard",
    explanation: "Ester 2:7 - Mardoqueo había criado a Hadasa, es decir, Ester, hija de su tío."
  },
  {
    question: "¿Quién fue el sucesor de Moisés que lideró la conquista de Jericó e introdujo a Israel en Canaán?",
    options: ["Caleb", "Josué", "Gedeón", "Otoniel"],
    correct: 1,
    difficulty: "hard",
    explanation: "Josué 1:1-2 - Josué hijo de Nun, servidor de Moisés, recibió la orden de cruzar el Jordán."
  },
  {
    question: "¿Qué apóstol fue elegido por suertes para reemplazar a Judas Iscariote entre los Doce?",
    options: ["Bernabé", "Matías", "Silas", "Lucas"],
    correct: 1,
    difficulty: "hard",
    explanation: "Hechos 1:26 - Y les echaron suertes, y la suerte cayó sobre Matías; y fue contado con los once apóstoles."
  },
  {
    question: "¿Qué rey de Judá fue herido con lepra por entrar con soberbia a quemar incienso en el Templo?",
    options: ["Uzías (Azarías)", "Ezequías", "Josías", "Manasés"],
    correct: 0,
    difficulty: "hard",
    explanation: "2 Crónicas 26:19 - La lepra le brotó en la frente a Uzías en presencia de los sacerdotes en la casa de Jehová."
  },
  {
    question: "¿Cómo se llamaba el criado del profeta Eliseo que fue castigado con lepra por su codicia hacia Naamán?",
    options: ["Giezi", "Baruc", "Urías", "Zadok"],
    correct: 0,
    difficulty: "hard",
    explanation: "2 Reyes 5:26-27 - La lepra de Naamán se le pegó a Giezi y a su descendencia para siempre."
  },
  {
    question: "¿Quién era el general del ejército sirio que fue sanado de lepra al sumergirse 7 veces en el río Jordán?",
    options: ["Ben-hadad", "Naamán", "Hazael", "Senaquerib"],
    correct: 1,
    difficulty: "hard",
    explanation: "2 Reyes 5:14 - Naamán descendió y se lavó siete veces en el Jordán conforme a la palabra del varón de Dios."
  },
  {
    question: "¿En qué monte reposó el arca de Noé una vez que comenzaron a descender las aguas del diluvio?",
    options: ["Monte Ararat", "Monte Sinaí", "Monte Nebo", "Monte Moriah"],
    correct: 0,
    difficulty: "hard",
    explanation: "Génesis 8:4 - Y reposó el arca en el mes séptimo, a los diecisiete días del mes, sobre los montes de Ararat."
  },
  {
    question: "¿Quién fue el abuelo del rey David e hijo de Booz y Rut?",
    options: ["Isaí", "Obed", "Salmón", "Aminadab"],
    correct: 1,
    difficulty: "hard",
    explanation: "Rut 4:17 - Booz engendró a Obed, Obed engendró a Isaí, e Isaí engendró a David."
  },
  {
    question: "¿Qué personaje del Nuevo Testamento era un centurión romano piadoso cuyas oraciones subieron ante Dios?",
    options: ["Cornelio", "Julio", "Galo", "Félix"],
    correct: 0,
    difficulty: "hard",
    explanation: "Hechos 10:1-2 - Había en Cesarea un hombre llamado Cornelio, centurión de la compañía llamada la Italiana."
  },
  {
    question: "¿Cómo se llamaba la mujer valiente que clavó una estaca de la tienda en la sien del general Sísara?",
    options: ["Jael", "Débora", "Abigaíl", "Atalía"],
    correct: 0,
    difficulty: "hard",
    explanation: "Jueces 4:21 - Pero Jael, mujer de Heber, tomó una estaca de la tienda y un mazo, y le atravesó la sien a Sísara."
  },
  {
    question: "¿Cuántos años vivió el patriarca Moisés antes de fallecer en el Monte Nebo?",
    options: ["90 años", "100 años", "120 años", "150 años"],
    correct: 2,
    difficulty: "hard",
    explanation: "Deuteronomio 34:7 - Era Moisés de edad de ciento veinte años cuando murió; sus ojos nunca se oscurecieron."
  },
  {
    question: "¿Qué rey piadoso de Judá comenzó a reinar a los ocho años y promovió una gran reforma al hallar el libro de la Ley?",
    options: ["Josías", "Joás", "Ezequías", "Asa"],
    correct: 0,
    difficulty: "hard",
    explanation: "2 Reyes 22:1-2 - De ocho años era Josías cuando comenzó a reinar, e hizo lo recto ante los ojos de Jehová."
  },
  {
    question: "¿Quién era el compañero de viajes misioneros de Pablo apodado 'Hijo de Consolación'?",
    options: ["Bernabé", "Silas", "Timoteo", "Tito"],
    correct: 0,
    difficulty: "hard",
    explanation: "Hechos 4:36 - José, a quien los apóstoles pusieron por sobrenombre Bernabé (que traducido es, Hijo de consolación)."
  },
  {
    question: "¿Cuál de estos libros NO menciona explícitamente el nombre de Dios en todo su texto?",
    options: ["Ester", "Cantar de los Cantares", "Eclesiastés", "Rut"],
    correct: 0,
    difficulty: "hard",
    explanation: "El libro de Ester se distingue porque nunca menciona el nombre de Dios de forma explícita, mostrando su providencia entre bastidores."
  },
  {
    question: "¿Cómo se llamaba el médico amado y autor del tercer Evangelio y del libro de Hechos de los Apóstoles?",
    options: ["Lucas", "Marcos", "Apolos", "Teófilo"],
    correct: 0,
    difficulty: "hard",
    explanation: "Colosenses 4:14 - 'Os saluda Lucas, el médico amado, y Demas'."
  }
];
