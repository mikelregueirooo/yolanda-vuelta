// Contenido de las páginas de tratamientos. Información general y orientativa:
// revisar con la doctora antes de publicar.

export type Tratamiento = {
  slug: string;
  nombre: string;
  corto: string; // para listados
  resumen: string;
  cuando: string[]; // cuándo se indica, en palabras del paciente
  pasos: { titulo: string; texto: string }[];
  preguntas: { p: string; r: string }[];
  relacionados: string[];
  mensaje: string; // texto que se rellena en WhatsApp
};

export const TRATAMIENTOS: Tratamiento[] = [
  {
    slug: "implantes",
    nombre: "Implantes dentales",
    corto: "Para reponer uno o varios dientes con una raíz de titanio y un diente fijo encima.",
    resumen:
      "Un implante es una pequeña raíz de titanio que se coloca en el hueso. Cuando se ha unido a él, encima se pone un diente fijo que se ve y se usa como uno propio.",
    cuando: ["Te falta un diente o varios", "Llevas una dentadura postiza que se mueve", "Un diente no se puede salvar y hay que quitarlo"],
    pasos: [
      { titulo: "Estudio", texto: "Exploración y pruebas de imagen para ver cuánto hueso hay y dónde colocar el implante." },
      { titulo: "Colocación", texto: "Se coloca el implante en el hueso con anestesia local." },
      { titulo: "Integración", texto: "El hueso se une al implante. Suele llevar unos meses, según cada caso." },
      { titulo: "Diente definitivo", texto: "Sobre el implante se fija la corona, con la forma y el color de tus dientes." },
    ],
    preguntas: [
      { p: "¿Duele?", r: "Se coloca con anestesia local. Las molestias de los días siguientes suelen controlarse con analgésicos." },
      { p: "¿Y si no tengo suficiente hueso?", r: "En muchos casos se puede regenerar. Lo vemos en el estudio previo y te explicamos las opciones." },
      { p: "¿Cuánto dura un implante?", r: "Con buena higiene y revisiones periódicas, un implante puede durar muchos años." },
    ],
    relacionados: ["protesis", "cirugia"],
    mensaje: "Hola, quería información sobre implantes dentales.",
  },
  {
    slug: "ortodoncia",
    nombre: "Ortodoncia",
    corto: "Brackets o alineadores transparentes para colocar los dientes y corregir la mordida.",
    resumen:
      "La ortodoncia mueve los dientes poco a poco hasta su sitio. Se puede hacer con brackets fijos o con alineadores transparentes que se quitan para comer.",
    cuando: ["Tienes los dientes torcidos o montados", "Hay espacios entre los dientes", "No cierras bien la boca al morder"],
    pasos: [
      { titulo: "Estudio", texto: "Fotografías, radiografías y registros de la boca para entender la mordida." },
      { titulo: "Plan", texto: "Te explicamos qué tratamiento encaja contigo: brackets o alineadores." },
      { titulo: "Tratamiento", texto: "Revisiones periódicas en consulta para ajustar el movimiento de los dientes." },
      { titulo: "Retención", texto: "Un retenedor mantiene el resultado cuando termina el tratamiento." },
    ],
    preguntas: [
      { p: "¿Hay edad para la ortodoncia?", r: "No. Se hace en niños, adolescentes y adultos." },
      { p: "¿Brackets o invisible?", r: "Depende del caso y de tus preferencias. En la primera visita te contamos qué opciones tienes." },
      { p: "¿Cuánto dura?", r: "Depende de cada boca. Lo habitual es de unos meses a un par de años." },
    ],
    relacionados: ["estetica", "infantil"],
    mensaje: "Hola, quería información sobre ortodoncia.",
  },
  {
    slug: "estetica",
    nombre: "Estética y blanqueamiento",
    corto: "Blanqueamiento y tratamientos para mejorar el color y la forma de los dientes.",
    resumen:
      "El blanqueamiento aclara el tono del esmalte sin desgastarlo. Buscamos un color natural, que encaje con tu cara, no un blanco artificial.",
    cuando: ["Tus dientes se han oscurecido con los años", "Tienes manchas por café, té o tabaco", "Quieres mejorar la forma de algún diente"],
    pasos: [
      { titulo: "Revisión", texto: "Comprobamos que dientes y encías estén sanos antes de blanquear." },
      { titulo: "Color de partida", texto: "Medimos tu tono con una guía de color para ver el cambio." },
      { titulo: "Blanqueamiento", texto: "En consulta, en casa con férulas o combinando ambos, según el caso." },
    ],
    preguntas: [
      { p: "¿Daña el esmalte?", r: "Bien indicado y controlado por el dentista, no." },
      { p: "¿Da sensibilidad?", r: "Puede haber algo de sensibilidad durante unos días. Suele desaparecer al terminar." },
      { p: "¿Cuánto dura el resultado?", r: "Depende de los hábitos: café, té, vino y tabaco lo acortan." },
    ],
    relacionados: ["ortodoncia", "general"],
    mensaje: "Hola, quería información sobre el blanqueamiento dental.",
  },
  {
    slug: "endodoncia",
    nombre: "Endodoncia",
    corto: "Tratamiento del nervio para conservar el diente en lugar de quitarlo.",
    resumen:
      "Cuando el nervio de un diente se inflama o se infecta, la endodoncia limpia el interior, lo sella y permite conservar la pieza.",
    cuando: ["Te duele una muela sin motivo, sobre todo por la noche", "El dolor al frío o al calor dura mucho", "Se te ha hinchado la encía o la cara"],
    pasos: [
      { titulo: "Diagnóstico", texto: "Exploración y radiografía para confirmar que el nervio está afectado." },
      { titulo: "Limpieza", texto: "Con anestesia, se limpia y desinfecta el interior de los conductos." },
      { titulo: "Sellado", texto: "Se rellenan los conductos para que no vuelvan a infectarse." },
      { titulo: "Reconstrucción", texto: "Se reconstruye el diente. A veces se recomienda una corona para protegerlo." },
    ],
    preguntas: [
      { p: "¿Duele?", r: "Se hace con anestesia. Después puede haber molestias unos días." },
      { p: "¿No es mejor quitar el diente?", r: "Siempre que se pueda, conservar el diente propio es la mejor opción." },
    ],
    relacionados: ["general", "protesis"],
    mensaje: "Hola, tengo dolor en una muela y quería pedir cita.",
  },
  {
    slug: "encias",
    nombre: "Encías e higiene",
    corto: "Limpiezas profesionales y tratamiento de las encías.",
    resumen:
      "Si las encías sangran, es una señal de inflamación. Tratarla a tiempo evita que vaya a más y que los dientes se muevan.",
    cuando: ["Te sangran las encías al cepillarte", "Tienes mal aliento a menudo", "Notas los dientes más largos o que se mueven"],
    pasos: [
      { titulo: "Revisión", texto: "Medimos el estado de las encías y vemos si hay sarro bajo ellas." },
      { titulo: "Limpieza", texto: "Limpieza profesional o, si hace falta, tratamiento más profundo de las encías." },
      { titulo: "Mantenimiento", texto: "Revisiones periódicas para que las encías se mantengan sanas." },
    ],
    preguntas: [
      { p: "¿Cada cuánto hay que hacerse una limpieza?", r: "Depende de cada persona. Te recomendamos la frecuencia en la revisión." },
      { p: "¿Es normal que sangren las encías?", r: "No. El sangrado indica inflamación y conviene revisarlo." },
    ],
    relacionados: ["general", "implantes"],
    mensaje: "Hola, me sangran las encías y quería pedir cita.",
  },
  {
    slug: "cirugia",
    nombre: "Cirugía oral y extracciones",
    corto: "Extracciones, muelas del juicio y cirugía oral en la propia consulta.",
    resumen:
      "Cuando un diente no se puede salvar o una muela del juicio da problemas, lo extraemos con anestesia local y te explicamos cómo cuidarte después.",
    cuando: ["La muela del juicio te molesta o se inflama la encía", "Un diente está roto y no se puede reconstruir", "Te lo ha recomendado tu ortodoncia"],
    pasos: [
      { titulo: "Estudio", texto: "Radiografía para ver la posición del diente y planificar la extracción." },
      { titulo: "Extracción", texto: "Con anestesia local." },
      { titulo: "Recuperación", texto: "Te damos las indicaciones para los días siguientes y revisamos la zona." },
    ],
    preguntas: [
      { p: "¿Hay que quitar siempre las muelas del juicio?", r: "No. Solo cuando dan problemas o pueden darlos. Lo valoramos con una radiografía." },
      { p: "¿Qué hay que hacer después?", r: "Te explicamos los cuidados: frío, comida blanda y cuidado con la zona los primeros días." },
    ],
    relacionados: ["implantes", "protesis"],
    mensaje: "Hola, quería pedir cita por una muela del juicio.",
  },
  {
    slug: "infantil",
    nombre: "Niños y PADI",
    corto: "Revisiones y tratamientos para niños. De 7 a 15 años, con el PADI de Osakidetza.",
    resumen:
      "Somos consulta concertada del PADI, el programa de atención dental infantil del País Vasco. De 7 a 15 años, la atención dental básica corre a cargo de Osakidetza.",
    cuando: ["Es su revisión anual del PADI", "Tiene una caries o le duele un diente", "Se ha dado un golpe en un diente"],
    pasos: [
      { titulo: "Pide cita", texto: "Llámanos y dinos que es para el PADI." },
      { titulo: "Trae la tarjeta", texto: "La tarjeta sanitaria de Osakidetza del niño o la niña." },
      { titulo: "Revisión", texto: "Revisamos la boca y, si hace falta, hacemos el tratamiento." },
    ],
    preguntas: [
      { p: "¿Qué incluye el PADI?", r: "Revisión anual, selladores, empastes, limpiezas, extracciones y endodoncias en dientes definitivos." },
      { p: "¿Y la ortodoncia?", r: "La ortodoncia no está incluida en el PADI. Si la necesita, te explicamos las opciones." },
      { p: "¿Y antes de los 7 años?", r: "También atendemos a niños más pequeños, de forma privada." },
    ],
    relacionados: ["general", "ortodoncia"],
    mensaje: "Hola, quería pedir cita del PADI para mi hijo/a.",
  },
  {
    slug: "protesis",
    nombre: "Prótesis dentales",
    corto: "Coronas, puentes y dentaduras, fijas o removibles.",
    resumen:
      "Las prótesis reponen dientes perdidos o protegen los muy dañados. Pueden ser fijas, como coronas y puentes, o removibles.",
    cuando: ["Te faltan dientes y no quieres o no puedes ponerte implantes", "Un diente está muy dañado y necesita una funda", "Tu dentadura postiza ya no ajusta bien"],
    pasos: [
      { titulo: "Valoración", texto: "Vemos qué tipo de prótesis encaja con tu boca." },
      { titulo: "Registro", texto: "Tomamos medidas de la boca para fabricar la prótesis." },
      { titulo: "Prueba y ajuste", texto: "Probamos la prótesis y la ajustamos para que sea cómoda." },
    ],
    preguntas: [
      { p: "¿Fija o removible?", r: "Depende de los dientes que quedan y del hueso. Te explicamos las opciones." },
      { p: "¿Se puede poner una prótesis fija sobre implantes?", r: "Sí, es una de las opciones más estables." },
    ],
    relacionados: ["implantes", "general"],
    mensaje: "Hola, quería información sobre prótesis dentales.",
  },
  {
    slug: "general",
    nombre: "Revisiones y empastes",
    corto: "Revisiones, empastes y lo que necesites para mantener la boca sana.",
    resumen:
      "Una revisión a tiempo evita tratamientos más largos. Detectamos las caries cuando son pequeñas y las tratamos con empastes del color del diente.",
    cuando: ["Hace más de un año de tu última revisión", "Notas una mancha o un agujero en un diente", "Te molesta un diente al comer dulce o frío"],
    pasos: [
      { titulo: "Revisión", texto: "Exploración completa de dientes y encías." },
      { titulo: "Diagnóstico", texto: "Te explicamos lo que vemos y lo que recomendamos." },
      { titulo: "Tratamiento", texto: "Empastes y lo que haga falta, en la misma consulta." },
    ],
    preguntas: [
      { p: "¿Cada cuánto debo ir al dentista?", r: "Como norma general, una vez al año. Te recomendamos la frecuencia según tu boca." },
      { p: "¿Los empastes se notan?", r: "Se hacen del color del diente para que no se noten." },
    ],
    relacionados: ["encias", "endodoncia"],
    mensaje: "Hola, quería pedir cita para una revisión.",
  },
];

export const porSlug = (slug: string) => TRATAMIENTOS.find((t) => t.slug === slug);
